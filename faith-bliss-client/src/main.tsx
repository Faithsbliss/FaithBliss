// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import Home from "./pages/Home.tsx";
import "./index.css";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";
import Dashboard from "./pages/Dashboard.tsx";
// 💡 CORRECTION: Import the ProfilePage component directly, as ProtectedRoute wrapper is removed inside.
import ProfilePage from "./pages/UserProfileView.tsx";
import Profile from "./pages/Profile.tsx";
// 💡 ADDITION: Import the Messages component
import Messages from "./pages/Messages.tsx";
import OnboardingRouteWrapper from "./pages/OnboardingPage.tsx";
import MatchPage from "./pages/MatchesPage.tsx";
import PremiumPage from "./pages/Premium.tsx";
import SettingsPage from "./pages/Settings.tsx";
import HelpPage from "./pages/Help.tsx";
import ReportPage from "./pages/Report.tsx";
import DeactivatePage from "./pages/Deactivate.tsx";

// Import the Contexts and Gates
import { ToastProvider } from "./contexts/ToastContext.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { AuthGate, PublicOnlyRoute } from "./components/AuthGate.tsx";
import Chat from "./pages/Chat.tsx";
import ConversationInitializer from "./pages/ConversationInitializer.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create Query Client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Route 1: The Landing Page (No Auth required) */}
              <Route path="/" element={<Home />} />

              {/* Route 2: Public Routes (Login/Signup) */}
              <Route element={<PublicOnlyRoute />}>
                <Route element={<App />}>
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<SignUp />} />
                </Route>
              </Route>

              {/* 3. Protected Routes */}
              <Route element={<AuthGate />}>
                <Route element={<App />}>
                  {/* Onboarding Route (requires auth, enforces onboarding completion) */}
                  <Route
                    path="onboarding"
                    element={<OnboardingRouteWrapper />}
                  />

                  {/* Dashboard and other private routes */}
                  <Route path="dashboard" element={<Dashboard />} />

                  {/* 💡 ADDED: Messages Route (Now protected by AuthGate) */}
                  <Route path="messages" element={<Messages />} />
                  <Route
                    path="messages/profile/:profileId"
                    element={<ConversationInitializer />}
                  />
                  <Route
                    path="messages/conversation/:conversationId"
                    element={<Chat />}
                  />

                  {/* 💡 CORRECTION: Use dynamic route path and the direct component */}
                  <Route path="profile/:id" element={<ProfilePage />} />
                  <Route path="profile" element={<Profile />} />

                  <Route path="matches" element={<MatchPage />} />

                  {/* Side-panel destinations */}
                  <Route path="premium" element={<PremiumPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="help" element={<HelpPage />} />
                  <Route path="report" element={<ReportPage />} />
                  <Route path="deactivate" element={<DeactivatePage />} />
                </Route>
              </Route>

              {/* Fallback 404 Route */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-6">
                    <div className="text-center max-w-md">
                      <p className="text-6xl font-bold bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-3">
                        404
                      </p>
                      <h1 className="text-2xl font-semibold mb-2">
                        Page not found
                      </h1>
                      <p className="text-gray-400 mb-6">
                        The page you're looking for doesn't exist or has moved.
                      </p>
                      <a
                        href="/dashboard"
                        className="inline-block px-5 py-3 rounded-full bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-colors font-semibold"
                      >
                        Back to dashboard
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
