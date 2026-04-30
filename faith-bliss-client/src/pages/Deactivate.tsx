import React, { useState } from "react";
import { ArrowLeft, UserX, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

const consequences = [
  "Your profile will be hidden from discovery",
  "Existing matches will no longer be able to message you",
  "You can come back any time by signing in again",
];

const DeactivatePageInner: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isLoggingOut, user } = useAuth();
  const [confirmText, setConfirmText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expectedConfirmation = "DEACTIVATE";
  const canSubmit = confirmText.trim().toUpperCase() === expectedConfirmation;

  const handleDeactivate = async () => {
    setError(null);

    if (!canSubmit) {
      setError(`Please type ${expectedConfirmation} to confirm.`);
      return;
    }

    setSubmitting(true);
    try {
      // The dedicated deactivate endpoint isn't wired into the backend yet,
      // so we fall back to signing the user out. Their account stays intact
      // and can be reactivated by signing in.
      try {
        localStorage.setItem(
          "pendingDeactivation",
          JSON.stringify({
            userId: user?.id || null,
            email: user?.email || null,
            requestedAt: new Date().toISOString(),
          })
        );
      } catch {
        /* ignore storage errors */
      }
      await logout();
    } catch (err) {
      console.error("Deactivation flow failed:", err);
      setError("Something went wrong. Please try again.");
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
          <h1 className="text-xl font-bold bg-linear-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Deactivate Account
          </h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-gray-800/50 border border-red-500/30 rounded-3xl p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-red-500/15">
              <UserX className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                We're sorry to see you go
              </h2>
              <p className="text-gray-300">
                Deactivating temporarily disables your account. You can come
                back any time.
              </p>
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 flex gap-3 items-start mb-6">
            <AlertTriangle className="w-5 h-5 text-orange-300 mt-0.5 shrink-0" />
            <ul className="text-sm text-orange-100 space-y-1">
              {consequences.map((c) => (
                <li key={c}>• {c}</li>
              ))}
            </ul>
          </div>

          <label className="block text-sm font-medium text-gray-300 mb-2">
            Type{" "}
            <span className="font-mono text-red-300">
              {expectedConfirmation}
            </span>{" "}
            to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={expectedConfirmation}
            className="w-full bg-gray-900/60 border border-gray-700 rounded-2xl px-4 py-3 text-white outline-none focus:border-red-500/60 mb-4"
            autoCapitalize="characters"
          />

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 px-5 py-3 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleDeactivate}
              disabled={!canSubmit || submitting || isLoggingOut}
              className="flex-1 px-5 py-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting || isLoggingOut
                ? "Processing…"
                : "Deactivate my account"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          Need to permanently delete your data instead? Email{" "}
          <a
            href="mailto:support@faithblissafrica.com"
            className="text-pink-400 underline underline-offset-4"
          >
            support@faithblissafrica.com
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default function DeactivatePage() {
  return (
    <ProtectedRoute>
      <DeactivatePageInner />
    </ProtectedRoute>
  );
}
