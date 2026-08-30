"use client";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import Chatbot from "@/app/components/ui/Chatbot";
import Navbar from "@/app/components/navbar";
import { CommandPalette } from "@/app/components/CommandPalette";
import { useGlobalKeyboardShortcuts } from "@/app/hooks/useGlobalKeyboardShortcuts";
import GlobalShortcutsModal from "@/app/components/ui/GlobalShortcutsModal";

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  useGlobalKeyboardShortcuts();

  return (
    <>
      <Toaster position="top-right" />
      {!isAuthPage && <Navbar />}
      {children}
      {!isAuthPage && <Chatbot />}
      {!isAuthPage && <CommandPalette />}
      <GlobalShortcutsModal />
    </>
  );
}
