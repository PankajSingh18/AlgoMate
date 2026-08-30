"use client";
import PrivacyPolicyContent from "@/app/components/PrivacyPolicyContent";
import Link from "next/link";
import Footer from "@/app/components/footer";


export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-8"
        >
          <span className="mr-2">←</span> Back to Home
        </Link>
        <PrivacyPolicyContent />
      </div>
      <Footer/>
    </main>
  );
}