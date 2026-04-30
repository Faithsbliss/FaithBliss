import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { API, type UpdateProfileDto } from '@/services/api';
import { updateProfileClient, uploadSpecificPhotoClient } from '@/services/api-client';
import { profileSchema, type ProfileFormValues } from '@/schemas/profileSchema';
import type { ProfileData } from '@/types/profile';
import type { UserPreferences } from '@/types/User';

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

/** Loose user payload from API, Firestore, or auth before mapping to `ProfileData`. */
export interface ProfileUserInput {
  id?: string;
  _id?: string;
  email?: string;
  name?: string;
  gender?: ProfileData["gender"];
  /** API/auth may send any string; normalized when saving. */
  denomination?: string;
  bio?: string;
  age?: number;
  location?: string | { address?: string };
  latitude?: number | null;
  longitude?: number | null;
  phoneNumber?: string;
  countryCode?: string;
  birthday?: string | Date;
  fieldOfStudy?: string;
  profession?: string;
  educationLevel?: string;
  company?: string;
  smoking?: string;
  drinking?: string;
  kids?: string;
  height?: number;
  faithJourney?: string;
  sundayActivity?: string;
  lookingFor?: string[];
  hobbies?: string[];
  values?: string[];
  favoriteVerse?: string;
  profilePhoto1?: string;
  profilePhoto2?: string;
  profilePhoto3?: string;
  profilePhoto4?: string;
  profilePhoto5?: string;
  profilePhoto6?: string;
  isVerified?: boolean;
  onboardingCompleted?: boolean;
  preferences?: UserPreferences;
}

interface ProfileState {
  profile: ProfileData | null;
  draft: ProfileFormValues | null;
  isLoading: boolean;
  isSaving: boolean;
  errors: Record<string, string>;
  message: string | null;

  // Actions
  fetchProfile: (userId?: string) => Promise<void>;
  hydrateFromUser: (user: ProfileUserInput) => void;
  initDraft: () => void;
  updateDraft: (data: Partial<ProfileFormValues>) => void;
  saveProfile: (accessToken: string) => Promise<void>;
  uploadPhoto: (file: File, accessToken: string) => Promise<void>;
  removePhoto: (index: number, accessToken: string) => Promise<void>;
  clearMessage: () => void;
}

const mapUserToProfileData = (user: ProfileUserInput): ProfileData => {
  const photos = [
    user.profilePhoto1,
    user.profilePhoto2,
    user.profilePhoto3,
    user.profilePhoto4,
    user.profilePhoto5,
    user.profilePhoto6,
  ].filter(Boolean) as string[];

  const birthdayStr =
    user.birthday instanceof Date
      ? user.birthday.toISOString()
      : typeof user.birthday === "string"
        ? user.birthday
        : undefined;

  return {
    id: String(user.id ?? user._id ?? ""),
    email: user.email ?? "",
    name: user.name ?? "User",
    gender: user.gender,
    age: user.age,
    denomination: user.denomination as ProfileData["denomination"],
    bio: user.bio,
    location: user.location
      ? {
          address:
            typeof user.location === "string"
              ? user.location
              : user.location.address ?? "",
          latitude: user.latitude ?? null,
          longitude: user.longitude ?? null,
        }
      : undefined,
    phoneNumber: user.phoneNumber,
    countryCode: user.countryCode,
    birthday: birthdayStr,
    fieldOfStudy: user.fieldOfStudy,
    profession: user.profession,
    educationLevel: user.educationLevel,
    company: user.company,
    smoking: user.smoking as ProfileData["smoking"],
    drinking: user.drinking as ProfileData["drinking"],
    kids: user.kids,
    height: user.height,
    faithJourney: user.faithJourney as ProfileData["faithJourney"],
    sundayActivity: user.sundayActivity as ProfileData["sundayActivity"],
    lookingFor: user.lookingFor || [],
    hobbies: user.hobbies || [],
    values: user.values || [],
    favoriteVerse: user.favoriteVerse,
    photos,
    isVerified: user.isVerified,
    onboardingCompleted: user.onboardingCompleted,
    preferences: user.preferences,
  };
};

export const useProfileStore = create<ProfileState>()(
  devtools((set, get) => ({
    profile: null,
    draft: null,
    isLoading: false,
    isSaving: false,
    errors: {},
    message: null,

    fetchProfile: async () => {
      set({ isLoading: true, errors: {} });
      try {
        const user = await API.User.getMe();
        const profileData = mapUserToProfileData(user);
        set({ profile: profileData, isLoading: false });
      } catch (error: unknown) {
        console.error('Failed to fetch profile:', error);
        set({ 
          isLoading: false, 
          errors: { global: errorMessage(error, 'Failed to load profile') } 
        });
      }
    },

    hydrateFromUser: (user: ProfileUserInput) => {
      if (!user) return;
      const { profile } = get();
      // Only hydrate if we don't already have a profile from the API.
      if (profile) return;
      try {
        const profileData = mapUserToProfileData(user);
        set({ profile: profileData });
      } catch (error) {
        console.warn('hydrateFromUser failed:', error);
      }
    },

    initDraft: () => {
      const { profile } = get();
      if (profile) {
        // Map ProfileData to ProfileFormValues (Zod Schema matches mostly)
        const draft: ProfileFormValues = {
          name: profile.name,
          age: profile.age || 18,
          gender: profile.gender || 'MALE',
          bio: profile.bio,
          denomination: profile.denomination,
          faithJourney: profile.faithJourney,
          sundayActivity: profile.sundayActivity,
          favoriteVerse: profile.favoriteVerse,
          values: profile.values,
          fieldOfStudy: profile.fieldOfStudy,
          profession: profile.profession,
          educationLevel: profile.educationLevel,
          company: profile.company,
          smoking: profile.smoking as ProfileFormValues["smoking"],
          drinking: profile.drinking as ProfileFormValues["drinking"],
          kids: profile.kids,
          height: profile.height,
          hobbies: profile.hobbies,
          lookingFor: profile.lookingFor,
          location: profile.location ? {
            address: profile.location.address,
            latitude: profile.location.latitude,
            longitude: profile.location.longitude
          } : undefined,
          photos: profile.photos,
        };
        set({ draft });
      }
    },

    updateDraft: (data) => {
      set((state) => ({
        draft: state.draft ? { ...state.draft, ...data } : null,
        errors: {}, // Clear errors on change
      }));
    },

    saveProfile: async (accessToken) => {
      const { draft } = get();
      if (!draft) return;

      set({ isSaving: true, errors: {} });

      // Validate
      const validation = profileSchema.safeParse(draft);
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.issues.forEach((issue) => {
          const key = issue.path[0];
          if (key !== undefined) fieldErrors[String(key)] = issue.message;
        });
        set({ isSaving: false, errors: fieldErrors });
        return;
      }

      try {
        // Prepare DTO
        const updatePayload: UpdateProfileDto = {
            ...draft,
            location: draft.location?.address,
            latitude: draft.location?.latitude,
            longitude: draft.location?.longitude,
            // Exclude photos from metadata update (handled separately)
        };

        const updatedUser = await updateProfileClient(updatePayload, accessToken);
        const newProfileData = mapUserToProfileData(
          updatedUser as ProfileUserInput
        );
        
        set({ 
            profile: newProfileData, 
            draft: null, // Clear draft or keep it updated? Let's keep it updated.
            isSaving: false,
            message: 'Profile saved successfully!'
        });
        
        // Re-init draft with new data
        get().initDraft();
        
      } catch (error: unknown) {
        console.error('Failed to save profile:', error);
        set({ 
            isSaving: false, 
            errors: { global: errorMessage(error, 'Failed to save profile') } 
        });
      }
    },

    uploadPhoto: async (file, accessToken) => {
      const { profile } = get();
      if (!profile) return;

      set({ isSaving: true });
      try {
        const currentPhotos = profile.photos || [];
        if (currentPhotos.length >= 6) {
             throw new Error("Maximum 6 photos allowed");
        }
        
        const photoNumber = currentPhotos.length + 1;
        const formData = new FormData();
        formData.append('photo', file);

        const response = await uploadSpecificPhotoClient(photoNumber, formData, accessToken);
        const photoUrl = response.photoUrl || response.url || response.data?.photoUrl;

        // Optimistic update
        const updatedPhotos = [...currentPhotos, photoUrl];
        
        set((state) => ({
            profile: state.profile ? { ...state.profile, photos: updatedPhotos } : null,
            draft: state.draft ? { ...state.draft, photos: updatedPhotos } : null,
            isSaving: false,
            message: 'Photo uploaded successfully!'
        }));
        
        // Refresh full profile to be sure
        await get().fetchProfile();

      } catch (error: unknown) {
        console.error('Photo upload failed:', error);
        set({ isSaving: false, errors: { photos: errorMessage(error, 'Upload failed') } });
      }
    },

    removePhoto: async (index, _accessToken) => {
       const { profile } = get();
       if (!profile) return;
       
       set({ isSaving: true });
       try {
           const photoNumber = index + 1;
           await API.User.deletePhoto(photoNumber);
           
           // Refresh profile to get re-indexed photos
           await get().fetchProfile();
           
           // Also update draft
           const updatedProfile = get().profile;
           if (updatedProfile) {
                set((state) => ({
                    draft: state.draft ? { ...state.draft, photos: updatedProfile.photos } : null,
                    isSaving: false,
                    message: 'Photo removed'
                }));
           }
           
       } catch (error: unknown) {
           console.error('Remove photo failed:', error);
           set({ isSaving: false, errors: { photos: errorMessage(error, 'Failed to remove photo') } });
       }
    },
    
    clearMessage: () => set({ message: null }),
  }))
);
