"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Briefcase, Bookmark, Download, ChevronLeft, ChevronRight, BookmarkMinus } from "lucide-react";

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [exporting, setExporting] = useState(false);

  async function fetchBookmarks(page) {
    setLoading(true);
    try {
      const res = await fetch(`/api/job-bookmarks?page=${page}&limit=20`);
      const data = await res.json();
      setJobs(data.jobs || []);
      setTotalPages(data.totalPages || 0);
      setTotalJobs(data.totalJobs || 0);
      setCurrentPage(data.currentPage || 1);
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);
    } finally {
      setLoading(false);
    }
  }

  async function removeBookmark(jobId) {
    setRemoving(jobId);
    try {
      const res = await fetch("/api/job-bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
        setTotalJobs((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Remove bookmark error:", err);
    } finally {
      setRemoving(null);
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/job-bookmarks/export");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `saved-jobs-export-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setExporting(false);
    }
  }

  function handlePrev() {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  }

  function handleNext() {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  }

  useEffect(() => {
    fetchBookmarks(currentPage);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bookmark className="h-6 w-6 text-indigo-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
              <p className="text-gray-600 mt-1">
                {totalJobs > 0
                  ? `You have ${totalJobs} saved job${totalJobs !== 1 ? "s" : ""}`
                  : "Jobs you bookmark will appear here"}
              </p>
            </div>
          </div>
          {jobs.length > 0 && (
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              {exporting ? "Exporting..." : "Export CSV"}
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-xl font-semibold text-gray-600">No saved jobs yet</h2>
            <p className="text-gray-500 mt-1">Bookmark jobs from the student jobs page to see them here.</p>
            <Link
              href="/student-jobs"
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                    <p className="text-indigo-600 font-medium mt-1">{job.company}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                      {job.location && <span>{job.location}</span>}
                      {job.job_type && <span className="capitalize">{job.job_type.replace("-", " ")}</span>}
                      {job.experience_level && <span className="capitalize">{job.experience_level.replace("-", " ")}</span>}
                      <span>{new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                    {job.salary_range && (
                      <p className="mt-2 text-sm font-medium text-green-600">{job.salary_range}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Link
                      href="/student-jobs"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800 whitespace-nowrap"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => removeBookmark(job.id)}
                      disabled={removing === job.id}
                      className="text-gray-400 hover:text-red-600 disabled:opacity-50 transition-colors"
                      aria-label="Remove bookmark"
                    >
                      <BookmarkMinus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
