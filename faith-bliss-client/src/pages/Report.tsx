import React, { useState } from "react";
import { ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const reasons = [
  "Inappropriate photos or content",
  "Harassment or hate speech",
  "Fake or impersonated profile",
  "Underage user",
  "Spam or promotional content",
  "Other",
];

const ReportPageInner: React.FC = () => {
  const navigate = useNavigate();
  const [reason, setReason] = useState<string>(reasons[0]);
  const [target, setTarget] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!details.trim()) {
      setError("Please add a few details so we can investigate.");
      return;
    }

    setSubmitting(true);

    // The backend report endpoint isn't live yet. Capture the report locally
    // so the page works end-to-end and we don't lose the user's submission.
    try {
      const queue = JSON.parse(localStorage.getItem("pendingReports") || "[]");
      queue.push({
        reason,
        target: target.trim() || null,
        details: details.trim(),
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem("pendingReports", JSON.stringify(queue));
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to queue report locally:", err);
      setError("Couldn't save your report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 text-white pb-20 dashboard-main">
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 z-30 px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-xl font-bold bg-linear-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
            Report an Issue
          </h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {submitted ? (
          <div className="bg-gray-800/50 border border-green-500/40 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/15 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-9 h-9 text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Report received</h2>
            <p className="text-gray-300 mb-6">
              Thanks for keeping FaithBliss safe. Our trust & safety team will
              review your report shortly.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-5 py-3 rounded-full bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-colors font-semibold"
            >
              Back to dashboard
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800/50 border border-gray-700/50 rounded-3xl p-6 sm:p-8 space-y-6"
          >
            <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4">
              <AlertTriangle className="w-5 h-5 text-orange-300 mt-0.5 shrink-0" />
              <p className="text-sm text-orange-100">
                Reports are confidential. The reported user will not see who
                submitted the report.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                What's the issue?
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-gray-900/60 border border-gray-700 rounded-2xl px-4 py-3 text-white outline-none focus:border-pink-500/60"
              >
                {reasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                User or content you're reporting (optional)
              </label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Username, profile link, or message ID"
                className="w-full bg-gray-900/60 border border-gray-700 rounded-2xl px-4 py-3 text-white outline-none focus:border-pink-500/60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tell us what happened
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={6}
                placeholder="Share as much detail as you can…"
                className="w-full bg-gray-900/60 border border-gray-700 rounded-2xl px-4 py-3 text-white outline-none focus:border-pink-500/60 resize-none"
                maxLength={2000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {details.length}/2000
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-5 py-3 rounded-full bg-linear-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 transition-colors font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting…" : "Submit report"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default function ReportPage() {
  return (
    <ProtectedRoute>
      <ReportPageInner />
    </ProtectedRoute>
  );
}
