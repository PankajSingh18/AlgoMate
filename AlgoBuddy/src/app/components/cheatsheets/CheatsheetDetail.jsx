"use client";
import { ArrowLeft, Lightbulb, AlertTriangle, ListChecks, Code } from "lucide-react";
import Link from "next/link";
import ComplexityTable from "./ComplexityTable";
import CodeSnippet from "./CodeSnippet";
import { downloadCheatsheet } from "./utils/pdfExport";

export default function CheatsheetDetail({ cheatsheet }) {
  if (!cheatsheet) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Cheatsheet not found</h2>
        <Link href="/cheatsheets" className="text-[#a435f0] hover:text-[#c084fc] transition-colors">
          ← Back to cheatsheets
        </Link>
      </div>
    );
  }

  const { title, category, difficulty, code, steps, whenToUse, pitfalls } = cheatsheet;

  return (
    <div className="max-w-4xl mx-auto" id="cheatsheet-content">
      {/* Back link */}
      <Link
        href="/cheatsheets"
        className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Back to cheatsheets
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#a435f0] mb-2 block">
            {category}
          </span>
          <h1 className="text-3xl md:text-4xl font-black font-serif text-slate-900 dark:text-white">{title}</h1>
        </div>
        <button
          onClick={downloadCheatsheet}
          className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#a435f0] hover:bg-[#8f2cd6] rounded-xl transition-colors"
        >
          Download PDF
        </button>
      </div>

      {/* Complexity */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Code size={18} className="text-[#a435f0]" /> Complexity
        </h2>
        <ComplexityTable cheatsheet={cheatsheet} />
      </section>

      {/* Code Snippets */}
      {code && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Code size={18} className="text-[#a435f0]" /> Code
          </h2>
          <div className="space-y-4">
            {code.javascript && (
              <CodeSnippet code={code.javascript.trim()} language="javascript" />
            )}
            {code.python && (
              <CodeSnippet code={code.python.trim()} language="python" />
            )}
          </div>
        </section>
      )}

      {/* Steps */}
      {steps && steps.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ListChecks size={18} className="text-[#a435f0]" /> Algorithm Steps
          </h2>
          <ol className="space-y-2">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#a435f0]/20 text-[#c084fc] text-xs font-bold">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* When to Use */}
      {whenToUse && (
        <section className="mb-8 p-4 rounded-xl border border-green-700/30 bg-green-900/10">
          <h2 className="text-lg font-bold text-green-400 mb-2 flex items-center gap-2">
            <Lightbulb size={18} /> When to Use
          </h2>
          <p className="text-sm text-slate-300">{whenToUse}</p>
        </section>
      )}

      {/* Pitfalls */}
      {pitfalls && (
        <section className="mb-8 p-4 rounded-xl border bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-700/30">
          <h2 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle size={18} /> Common Pitfalls
          </h2>
          <p className="text-sm text-slate-300">{pitfalls}</p>
        </section>
      )}
    </div>
  );
}
