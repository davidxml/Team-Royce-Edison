"use client";

import ClassSelectionModal from "@/components/ClassSelectionModal";
import { useProfile } from "@/hook/useProfile";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, loading } = useProfile();
  return (
    <>
      {!profile?.class_id && !loading && <ClassSelectionModal />}
      {children}
    </>
  );
}
