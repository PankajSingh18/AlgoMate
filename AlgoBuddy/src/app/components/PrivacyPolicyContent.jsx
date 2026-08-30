import { policySections } from "./PrivacyPolicyModal";
import Link from "next/link";

export default function PrivacyPolicyContent() {
  return (
    <div className="mx-auto max-w-10xl px-6 pt-3 pb-12">
      <div className="mb-16 max-w-3xl">
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-[#1E1E26] dark:text-gray-300 text-xs font-bold tracking-[0.15em] uppercase mb-6">
          Legal
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
          Privacy Policy
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          Your privacy is important to us. This Privacy Policy explains how
          we collect, use, store, and protect your information when you use
          our website and services.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 font-medium mt-6">
          Last updated: May 29, 2026
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[250px_1fr] items-start">
        <aside className="sticky top-20 hidden lg:block">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
            Contents
          </h2>
          <ul className="space-y-3 border-l border-gray-200 dark:border-[#2A2A35]">
            {policySections.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block pl-4 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-l-2 border-transparent hover:border-gray-400 dark:hover:border-gray-400 transition-all duration-200"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="space-y-8">
          {policySections.map((item) => (
            <section
              key={item.id}
              id={item.id}
              className="scroll-mt-24 pb-10 border-b border-gray-200 dark:border-[#2A2A35]"
            >
              <div className="flex items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {item.title}
                  </h2>

                  {item.points && (
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400 pl-6 mb-4">
                      {item.points.map((point) => (
                        <li key={point} className="list-disc pl-1">
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
                    <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.contact}
                    </p>
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
          className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-semibold rounded-full hover:opacity-90 transition-all duration-200 active:scale-95"
        >
          Accept & Continue
        </Link>
      </div>
    </div>
  );
}