"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/features/user/UserContext";
import { toast } from "react-hot-toast";
import { TriangleAlert } from "lucide-react";
import { api } from "@/lib/apiClient";

export default function ModuleCard({ moduleId, description, initialDone }) {
  const { user } = useUser() || {};
  const [isDone, setIsDone] = useState(initialDone);

  useEffect(() => {
    if (!user) {
      setIsDone(initialDone ?? false);
      return;
    }

    const fetchUserProgress = async () => {
      try {
        const data = await api.request("/api/progress");
        const status = data.progress?.[moduleId]?.status;
        setIsDone(status === "Completed");
      } catch (e) {
        console.error("Error fetching user progress:", e);
      }
    };
    fetchUserProgress();
  }, [user, moduleId, initialDone]);

  async function toggleCompletion() {
    if (!user) {
      toast.custom((t) => (
        <div className="max-w-sm w-full bg-neutral-100 dark:bg-zinc-800 border border-[#a435f0] rounded-lg shadow-xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <TriangleAlert size={50} className="dark:text-yellow-500 text-red-500" />
            <span className="text-sm text-gray-800 dark:text-gray-100">
              You are in guest mode. Login or signup to track your progress.
            </span>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                window.location.href = "/login";
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 rounded-full font-medium bg-gradient-to-r from-[#a435f0] to-[#7c3aed] text-white hover:from-[#7c3aed] hover:to-[#6d28d9] transition duration-300 shadow-md flex items-center gap-2"
            >
              Login/Signup
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 rounded-full font-medium bg-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-900 dark:bg-neutral-800 border border-[#a435f0] dark:text-white text-black transition duration-300 shadow-lg flex items-center"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      ));
      return;
    }

    try {
      const nextStatus = isDone ? "Not Started" : "Completed";
      await api.request("/api/progress", {
        method: "POST",
        body: { problemId: moduleId, status: nextStatus },
      });
      setIsDone(!isDone);
      toast.success(
        isDone ? "Module marked as incomplete." : "Module marked as completed!"
      );
    } catch (err) {
      console.error("Error updating progress:", err);
      toast.error("Failed to update progress. Please try again.");
    }
  }

  return (
    <div
      className={`border border-surface-200 dark:border-surface-700 max-w-4xl mx-auto rounded-lg p-4 shadow-lg flex flex-col justify-between ${
        isDone ? "bg-green-50 dark:bg-green-900/30" : "bg-white dark:bg-surface-900"
      }`}
    >
      <div className="my-4 px-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-surface-800 dark:text-surface-200">
            Done With the Learning
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">{description}</p>
        </div>
        <input
          type="checkbox"
          checked={isDone}
          onChange={toggleCompletion}
          className={`w-6 h-6 rounded cursor-pointer transition duration-300 ${
            isDone ? "accent-green-500 ring-2 ring-green-500" : "accent-[#a435f0]"
          }`}
        />
      </div>
    </div>
  );
}
