"use client";
import { termsSections } from "./TermsOfServiceModal";
import Link from "next/link";

export default function TermsOfServiceContent() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-8"
      >
        <span className="mr-2">←</span> Back to Home
      </Link>

      <div className="mb-16 max-w-3xl">
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-[#1E1E26] dark:text-gray-300 text-xs font-bold tracking-[0.15em] uppercase mb-6">
          Legal
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
          Terms of Service
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          Please read these terms and conditions carefully before using our website and services.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 font-medium mt-6">
          Last updated: May 17, 2025
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[250px_1fr] items-start">
        <aside className="sticky top-24 hidden lg:block">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
            Contents
          </h2>
          <ul className="space-y-3 border-l border-gray-200 dark:border-[#2A2A35]">
            {termsSections.map((item) => (
              <li key={item.id}>
                <a
                  href={`#terms-${item.id}`}
                  className="block pl-4 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-l-2 border-transparent hover:border-gray-400 dark:hover:border-purple-400 transition-all duration-200"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="space-y-12">
          {termsSections.map((item) => (
            <section
              key={item.id}
              id={`terms-${item.id}`}
              className="scroll-mt-24 pb-10 border-b border-gray-200 dark:border-[#2A2A35]"
            >
              <div className="flex items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {item.title}
                  </h2>

                  {item.points && (
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400 pl-6 mb-4">
                      {item.points.map((point, i) => (
                        <li key={i} className="list-disc pl-1">
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.data && (
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.data}
                    </p>
                  )}

                  {item.contact && (
                    <div className="mt-4">
                      <a
                        href={`mailto:${item.contact}`}
                        className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed"
                      >
                        {item.contact}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
      <div className="pt-8 flex justify-end">
        <Link
           href="/"
           className="px-8 py-3.5 bg-black text-white dark:bg-white dark:text-black font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 active:scale-95 shadow-md flex items-center gap-2"
        >
           Accept & Continue
        </Link>
      </div>
    </div>
    
  );
}