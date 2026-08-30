"use client";

import { useState, useEffect } from "react";
import {
  Briefcase, MapPin, Calendar, Globe, Building2, Users, ArrowLeft,
  Send, CheckCircle, ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function CompanyPage({ params }) {
  const { id } = params;
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await fetch(`/api/companies/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Company not found");
          throw new Error("Failed to load company");
        }
        const data = await res.json();
        setCompany(data.company);
        setJobs(data.jobs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gray-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48" />
                <div className="h-4 bg-gray-200 rounded w-32" />
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold text-gray-600">{error}</h2>
          <Link
            href="/student-jobs"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/student-jobs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-start gap-6">
            {company.logo_url ? (
              <img
                src={company.logo_url}
                alt={company.name}
                className="h-20 w-20 rounded-xl object-cover flex-shrink-0"
              />
            ) : (
              <div className="h-20 w-20 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-10 w-10 text-indigo-600" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                {company.industry && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {company.industry}
                  </span>
                )}
                {company.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {company.location}
                  </span>
                )}
                {company.size && (
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {company.size} employees
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
          {company.description && (
            <p className="mt-6 text-gray-700 leading-relaxed">{company.description}</p>
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Open Positions {jobs.length > 0 && `(${jobs.length})`}
        </h2>

        {jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-600">No open positions</h3>
            <p className="text-gray-500 mt-1">
              This company has no approved job listings right now.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                      )}
                      {job.job_type && (
                        <span className="capitalize">{job.job_type.replace("-", " ")}</span>
                      )}
                      {job.experience_level && (
                        <span className="capitalize">{job.experience_level.replace("-", " ")}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {job.salary_range && (
                      <p className="mt-2 text-sm font-medium text-green-600">{job.salary_range}</p>
                    )}
                    {job.skills && (
                      <p className="mt-2 text-sm text-gray-500">
                        <span className="font-medium text-gray-700">Skills: </span>
                        {job.skills}
                      </p>
                    )}
                    <p className="mt-3 text-gray-600 line-clamp-2">{job.description}</p>
                  </div>
                  <div className="ml-6 flex-shrink-0 self-start">
                    <Link
                      href={`/student-jobs`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    >
                      <Send className="h-4 w-4" />
                      Apply
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
