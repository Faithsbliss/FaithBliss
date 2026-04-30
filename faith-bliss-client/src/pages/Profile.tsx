/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthContext } from "@/contexts/AuthContext";
import { useProfileStore } from "@/store/profileStore";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import PhotosSection from "@/components/profile/PhotosSection";
import BasicInfoSection from "@/components/profile/BasicInfoSection";
import PassionsSection from "@/components/profile/PassionsSection";
import FaithSection from "@/components/profile/FaithSection";
import SaveButton from "@/components/profile/SaveButton";

const ProfilePage: React.FC = () => {
  const { accessToken, user } = useAuthContext();
  const {
    fetchProfile,
    hydrateFromUser,
    isLoading,
    profile,
    draft,
    initDraft,
    isSaving,
    saveProfile,
    message,
    clearMessage,
    uploadPhoto,
    removePhoto,
    errors,
  } = useProfileStore();

  const [activeSection, setActiveSection] = useState<
    "photos" | "basics" | "passions" | "faith"
  >("photos");

  // Seed the store from the auth user immediately so the page renders with
  // *something* even before the network roundtrip resolves (and even if it
  // fails). The store no-ops if a real profile is already loaded.
  useEffect(() => {
    if (user) hydrateFromUser(user);
  }, [user, hydrateFromUser]);

  // Initial fetch — re-run if the access token becomes available so we don't
  // permanently fail with 401 if the page mounts before auth is hydrated.
  useEffect(() => {
    if (accessToken) {
      fetchProfile();
    }
  }, [fetchProfile, accessToken]);

  useEffect(() => {
    if (profile && !draft) {
      initDraft();
    }
  }, [profile, draft, initDraft]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(clearMessage, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);

  const handleSave = async () => {
    if (accessToken) {
      await saveProfile(accessToken);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (accessToken) {
      await uploadPhoto(file, accessToken);
    }
  };

  const handlePhotoRemove = async (index: number) => {
    if (accessToken) {
      await removePhoto(index, accessToken);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500" />
        <p className="ml-4 text-lg">Loading profile...</p>
      </div>
    );
  }

  // If the fetch failed or the profile API isn't reachable, fall back to the
  // user data we already have from auth so the page never goes blank.
  const fallbackProfile: any = user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        bio: user.bio,
        denomination: user.denomination,
        location: user.location ? { address: user.location } : undefined,
        faithJourney: user.faithJourney,
        sundayActivity: user.sundayActivity,
        favoriteVerse: user.favoriteVerse,
        hobbies: user.hobbies,
        values: user.values,
        lookingFor: user.lookingFor,
        photos: [
          user.profilePhoto1,
          user.profilePhoto2,
          user.profilePhoto3,
          user.profilePhoto4,
          user.profilePhoto5,
          user.profilePhoto6,
        ].filter(Boolean),
      }
    : null;

  const displayData = draft || (profile as any) || fallbackProfile;
  const fetchError = errors?.global;

  if (!displayData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Couldn't load your profile</h2>
          <p className="text-gray-400 mb-6">
            {fetchError ||
              "We hit a problem fetching your profile. Please try again."}
          </p>
          <button
            onClick={() => fetchProfile()}
            className="px-5 py-3 bg-linear-to-r from-pink-500 to-purple-600 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 text-white pb-20 no-horizontal-scroll dashboard-main">
      <ProfileHeader />
      <ProfileTabs
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {fetchError && (
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl px-4 py-3 text-sm">
            {fetchError} — showing cached profile data.
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-4 pb-20">
        {activeSection === "photos" && (
          <PhotosSection
            photos={displayData.photos || []}
            onUpload={handlePhotoUpload}
            onRemove={handlePhotoRemove}
          />
        )}

        {activeSection === "basics" && <BasicInfoSection />}

        {activeSection === "passions" && <PassionsSection />}

        {activeSection === "faith" && <FaithSection />}
      </div>

      <SaveButton
        isSaving={isSaving}
        saveMessage={message || ""}
        handleSave={handleSave}
      />

      <div className="h-32" />
    </div>
  );
};

export default function ProtectedProfileWrapper() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
