"use client";
import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Footer from "@/app/components/footer";
import UserProfileCard from "@/app/components/community/UserProfileCard";
import CoreTeamSection from "@/app/components/community/CoreTeamSection";
import ContributorsSection from "@/app/components/community/ContributorsSection";
import JoinCommunityButton from "@/app/components/community/JoinCommunityButton";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function ProfileSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700/60 shadow-sm flex flex-col items-center">
      <div className="skeleton-shimmer w-36 h-36 rounded-full mb-4" />
      <div className="skeleton-shimmer h-5 w-28 mb-2" />
      <div className="skeleton-shimmer h-4 w-40 mb-4" />
      <div className="skeleton-shimmer h-3 w-48 mb-5" />
      <div className="w-full h-[1px] bg-slate-100 dark:bg-neutral-700 my-4" />
      <div className="w-full flex justify-between gap-2 py-2">
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="skeleton-shimmer h-5 w-8" />
          <div className="skeleton-shimmer h-3 w-12" />
        </div>
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="skeleton-shimmer h-5 w-8" />
          <div className="skeleton-shimmer h-3 w-12" />
        </div>
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="skeleton-shimmer h-5 w-8" />
          <div className="skeleton-shimmer h-3 w-12" />
        </div>
      </div>
      <div className="w-full h-[1px] bg-slate-100 dark:bg-neutral-700 my-4" />
      <div className="w-full space-y-3 mt-2">
        <div className="skeleton-shimmer h-3 w-12" />
        <div className="flex items-center gap-2">
          <div className="skeleton-shimmer w-5 h-5 rounded" />
          <div className="space-y-1 flex-1">
            <div className="skeleton-shimmer h-3 w-16" />
            <div className="skeleton-shimmer h-2 w-28" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="skeleton-shimmer w-5 h-5 rounded" />
          <div className="space-y-1 flex-1">
            <div className="skeleton-shimmer h-3 w-16" />
            <div className="skeleton-shimmer h-2 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CoreTeamSkeleton() {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="skeleton-shimmer w-6 h-6 rounded" />
        <div className="space-y-2">
          <div className="skeleton-shimmer h-5 w-24" />
          <div className="skeleton-shimmer h-3 w-36" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700/60 shadow-sm"
          >
            <div className="skeleton-shimmer w-20 h-20 rounded-full mb-3" />
            <div className="skeleton-shimmer h-3 w-12 mb-2" />
            <div className="skeleton-shimmer h-4 w-20 mb-1" />
            <div className="skeleton-shimmer h-3 w-24 mb-4" />
            <div className="flex gap-2">
              <div className="skeleton-shimmer w-5 h-5 rounded-full" />
              <div className="skeleton-shimmer w-5 h-5 rounded-full" />
              <div className="skeleton-shimmer w-5 h-5 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContributorsGridSkeleton() {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="skeleton-shimmer w-6 h-6 rounded" />
        <div className="space-y-2">
          <div className="skeleton-shimmer h-5 w-24" />
          <div className="skeleton-shimmer h-3 w-40" />
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 justify-items-center">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center p-2">
            <div className="skeleton-shimmer w-14 h-14 rounded-full mb-2" />
            <div className="skeleton-shimmer h-3.5 w-16 mb-1" />
            <div className="skeleton-shimmer h-2.5 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="min-h-screen bg-[#f9f9fc] dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-80 flex-shrink-0">
              <ProfileSkeleton />
            </aside>
            <main className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="space-y-2">
                  <div className="skeleton-shimmer h-8 w-40" />
                  <div className="skeleton-shimmer h-4 w-72" />
                </div>
                <div className="skeleton-shimmer h-10 w-36" />
              </div>
              <div className="rounded-2xl bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700/60 p-6 sm:p-8 shadow-sm space-y-12">
                <CoreTeamSkeleton />
                <div className="border-t border-slate-100 dark:border-neutral-700/60 pt-10">
                  <ContributorsGridSkeleton />
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f9f9fc] dark:bg-neutral-900">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - User Profile Card */}
          <motion.aside
            variants={itemVariants}
            className="w-full lg:w-80 flex-shrink-0"
          >
            <div className="lg:sticky lg:top-28">
              <Suspense fallback={<ProfileSkeleton />}>
                <UserProfileCard />
              </Suspense>
            </div>
          </motion.aside>

          {/* Right Column - Team Details */}
          <motion.main variants={itemVariants} className="flex-1 min-w-0">
            {/* Header section with The Team title & Join Community button */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">The Team</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                  Meet the amazing people behind AlgoBuddy who build, design and scale the platform
                  to help developers learn and grow.
                </p>
              </div>
              <div className="flex-shrink-0">
                <JoinCommunityButton />
              </div>
            </div>

            {/* Container for Team and Contributors */}
            <div className="rounded-2xl bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700/60 p-6 sm:p-8 shadow-sm space-y-12">
              <Suspense fallback={<CoreTeamSkeleton />}>
                <CoreTeamSection />
              </Suspense>

              <Suspense fallback={<ContributorsGridSkeleton />}>
                <ContributorsSection />
              </Suspense>
            </div>
          </motion.main>
        </div>
      </motion.div>

      <Footer />
    </section>
  );
}
