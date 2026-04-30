import React, { useState } from "react";
import { ArrowLeft, Bell, Shield, Eye, Globe, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthContext } from "@/contexts/AuthContext";

interface ToggleRowProps {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (next: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  value,
  onChange,
}) => (
  <div className="flex items-center justify-between py-4">
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-xl ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <h4 className="text-white font-semibold">{title}</h4>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors ${
        value ? "bg-pink-500" : "bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-6 w-6 translate-x-0.5 translate-y-0.5 transform rounded-full bg-white transition-transform ${
          value ? "translate-x-[1.4rem]" : "translate-x-0.5"
        }`}
      />
    </button>
  </div>
);

const SettingsPageInner: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isLoggingOut, user } = useAuthContext();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showDistance, setShowDistance] = useState(true);

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
            Settings
          </h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {user && (
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-3xl p-6">
            <h2 className="text-lg font-semibold mb-1">Account</h2>
            <p className="text-gray-400 text-sm mb-4">
              Signed in as <span className="text-white">{user.email}</span>
            </p>
            <Link
              to="/profile"
              className="inline-block px-4 py-2 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-sm text-white transition-colors"
            >
              Edit profile
            </Link>
          </div>
        )}

        <div className="bg-gray-800/50 border border-gray-700/50 rounded-3xl px-6 py-2 divide-y divide-gray-700/50">
          <h2 className="text-lg font-semibold py-4">Notifications</h2>
          <ToggleRow
            icon={Bell}
            iconColor="text-pink-400"
            iconBg="bg-pink-500/20"
            title="Push notifications"
            subtitle="New matches, messages and likes"
            value={pushNotifications}
            onChange={setPushNotifications}
          />
          <ToggleRow
            icon={Bell}
            iconColor="text-blue-400"
            iconBg="bg-blue-500/20"
            title="Email notifications"
            subtitle="Weekly digest and account updates"
            value={emailNotifications}
            onChange={setEmailNotifications}
          />
        </div>

        <div className="bg-gray-800/50 border border-gray-700/50 rounded-3xl px-6 py-2 divide-y divide-gray-700/50">
          <h2 className="text-lg font-semibold py-4">Privacy</h2>
          <ToggleRow
            icon={Eye}
            iconColor="text-green-400"
            iconBg="bg-green-500/20"
            title="Show online status"
            subtitle="Let others see when you're active"
            value={showOnlineStatus}
            onChange={setShowOnlineStatus}
          />
          <ToggleRow
            icon={Globe}
            iconColor="text-purple-400"
            iconBg="bg-purple-500/20"
            title="Show distance"
            subtitle="Display approximate distance to other believers"
            value={showDistance}
            onChange={setShowDistance}
          />
        </div>

        <div className="bg-gray-800/50 border border-gray-700/50 rounded-3xl p-6 space-y-3">
          <h2 className="text-lg font-semibold">Account actions</h2>
          <Link
            to="/deactivate"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/15 transition-colors"
          >
            <Shield className="w-5 h-5 text-orange-400" />
            <span className="text-orange-200">Deactivate account</span>
          </Link>
          <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/15 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            <span className="text-red-200">
              {isLoggingOut ? "Signing out…" : "Sign out"}
            </span>
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 pt-4">
          Settings preferences are stored locally for now. Server sync is
          coming soon.
        </p>
      </div>
    </div>
  );
};

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsPageInner />
    </ProtectedRoute>
  );
}
