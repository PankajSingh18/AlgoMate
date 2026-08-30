import { Code2 } from "lucide-react";

export default function PlayerLanguageBadge({ language = "javascript" }) {
  const langConfig = {
    javascript: { color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30", label: "JS" },
    python: { color: "bg-blue-500/20 text-blue-500 border-blue-500/30", label: "Python" },
    java: { color: "bg-red-500/20 text-red-500 border-red-500/30", label: "Java" },
    cpp: { color: "bg-indigo-500/20 text-indigo-500 border-indigo-500/30", label: "C++" },
    default: { color: "bg-slate-500/20 text-slate-500 border-slate-500/30", label: "Unknown" }
  };

  const config = langConfig[language] || langConfig.default;

  return (
    <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-mono text-xs font-bold ${config.color}`}>
      <Code2 size={12} />
      <span>{config.label}</span>
    </div>
  );
}
