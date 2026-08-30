"use client";
import { useUser } from "@/features/user/UserContext";

export default function AuthGuard({ children }) {
  const { user, loading } = useUser() || {};

  if (loading) {
    return <p>Loading…</p>;
  }

  if (!user) {
    return <p>Please sign in to view this visualizer.</p>;
  }

  return <>{children}</>;
}
