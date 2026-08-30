"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Save, X, Plus, Trash2, ExternalLink, Download } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/features/user/UserContext";

const PRESET_GRADIENTS = [
  "bg-[linear-gradient(135deg,#190f4f,#25116d_45%,#5338f2)]",
  "bg-[linear-gradient(135deg,#064e3b,#0f172a)]",
  "bg-[linear-gradient(135deg,#312e81,#111827)]",
  "bg-[linear-gradient(135deg,#7c2d12,#1c1917)]",
  "bg-[linear-gradient(135deg,#134e4a,#0f172a)]",
  "bg-[linear-gradient(135deg,#1e1b4b,#312e81)]",
];

const EMPTY_PROJECT = {
  title: "",
  subtitle: "",
  tags: "",
  url: "",
  preview: PRESET_GRADIENTS[0],
};

export default function ManageProjectsModal({ isOpen, onClose }) {
  const { user, setUser } = useUser();
  const meta = user?.user_metadata || {};

  const [projects, setProjects] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState(EMPTY_PROJECT);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [githubRepos, setGithubRepos] = useState([]);
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const saved = Array.isArray(meta.projects) ? meta.projects : [];
      setProjects(saved);
      setEditingIndex(null);
      setFormData(EMPTY_PROJECT);
      setShowImport(false);
      setGithubRepos([]);
    }
  }, [isOpen]);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (index) => {
    const project = projects[index];
    setFormData({
      title: project.title || "",
      subtitle: project.subtitle || "",
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : project.tags || "",
      url: project.url || "",
      preview: project.preview || PRESET_GRADIENTS[0],
    });
    setEditingIndex(index);
    setShowImport(false);
  };

  const handleAddNew = () => {
    setFormData(EMPTY_PROJECT);
    setEditingIndex(-1);
    setShowImport(false);
  };

  const handleSaveProject = () => {
    if (!formData.title.trim()) {
      toast.error("Project title is required");
      return;
    }

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 4);

    const newProject = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      tags: tagsArray,
      url: formData.url.trim(),
      preview: formData.preview,
    };

    if (editingIndex === -1) {
      setProjects((prev) => [...prev, newProject]);
    } else {
      setProjects((prev) => prev.map((p, i) => (i === editingIndex ? newProject : p)));
    }

    setEditingIndex(null);
    setFormData(EMPTY_PROJECT);
  };

  const handleDelete = (index) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setFormData(EMPTY_PROJECT);
    }
  };

  const handleImportFromGitHub = async () => {
    const username = meta.github_username?.trim();
    if (!username) {
      toast.error("No GitHub username found. Add it in Coding Profiles first.");
      return;
    }

    setImporting(true);
    setShowImport(true);

    try {
      const res = await fetch(`/api/github-repos?username=${encodeURIComponent(username)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch repos");
      setGithubRepos(data.repos);
    } catch (err) {
      toast.error(err.message || "Could not fetch GitHub repos");
      setShowImport(false);
    } finally {
      setImporting(false);
    }
  };

  const handleSelectRepo = (repo) => {
    const tags = [
      repo.language,
      ...(repo.topics || []),
    ].filter(Boolean).slice(0, 4);

    setFormData({
      title: repo.name,
      subtitle: repo.description || "",
      tags: tags.join(", "),
      url: repo.html_url,
      preview: PRESET_GRADIENTS[Math.floor(Math.random() * PRESET_GRADIENTS.length)],
    });

    setEditingIndex(-1);
    setShowImport(false);
    toast.success(`"${repo.name}" imported — review and save`);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const updatedMeta = { ...meta, projects };
      const { error } = await supabase.auth.updateUser({ data: updatedMeta });
      if (error) throw error;
      
      //directly update user state with what we know was saved 
      setUser(prev => ({
        ...prev,
        user_metadata: updatedMeta
      }));

      toast.success("Projects saved");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save projects");
    } finally {
      setSaving(false);
    }
  };

  const isFormOpen = editingIndex !== null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm dark:bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:border dark:border-neutral-800 dark:bg-neutral-900"
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-neutral-800">
              <div>
                <h2 className="text-xl font-black text-[#111331] dark:text-white">My Projects</h2>
                <p className="text-sm font-semibold text-slate-500 dark:text-neutral-400">
                  Add, edit, or import your projects.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
              {/* GitHub Import button */}
              <button
                type="button"
                onClick={handleImportFromGitHub}
                disabled={importing}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-black text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-violet-700 dark:hover:bg-violet-950/40 dark:hover:text-violet-300"
              >
                <Github className="h-4 w-4" />
                {importing ? "Fetching repos..." : "Import from GitHub"}
                {!importing && <Download className="h-3.5 w-3.5" />}
              </button>

              {/* GitHub repo list */}
              {showImport && githubRepos.length > 0 && (
                <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 dark:border-neutral-700">
                  <p className="border-b border-slate-100 px-3 py-2 text-xs font-black text-slate-500 dark:border-neutral-800 dark:text-neutral-400">
                    Select a repo to import
                  </p>
                  <div className="max-h-40 overflow-y-auto">
                    {githubRepos.map((repo) => (
                      <button
                        key={repo.name}
                        type="button"
                        onClick={() => handleSelectRepo(repo)}
                        className="flex w-full items-center justify-between px-3 py-2.5 text-left transition hover:bg-violet-50 dark:hover:bg-violet-950/30"
                      >
                        <div>
                          <p className="text-sm font-black text-[#111331] dark:text-white">{repo.name}</p>
                          {repo.description && (
                            <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-500 dark:text-neutral-400">
                              {repo.description}
                            </p>
                          )}
                        </div>
                        {repo.language && (
                          <span className="ml-3 shrink-0 rounded bg-violet-50 px-1.5 py-0.5 text-[10px] font-black text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
                            {repo.language}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add/Edit form */}
              {isFormOpen && (
                <div className="mb-4 rounded-xl border border-violet-200 bg-violet-50/40 p-4 dark:border-violet-900/60 dark:bg-violet-950/20">
                  <p className="mb-3 text-xs font-black uppercase tracking-wide text-violet-600 dark:text-violet-300">
                    {editingIndex === -1 ? "New Project" : "Edit Project"}
                  </p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Project title *"
                      value={formData.title}
                      onChange={(e) => handleFormChange("title", e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-violet-400 dark:focus:ring-violet-950/60"
                    />
                    <input
                      type="text"
                      placeholder="Short description"
                      value={formData.subtitle}
                      onChange={(e) => handleFormChange("subtitle", e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-violet-400 dark:focus:ring-violet-950/60"
                    />
                    <input
                      type="text"
                      placeholder="Tags, comma-separated (max 4)"
                      value={formData.tags}
                      onChange={(e) => handleFormChange("tags", e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-violet-400 dark:focus:ring-violet-950/60"
                    />
                    <input
                      type="url"
                      placeholder="Project URL (https://...)"
                      value={formData.url}
                      onChange={(e) => handleFormChange("url", e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-violet-400 dark:focus:ring-violet-950/60"
                    />
                    <div>
                      <p className="mb-2 text-xs font-black text-slate-500 dark:text-neutral-400">Preview color</p>
                      <div className="flex gap-2">
                        {PRESET_GRADIENTS.map((gradient) => (
                          <button
                            key={gradient}
                            type="button"
                            onClick={() => handleFormChange("preview", gradient)}
                            className={`h-7 w-7 rounded-lg ${gradient} transition ${
                              formData.preview === gradient
                                ? "ring-2 ring-violet-600 ring-offset-2 dark:ring-violet-400"
                                : ""
                            }`}
                            aria-label="Select gradient"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setEditingIndex(null); setFormData(EMPTY_PROJECT); }}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-600 dark:border-neutral-700 dark:text-neutral-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProject}
                      className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-black text-white dark:bg-violet-500"
                    >
                      {editingIndex === -1 ? "Add Project" : "Update Project"}
                    </button>
                  </div>
                </div>
              )}

              {/* Projects list */}
              {projects.length === 0 && !isFormOpen ? (
                <div className="flex min-h-[80px] items-center justify-center rounded-xl border border-dashed border-violet-200 bg-violet-50/60 dark:border-violet-900/60 dark:bg-violet-950/20">
                  <p className="text-sm font-bold text-slate-400 dark:text-neutral-500">
                    No projects yet. Add one or import from GitHub.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {projects.map((project, index) => (
                    <div
                      key={`${project.title}-${index}`}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950"
                    >
                      <div className={`h-10 w-10 shrink-0 rounded-lg ${project.preview}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-[#111331] dark:text-white">{project.title}</p>
                        <p className="truncate text-[11px] font-semibold text-slate-500 dark:text-neutral-400">{project.subtitle}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-violet-600 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-violet-300"
                            aria-label="Open project"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEdit(index)}
                          className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-black text-slate-600 hover:border-violet-300 hover:text-violet-600 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-violet-300"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(index)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-500 dark:border-neutral-700 dark:text-neutral-500 dark:hover:text-red-400"
                          aria-label="Delete project"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950/60">
              <button
                type="button"
                onClick={handleAddNew}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-violet-700 dark:hover:bg-violet-950/40 dark:hover:text-violet-300"
              >
                <Plus className="h-4 w-4" />
                Add Project
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-black text-slate-600 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-violet-200 disabled:opacity-60 dark:bg-violet-500 dark:shadow-none"
                >
                  {saving ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving ? "Saving..." : "Save Projects"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}