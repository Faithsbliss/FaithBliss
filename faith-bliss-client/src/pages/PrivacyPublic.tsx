import { Link } from "react-router-dom";
import { FaithBlissLogo } from "@/components/branding/FaithBlissLogo";

/** Public privacy overview; replace with counsel-approved policy before formal launch. */
export default function PrivacyPublic() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-pink-300">
            <FaithBlissLogo imgProps={{ className: "h-8 w-auto shrink-0 object-contain" }} />
            <span className="font-bold">FaithBliss</span>
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6 text-white">Privacy</h1>
        <p className="text-gray-400 text-sm mb-8">
          Last updated: April 30, 2026
        </p>
        <div className="space-y-4 text-gray-300 leading-relaxed text-sm">
          <p>
            We collect the information you provide when you create an account and use FaithBliss
            (such as profile details, messages you send, and content you upload), and technical
            data needed to run and secure the service.
          </p>
          <p>
            We use this data to operate the platform, keep accounts safe, and improve the product.
            We do not sell your personal information.
          </p>
          <p>
            For questions or data requests, contact{" "}
            <a href="mailto:support@faithblissafrica.com" className="text-pink-400 hover:underline">
              support@faithblissafrica.com
            </a>
            .
          </p>
        </div>
        <p className="mt-10 text-xs text-gray-500">
          This page is a high-level summary. A full legal privacy policy should be reviewed by
          qualified counsel for your jurisdiction.
        </p>
        <Link to="/" className="inline-block mt-8 text-pink-400 hover:text-pink-300 text-sm">
          ← Back to home
        </Link>
      </main>
    </div>
  );
}
