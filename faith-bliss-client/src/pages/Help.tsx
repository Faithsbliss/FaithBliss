import React, { useState } from "react";
import { ArrowLeft, ChevronDown, Mail, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const faqs = [
  {
    q: "How do matches work?",
    a: "When two believers like each other, you'll get matched and can start a conversation. You can find your matches in the Matches tab.",
  },
  {
    q: "How do I edit my profile or photos?",
    a: "Tap the Profile menu item, then choose the Photos or Basic Info tab to update your details. Don't forget to save your changes.",
  },
  {
    q: "How do I report inappropriate behavior?",
    a: "Open the user's profile and use the Report option, or visit Report an Issue from the side menu to report content or users.",
  },
  {
    q: "Can I pause or delete my account?",
    a: "Yes — go to Settings → Deactivate account to temporarily disable your profile. Reach out to support for permanent deletion.",
  },
  {
    q: "Why am I not getting matches?",
    a: "Make sure your profile photos and bio are filled out, and try expanding your discovery filters from the dashboard.",
  },
];

const HelpPageInner: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 text-white pb-20 dashboard-main">
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 z-30 px-4 py-4">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-xl font-bold bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Help & Support
          </h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <section className="bg-gray-800/50 border border-gray-700/50 rounded-3xl p-6">
          <h2 className="text-lg font-semibold mb-4">Frequently asked</h2>
          <div className="divide-y divide-gray-700/50">
            {faqs.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.q} className="py-3">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between text-left gap-4 py-2"
                  >
                    <span className="font-medium text-white">{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="text-gray-300 text-sm leading-relaxed pb-2">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-gray-800/50 border border-gray-700/50 rounded-3xl p-6">
          <h2 className="text-lg font-semibold mb-2">Still need help?</h2>
          <p className="text-gray-400 text-sm mb-5">
            Our team typically responds within one business day.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="mailto:support@faithblissafrica.com"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/15 transition-colors"
            >
              <Mail className="w-5 h-5 text-pink-400" />
              <div>
                <p className="text-white text-sm font-semibold">Email us</p>
                <p className="text-gray-400 text-xs">
                  support@faithblissafrica.com
                </p>
              </div>
            </a>
            <a
              href="https://faithblissafrica.com/contact"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/15 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white text-sm font-semibold">
                  Contact form
                </p>
                <p className="text-gray-400 text-xs">
                  faithblissafrica.com/contact
                </p>
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default function HelpPage() {
  return (
    <ProtectedRoute>
      <HelpPageInner />
    </ProtectedRoute>
  );
}
