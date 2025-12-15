"use client";

import { createContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/types/profile";

type ProfileContextValue = {
  profile: UserProfile | null;
  loading: boolean;
  refetchProfile: () => Promise<void>;
};

export const ProfileContext = createContext<ProfileContextValue | undefined>(
  undefined
);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile() {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("clerk_id", user.id)
      .single();

    if (error) {
      console.error("Profile fetch failed:", error);
      setProfile(null);
    } else {
      setProfile(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (isLoaded && user) {
      fetchProfile();
    }
  }, [isLoaded, user]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        refetchProfile: fetchProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
