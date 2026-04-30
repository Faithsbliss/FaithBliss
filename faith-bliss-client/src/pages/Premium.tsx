import React from "react";
import { ArrowLeft, Star, Heart, Eye, Sparkles, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const features = [
  {
    icon: Heart,
    title: "Unlimited Likes",
    body: "Connect with as many believers as you want — never hit a daily limit.",
    color: "text-pink-400",
    bg: "bg-pink-500/15",
    border: "border-pink-500/30",
  },
  {
    icon: Eye,
    title: "See Who Liked You",
    body: "Skip the guessing game and instantly see everyone interested in you.",
    color: "text-purple-400",
    bg: "bg-purple-500/15",
    border: "border-purple-500/30",
  },
  {
    icon: Sparkles,
    title: "Priority Discovery",
    body: "Your profile gets shown first in nearby believers' decks.",
    color: "text-yellow-300",
    bg: "bg-yellow-500/15",
    border: "border-yellow-500/30",
  },
  {
    icon: MessageCircle,
    title: "Read Receipts",
    body: "Know when your conversations have been seen.",
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
  },
];

const PremiumPageInner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 text-white pb-20 dashboard-main">
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 z-30 px-4 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-xl font-bold bg-linear-to-r from-yellow-300 to-pink-400 bg-clip-text text-transparent">
            FaithBliss Premium
          </h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 pt-10 pb-6">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-linear-to-r from-yellow-400 to-pink-500 flex items-center justify-center mb-6 shadow-2xl shadow-pink-500/20">
            <Star className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Unlock the full FaithBliss experience
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-base sm:text-lg">
            Premium gives you tools to find a meaningful, faith-aligned
            connection faster.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className={`bg-gray-800/40 border ${f.border} rounded-3xl p-6 flex gap-4 items-start`}
          >
            <div className={`p-3 rounded-2xl ${f.bg}`}>
              <f.icon className={`w-6 h-6 ${f.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-5 mt-10">
        <div className="bg-linear-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-3xl p-6 text-center">
          <p className="text-gray-300 mb-4">
            Premium isn't billable yet — we're polishing the experience first.
            Want early access? Drop us a note from{" "}
            <Link
              to="/help"
              className="text-pink-400 underline underline-offset-4"
            >
              Help & Support
            </Link>
            .
          </p>
          <button
            disabled
            className="px-6 py-3 rounded-full bg-linear-to-r from-yellow-400 to-pink-500 text-white font-semibold opacity-60 cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
};

export default function PremiumPage() {
  return (
    <ProtectedRoute>
      <PremiumPageInner />
    </ProtectedRoute>
  );
}
