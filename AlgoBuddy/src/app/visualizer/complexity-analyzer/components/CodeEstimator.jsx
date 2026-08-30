"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[260px] h-full items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-sm font-semibold text-neutral-400">
      Loading Editor...
    </div>
  ),
});
import { useUser } from "@/features/user/UserContext";
import ReactMarkdown from "react-markdown";
import { 
  Code2, 
  Cpu, 
  Zap, 
  HelpCircle, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  Copy,
  FolderSync
} from "lucide-react";
import { toast } from "react-hot-toast";

const SAMPLES = {
  JavaScript: `// JavaScript: Calculate the sum of an array
function findSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}`,
  Python: `# Python: Check if array has duplicates (Sub-optimal O(n^2))
def has_duplicates(arr):
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j]:
                return True
    return False`,
  "C++": `// C++: Binary Search (Optimal O(log n))
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  Java: `// Java: Fibonacci recursive (Sub-optimal O(2^n))
public class Fibonacci {
    public static int fib(int n) {
        if (n <= 1) return n;
        return fib(n - 1) + fib(n - 2);
    }
}`
};

const MONACO_LANGUAGE_MAP = {
  JavaScript: "javascript",
  Python: "python",
  "C++": "cpp",
  Java: "java"
};

const getComplexityColor = (comp) => {
  const c = String(comp || "").toLowerCase().replace(/\s+/g, "");
  if (!c) return "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700";
  if (c.includes("1")) return "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300 border-green-200 dark:border-green-800/30";
  if (c.includes("logn")) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30";
  if (c.includes("nlogn")) return "bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800/30";
  if (c.includes("n") && !c.includes("n2") && !c.includes("n3") && !c.includes("2n")) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/30";
  }
  if (c.includes("n2") || c.includes("n^2")) return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/30";
  if (c.includes("n3") || c.includes("n^3")) return "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200 dark:border-orange-800/30";
  if (c.includes("2n") || c.includes("2^n")) return "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/30";
  return "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800/30";
};

export default function CodeEstimator() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const { user } = useUser();

  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState(SAMPLES.JavaScript);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const [showOriginalTab, setShowOriginalTab] = useState(true);

  const monacoLanguage = useMemo(
    () => MONACO_LANGUAGE_MAP[language] || "javascript",
    [language]
  );

  const handleLanguageChange = (nextLang) => {
    setLanguage(nextLang);
    setCode(SAMPLES[nextLang]);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/complexity-estimator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze code complexity.");
      }

      setResult(data);
      toast.success("Complexity analyzed successfully! 🚀");
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      toast.error(err.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard! 📋");
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm mt-8 transition-colors duration-300">
      
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-[#a435f0]/10 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-[#a435f0]" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
            AI Code Complexity Estimator
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            Analyze any custom logic for time/space complexity classes and get AI-powered optimizations.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Left Side: Code Input Panel */}
        <div className="flex flex-col gap-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              Paste or Write Code
            </label>

            {/* Language Selector */}
            <div className="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-1">
              {Object.keys(SAMPLES).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageChange(lang)}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                    language === lang
                      ? "bg-[#a435f0] text-white shadow-sm"
                      : "text-neutral-600 hover:bg-neutral-200/50 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
            <Editor
              height="340px"
              language={monacoLanguage}
              theme={isDarkMode ? "vs-dark" : "light"}
              value={code}
              onChange={(value) => setCode(value || "")}
              loading={
                <div className="flex h-[340px] items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-sm font-semibold text-neutral-400">
                  Loading Editor...
                </div>
              }
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'Fira Code', 'Courier New', Courier, monospace",
                lineHeight: 20,
                padding: { top: 12, bottom: 12 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                cursorBlinking: "smooth",
                renderLineHighlight: "all",
              }}
            />
          </div>

          {/* Action Trigger Button */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className={`w-full py-3.5 rounded-2xl text-sm font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              loading 
                ? "bg-[#a435f0]/70 cursor-not-allowed" 
                : "bg-[#a435f0] hover:bg-[#8b2bc7] shadow-[#a435f0]/20"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Snippet...
              </>
            ) : (
              <>
                <Cpu className="h-4 w-4" />
                Estimate Complexity
              </>
            )}
          </button>
          
        </div>

        {/* Right Side: Analysis Display Panel */}
        <div className="flex flex-col border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 bg-neutral-50/50 dark:bg-neutral-950/20 min-h-[460px] justify-center transition-colors">
          
          {/* State 1: Welcome / Idle state */}
          {!loading && !result && !error && (
            <div className="text-center p-8 max-w-sm mx-auto flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
                <Code2 className="h-6 w-6 text-neutral-400" />
              </div>
              <h3 className="font-bold text-neutral-800 dark:text-neutral-200 text-base">Ready for Estimation</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                Click &quot;Estimate Complexity&quot; to get detailed Big-O analysis and code optimization refactoring.
              </p>
            </div>
          )}

          {/* State 2: Shimmer loading state */}
          {loading && (
            <div className="flex flex-col gap-6 animate-pulse w-full">
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-14 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded" />
                <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
                <div className="h-3 w-5/6 bg-neutral-200 dark:bg-neutral-800 rounded" />
                <div className="h-3 w-4/5 bg-neutral-200 dark:bg-neutral-800 rounded" />
              </div>
            </div>
          )}

          {/* State 3: Error state */}
          {error && (
            <div className="text-center p-8 max-w-sm mx-auto flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-rose-500" />
              </div>
              <h3 className="font-bold text-rose-600 dark:text-rose-400 text-base">Analysis Error</h3>
              <p className="text-xs text-rose-500 dark:text-rose-400 font-medium leading-relaxed">
                {error}
              </p>
            </div>
          )}

          {/* State 4: Loaded results display */}
          {result && (
            <div className="flex flex-col h-full gap-5 w-full">
              
              {/* Badges Grid */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-[#a435f0]" /> Complexity Classes
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-2xl border flex flex-col transition-all shadow-sm ${getComplexityColor(result.timeWorst)}`}>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-60">Worst Case (O)</span>
                    <span className="text-lg font-black">{result.timeWorst}</span>
                  </div>
                  <div className={`p-3 rounded-2xl border flex flex-col transition-all shadow-sm ${getComplexityColor(result.timeAverage)}`}>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-60">Average Case (Θ)</span>
                    <span className="text-lg font-black">{result.timeAverage}</span>
                  </div>
                  <div className={`p-3 rounded-2xl border flex flex-col transition-all shadow-sm ${getComplexityColor(result.timeBest)}`}>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-60">Best Case (Ω)</span>
                    <span className="text-lg font-black">{result.timeBest}</span>
                  </div>
                  <div className={`p-3 rounded-2xl border flex flex-col transition-all shadow-sm ${getComplexityColor(result.space)}`}>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-60">Space Complexity</span>
                    <span className="text-lg font-black">{result.space}</span>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Explanation */}
              <div className="flex flex-col min-h-0">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2.5 flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-[#a435f0]" /> Step-by-step breakdown
                </h3>
                
                <div className="max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed font-poppins border border-neutral-200/50 dark:border-neutral-800/50 bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-inner prose prose-sm dark:prose-invert">
                  <ReactMarkdown>{result.explanation}</ReactMarkdown>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Code Optimization & Comparison Section */}
      {result && result.optimizedCode && (
        <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800/80 transition-colors">
          
          <div className="flex flex-col gap-1 mb-5">
            <h3 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
              AI Optimization Recommendation
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium max-w-xl">
              Gemini analyzed your code and generated a more optimal alternative. Let&apos;s compare them side-by-side.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            
            {/* Side 1: Rationale Card */}
            <div className="flex flex-col gap-4 border border-amber-200/50 dark:border-amber-950/30 bg-amber-50/10 dark:bg-amber-950/5 p-5 rounded-3xl shadow-sm">
              <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                <CheckCircle className="h-4.5 w-4.5 text-amber-500" />
                Why optimize?
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 font-medium leading-relaxed font-poppins">
                {result.optimizationJustification}
              </p>
              
              <div className="mt-2 flex flex-col gap-2 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white dark:bg-neutral-900 p-4">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Efficiency improvement</span>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 text-xs font-black rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-350 border border-rose-200 dark:border-rose-800/30 shadow-sm">{result.timeWorst}</span>
                  <ArrowRight className="h-4 w-4 text-neutral-400" />
                  <span className="px-2.5 py-1 text-xs font-black rounded-lg bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-350 border border-green-200 dark:border-green-800/30 shadow-sm">O(n) or O(n log n) equivalent</span>
                </div>
              </div>
            </div>

            {/* Side 2: Optimized Code Code Editor */}
            <div className="flex flex-col border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm">
              
              {/* Tab Selector Bar */}
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-4 py-2 bg-neutral-50 dark:bg-neutral-950 transition-colors">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowOriginalTab(true)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      showOriginalTab 
                        ? "bg-[#a435f0]/10 text-[#a435f0] border border-[#a435f0]/20" 
                        : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                    }`}
                  >
                    Your Code
                  </button>
                  <button
                    onClick={() => setShowOriginalTab(false)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      !showOriginalTab 
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" 
                        : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                    }`}
                  >
                    Optimized Alternative
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={() => copyToClipboard(showOriginalTab ? code : result.optimizedCode)}
                  className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition"
                  title="Copy code"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Editor Block */}
              <div>
                <Editor
                  height="260px"
                  language={monacoLanguage}
                  theme={isDarkMode ? "vs-dark" : "light"}
                  value={showOriginalTab ? code : result.optimizedCode}
                  loading={
                    <div className="flex h-[260px] items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-sm font-semibold text-neutral-400">
                      Loading Code...
                    </div>
                  }
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    fontFamily: "'Fira Code', 'Courier New', Courier, monospace",
                    lineHeight: 18,
                    padding: { top: 12, bottom: 12 },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    readOnly: true,
                  }}
                />
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
