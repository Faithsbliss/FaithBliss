import express from 'express';
import * as pdfLib from 'pdf-lib';
import fs from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import * as fontkit from 'fontkit'; // ✅ correct

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const CERT_TEMPLATE_PATH = path.join(__dirname, '../assets/certificate_template.pdf');
const CUSTOM_FONT_PATH = path.join(__dirname, '../assets/fonts/GreatVibes-Regular.ttf');

// ==============================
// Text helpers (Uses regularFont, not affected by pdfLib prefix)
// ==============================
const wrapTextLines = (text, font, size, maxWidth) => {
  const words = String(text || '').split(/\s+/);
  const lines = [];
  let current = [];
  for (const w of words) {
    const test = current.length ? current.concat(w).join(' ') : w;
    const wWidth = font.widthOfTextAtSize(test, size);
    if (wWidth <= maxWidth) current.push(w);
    else {
      if (current.length) lines.push(current.join(' '));
      current = [w];
    }
  }
  if (current.length) lines.push(current.join(' '));
  return lines;
};

const findFittingFontSize = (font, text, maxSize, minSize, maxWidth) => {
  let size = maxSize;
  while (size >= minSize) {
    if (font.widthOfTextAtSize(String(text || ''), size) <= maxWidth) return size;
    size -= 1;
  }
  return minSize;
};

// ==============================
// HEALTH CHECK ROUTE (For UptimeRobot/Keep-Alive)
// ==============================
router.get('/health', (req, res) => {
    // This is a fast endpoint designed just to return a 200 status
    res.status(200).json({ status: 'OK', service: 'Certificate API is active' });
});

// ==============================
// MAIN ROUTE
// ==============================
router.post('/generate-pdf', async (req, res) => {
    try {
        const debug = (req.query.debug || 'false').toString().toLowerCase() === 'true';

        const {
            studentName = '',
            awardTitle = '',
            courseDetails = '',
            certificateId = '',
            verificationUrl = '',
            directorSignature = '' // 👈 MODIFIED: Added directorSignature
        } = req.body || {};

        const existingPdfBytes = await fs.readFile(CERT_TEMPLATE_PATH);
const pdfDoc = await pdfLib.PDFDocument.load(existingPdfBytes);

// REQUIRED for custom fonts
pdfDoc.registerFontkit(fontkit);

const firstPage = pdfDoc.getPages()[0];
const pageWidth = firstPage.getWidth();
const pageHeight = firstPage.getHeight();

        // Fonts
        // ✅ Use pdfLib.StandardFonts
        const regularFont = await pdfDoc.embedFont(pdfLib.StandardFonts.TimesRoman);
        const boldFont = await pdfDoc.embedFont(pdfLib.StandardFonts.TimesRomanBold);
        
        // Load custom font file
        const customFontBytes = await fs.readFile(CUSTOM_FONT_PATH); 
        const scriptNameFont = await pdfDoc.embedFont(customFontBytes); 
        
        const awardFont = await pdfDoc.embedFont(pdfLib.StandardFonts.HelveticaBold); 

        // Colors
        // ✅ Use pdfLib.rgb
        const darkGrey = pdfLib.rgb(0.07, 0.07, 0.09);
        const mediumGrey = pdfLib.rgb(0.18, 0.18, 0.20);
        const lightGrey = pdfLib.rgb(0.45, 0.45, 0.45);

        // Debug colors 
        const debugColors = {
            name: pdfLib.rgb(0.92, 0.8, 0.8),
            awardTitle: pdfLib.rgb(0.95, 0.92, 0.78),
            courseDetails: pdfLib.rgb(0.8, 0.95, 0.9),
            certificateId: pdfLib.rgb(0.95, 0.85, 0.9),
            directorName: pdfLib.rgb(0.5, 0.5, 0.9), // New debug color for director name
            qr: pdfLib.rgb(0.92, 0.92, 0.92),
            verificationLink: pdfLib.rgb(0.78, 0.78, 0.8)
        };

        // ===========================================
        // FINAL PERFECTED ANCHORS
        // ===========================================
        const anchors = {
            name: {
                leftPct: 0.34,
                rightPct: 0.82,
                yPct: 0.37, 
                maxSize: 100,
                minSize: 20,
                lineHeight: 1.05,
                font: scriptNameFont, // Custom script font used here
                color: darkGrey
            },

            awardTitle: {
                leftPct: 0.18,
                rightPct: 0.96,
                yPct: 0.32, 
                maxSize: 30,
                minSize: 12,
                lineHeight: 1.03,
                font: awardFont,
                color: darkGrey
            },

            courseDetails: {
                leftPct: 0.12,
                rightPct: 1.14,
                yPct: 0.29,
                maxSize: 18,
                minSize: 10,
                lineHeight: 1.03,
                font: awardFont,
                color: mediumGrey
            },

            certificateId: {
                leftPct: 0.20,
                rightPct: 0.30,
                yPct: 0.14, 
                maxSize: 20,
                minSize: 12,
                lineHeight: 1.0,
                font: boldFont,
                color: mediumGrey
            },

            directorName: { // 👈 ADDED: New anchor for director's name
                leftPct: 0.20,
                rightPct: 0.60,
                yPct: 0.055, 
                maxSize: 18,
                minSize: 10,
                font: boldFont,
                color: mediumGrey
            },

            verificationLink: {
                leftPct: 0.60,
                rightPct: 0.90,
                yPct: 0.14,
                maxSize: 15,
                minSize: 12,
                font: boldFont,
                color: darkGrey
            },

            qr: {
                centerXPct: 0.15,
                centerYPct: 0.16, 
                sizePctOfWidth: 0.08
            }
        };

        // utility for converting % (Unchanged)
        const boxCoords = (b) => {
            const left = Math.round(b.leftPct * pageWidth);
            const right = Math.round(b.rightPct * pageWidth);
            const width = right - left;
            const y = Math.round(b.yPct * pageHeight);
            return { left, right, width, y };
        };

        // ===========================
        // DRAWING LOGIC (Using updated anchor properties)
        // ===========================
        
        // ... (NAME, AWARD TITLE, COURSE DETAILS drawing logic unchanged for brevity)
        
        // ===========================
        // NAME
        // ===========================
        {
            const b = anchors.name;
            const { left, width, y } = boxCoords(b);
            const usedSize = findFittingFontSize(b.font, studentName, b.maxSize, b.minSize, width);
            const textWidth = b.font.widthOfTextAtSize(studentName, usedSize);
            const x = left + (width - textWidth) / 2;

            firstPage.drawText(studentName, {
                x, y,
                size: usedSize,
                font: b.font,
                color: b.color
            });

            if (debug) {
                firstPage.drawRectangle({
                    x: left,
                    y: y - usedSize * 1.15,
                    width,
                    height: usedSize * 1.4,
                    borderColor: debugColors.name,
                    borderWidth: 1
                });
                firstPage.drawText('NAME', { x: left + 4, y: y + 6, size: 8, font: regularFont, color: debugColors.name });
            }
        }

        // ===========================
        // AWARD TITLE (Unchanged font)
        // ===========================
        {
            const b = anchors.awardTitle;
            const { left, width, y } = boxCoords(b);
            const usedSize = findFittingFontSize(b.font, awardTitle, b.maxSize, b.minSize, width);
            const tw = b.font.widthOfTextAtSize(awardTitle, usedSize);
            const x = left + (width - tw) / 2;

            firstPage.drawText(awardTitle, {
                x, y,
                size: usedSize,
                font: b.font,
                color: darkGrey
            });

            if (debug) {
                firstPage.drawRectangle({
                    x: left,
                    y: y - usedSize * 1.12,
                    width,
                    height: usedSize * 1.3,
                    borderColor: debugColors.awardTitle,
                    borderWidth: 1
                });
                firstPage.drawText('AWARD', { x: left + 4, y: y + 6, size: 8, font: regularFont, color: debugColors.awardTitle });
            }
        }

        // ===========================
        // COURSE DETAILS (Unchanged font)
        // ===========================
        {
            const b = anchors.courseDetails;
            const { left, width, y } = boxCoords(b);

            let usedSize = b.maxSize;
            let lines = wrapTextLines(courseDetails, b.font, usedSize, width);

            while (lines.length > 5 && usedSize > b.minSize) {
                usedSize -= 1;
                lines = wrapTextLines(courseDetails, b.font, usedSize, width);
            }

            const lineHeightPx = Math.round(usedSize * b.lineHeight);
            let startY = y + Math.round((lines.length - 1) * lineHeightPx / 2);

            for (const line of lines) {
                const w = b.font.widthOfTextAtSize(line, usedSize);
                const x = left + (width - w) / 2;
                firstPage.drawText(line, {
                    x,
                    y: startY,
                    size: usedSize,
                    font: b.font,
                    color: mediumGrey
                });
                startY -= lineHeightPx;
            }

            if (debug) {
                const totalH = lines.length * lineHeightPx;
                firstPage.drawRectangle({
                    x: left,
                    y: y - Math.round(totalH / 2) - 4,
                    width,
                    height: totalH + 8,
                    borderColor: debugColors.courseDetails,
                    borderWidth: 1
                });
                firstPage.drawText('COURSE DETAILS', { x: left + 4, y: y + 6, size: 8, font: regularFont, color: debugColors.courseDetails });
            }
        }
        
        // ===========================
        // CERTIFICATE ID (Unchanged - IMPORTANT: keeps ID display)
        // ===========================
        {
            const b = anchors.certificateId;
            const { left, width, y } = boxCoords(b);
            const usedSize = findFittingFontSize(b.font, certificateId, b.maxSize, b.minSize, width);

            firstPage.drawText('CERTIFICATE ID:', {
                x: left,
                y: y + usedSize + 2,
                size: Math.max(usedSize - 1, 8),
                font: b.font,
                color: b.color
            });

            firstPage.drawText(String(certificateId), {
                x: left,
                y,
                size: usedSize,
                font: b.font,
                color: b.color
            });

            if (debug) {
                firstPage.drawRectangle({
                    x: left,
                    y: y - usedSize * 1.15,
                    width,
                    height: usedSize * 2.6,
                    borderColor: debugColors.certificateId,
                    borderWidth: 1
                });
                firstPage.drawText('CERT ID', { x: left + 4, y: y + usedSize + 8, size: 8, font: regularFont, color: debugColors.certificateId });
            }
        }

        // ===========================
        // VERIFICATION LINK
        // ===========================
        if (verificationUrl) {
            const b = anchors.verificationLink;
            const { right, width, y } = boxCoords(b);
            const usedSize = findFittingFontSize(b.font, verificationUrl, b.maxSize, b.minSize, width);
            const labelSize = Math.max(usedSize - 1, 5);
            const labelText = 'VERIFY AT:';
            const labelWidth = boldFont.widthOfTextAtSize(labelText, labelSize);
            const urlWidth = b.font.widthOfTextAtSize(verificationUrl, usedSize);

            firstPage.drawText(labelText, {
                x: right - labelWidth,
                y: y + usedSize + 2,
                size: labelSize,
                font: boldFont,
                color: darkGrey
            });

            firstPage.drawText(verificationUrl, {
                x: right - urlWidth,
                y,
                size: usedSize,
                font: b.font,
                color: b.color
            });

            if (debug) {
                firstPage.drawRectangle({
                    x: right - width,
                    y: y - usedSize * 1.15,
                    width,
                    height: usedSize * 2.6,
                    borderColor: debugColors.verificationLink,
                    borderWidth: 1
                });
                firstPage.drawText('VERIFY LINK', {
                    x: right - width + 4,
                    y: y + usedSize + 8,
                    size: 8,
                    font: regularFont,
                    color: debugColors.verificationLink
                });
            }
        }
        
        // ===========================
        // DIRECTOR NAME (NEW)
        // ===========================
        if (directorSignature) {
            const b = anchors.directorName;
            const { left, width, y } = boxCoords(b);
            const usedSize = findFittingFontSize(b.font, directorSignature, b.maxSize, b.minSize, width);
            const tw = b.font.widthOfTextAtSize(directorSignature, usedSize);
            const x = left + (width - tw) / 2; // Center text in its box

            // ❌ REMOVED: Signature line drawing
            /*
            firstPage.drawLine({
                start: { x: left, y: y + usedSize + 2 },
                end: { x: left + width, y: y + usedSize + 2 },
                thickness: 1,
                color: darkGrey
            });
            */

            // Draw Director Name
            firstPage.drawText(directorSignature, {
                x,
                y,
                size: usedSize,
                font: b.font,
                color: b.color
            });

            if (debug) {
                firstPage.drawRectangle({
                    x: left,
                    y: y - usedSize * 1.15,
                    width,
                    height: usedSize * 2.6,
                    borderColor: debugColors.directorName,
                    borderWidth: 1
                });
                firstPage.drawText('DIRECTOR NAME', { x: left + 4, y: y + usedSize + 8, size: 8, font: regularFont, color: debugColors.directorName });
            }
        }

        // ===========================
        // QR CODE (Unchanged - IMPORTANT: keeps QR code)
        // ===========================
        if (verificationUrl) {
            const q = anchors.qr;
            const centerX = Math.round(q.centerXPct * pageWidth);
            const centerY = Math.round(q.centerYPct * pageHeight);
            const qrSize = Math.round(q.sizePctOfWidth * pageWidth);

            const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
                margin: 1,
                width: 1024
            });
            const qrImage = await pdfDoc.embedPng(qrDataUrl);

            firstPage.drawImage(qrImage, {
                x: centerX - qrSize / 2,
                y: centerY - qrSize / 2,
                width: qrSize,
                height: qrSize
            });

            if (debug) {
                firstPage.drawRectangle({
                    x: centerX - qrSize / 2,
                    y: centerY - qrSize / 2,
                    width: qrSize,
                    height: qrSize,
                    borderColor: debugColors.qr,
                    borderWidth: 1
                });
                firstPage.drawText('QR', { x: centerX - 8, y: centerY + qrSize / 2 - 8, size: 8, font: regularFont, color: debugColors.qr });
            }
        }

        // Output PDF
        const pdfBytes = await pdfDoc.save();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="certificate_${certificateId || 'preview'}.pdf"`);
        return res.send(pdfBytes);

    } catch (err) {
        console.error('Error generating certificate PDF:', err);
        // Add a specific error message if the font file is missing
        if (err.code === 'ENOENT' && err.path === CUSTOM_FONT_PATH) {
            return res.status(500).json({ message: 'Failed to generate PDF. Custom font file not found at: ' + CUSTOM_FONT_PATH, error: String(err) });
        }
        return res.status(500).json({ message: 'Failed to generate PDF certificate', error: String(err) });
    }
});

export default router;
