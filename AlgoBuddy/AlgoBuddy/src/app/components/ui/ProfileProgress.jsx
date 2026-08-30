"use client";
import { useMemo } from "react";
import Link from "next/link";
import { useUser } from "@/features/user/UserContext";

const PROFILE_FIELDS = [
  { key: "name", label: "Full Name", weight: 10 },
  { key: "avatar_url", altKey: "picture", label: "Profile Picture", weight: 10 },
  { key: "branch", label: "Branch / Major", weight: 15 },
  { key: "cgpa", label: "CGPA", weight: 15 },
  { key: "skills", label: "Skills", weight: 20 },
  { key: "resume_link", label: "Resume Link", weight: 10 },
  { key: "github_profile", label: "GitHub Profile", weight: 10 },
  { key: "linkedin_profile", label: "LinkedIn Profile", weight: 10 },
];

export default function ProfileProgress({ compact = false }) {
  const { user } = useUser();

  const { percentage, missingFields } = useMemo(() => {
    if (!user) return { percentage: 0, missingFields: [] };

    const meta = user.user_metadata || {};
    let total = 0;
    const missing = [];

    PROFILE_FIELDS.forEach((field) => {
      const hasValue = (meta[field.key] && meta[field.key].toString().trim() !== "") || 
                       (field.altKey && meta[field.altKey] && meta[field.altKey].toString().trim() !== "");
      if (hasValue) {
        total += field.weight;
      } else {
        missing.push(field.label);
      }
    });

    return { percentage: Math.min(total, 100), missingFields: missing };
  }, [user]);

  if (!user) return null;

  if (compact) {
    return (
      <div className="w-full flex flex-col gap-2 px-4 py-3.5 bg-primary/5 dark:bg-primary/10 border-b border-surface-100 dark:border-udemy-dark-border/60">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wider">Profile Completion</span>
          <span className="text-xs font-bold text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 px-1.5 py-0.5 rounded">{percentage}%</span>
        </div>
        <div className="w-full h-1.5 bg-surface-200 dark:bg-surface-700/80 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {missingFields.length > 0 && percentage < 100 && (
          <p className="text-[11px] text-surface-500 dark:text-surface-400 mt-0.5 leading-snug">
            Add <span className="font-medium text-primary dark:text-primary-light">{missingFields[0]}</span> to boost your profile.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-surface-900 dark:text-white">Profile Completeness</h3>
        <span className="text-xl font-bold text-primary dark:text-primary-light">{percentage}%</span>
      </div>
      
      <div className="w-full h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-primary transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {percentage < 100 ? (
        <div className="space-y-3">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            Complete your profile to improve your job matching and application success rate. Missing details:
          </p>
          <div className="flex flex-wrap gap-2">
            {missingFields.map(field => (
              <span key={field} className="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-xs font-medium rounded-md">
                + {field}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Your profile is fully complete!
        </div>
      )}
    </div>
  );
}
