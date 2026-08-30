"use client";

import { useState, useEffect } from "react";
import { Briefcase, MapPin, Calendar, Download, ChevronLeft, ChevronRight } from "lucide-react";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  async function fetchApplications(page) {
    setLoading(true);
    try {
      const res = await fetch(`/api/applications?page=${page}&limit=50`);
      const data = await res.json();
      setApplications(data.applications || []);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.currentPage || 1);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/applications/export");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `applications-export-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setExporting(false);
    }
  }

  useEffect(() => {
    fetchApplications(currentPage);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-600 mt-1">
              {applications.length > 0
                ? `You have applied to ${applications.length} job${applications.length !== 1 ? "s" : ""}`
                : "Track your job applications here"}
            </p>
          </div>
          {applications.length > 0 && (
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
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-xl font-semibold text-gray-600">No applications yet</h2>
            <p className="text-gray-500 mt-1">Apply to jobs from the student jobs page to see them here.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {app.job?.title || "Unknown Position"}
                      </h2>
                      <p className="text-indigo-600 font-medium mt-1">{app.job?.company || ""}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        {app.job?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {app.job.location}
                          </span>
                        )}
                        {app.job?.job_type && (
                          <span className="capitalize">{app.job.job_type.replace("-", " ")}</span>
                        )}
                        {app.job?.salary_range && (
                          <span className="font-medium text-green-600">{app.job.salary_range}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Applied {new Date(app.applied_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
                        statusStyles[app.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {statusLabels[app.status] || app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
