import { codeOfConductSections } from "@/app/data/codeOfConductData";
import Link from "next/link";

export default function CodeOfConductContent() {
  return (
    <>
      <p className="mb-8 text-gray-700 dark:text-gray-300 leading-relaxed text-base">
        This Code of Conduct outlines the standards of behavior expected from
        all users and contributors of our platform. It explains our commitment
        to creating a respectful, inclusive, and collaborative environment,
        along with the responsibilities, reporting process, and actions taken to
        maintain a positive community experience.
      </p>

      <div className="grid gap-8 lg:grid-cols-[250px_1fr] items-start">
        <aside className="sticky top-20 hidden lg:block">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
            Contents
          </h2>
          <ul className="space-y-3 border-l border-gray-200 dark:border-[#2A2A35]">
            {codeOfConductSections.map((item) => (
              <li key={item.id}>
                <a
                  href={`#section-${item.id}`}
                  className="block pl-4 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-l-2 border-transparent hover:border-gray-400 dark:hover:border-gray-400 transition-all duration-200"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="space-y-8">
          {codeOfConductSections.map((item) => (
            <section
              key={item.id}
              id={`section-${item.id}`}
              className="scroll-mt-24 pb-10 border-b border-gray-200 dark:border-[#2A2A35]"
            >
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
                  <a
                    href={`mailto:${item.contact}`}
                    className="text-gray-900 dark:text-white font-medium transition-colors">
                  
                    {item.contact}
                  </a>
                </p>
              )}
            </section>
          ))}
        </div>
      </div>

      <div className="pt-8 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: May 17, 2025</p>
        <Link
          href="/"
          className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-semibold rounded-full hover:opacity-90 transition-all duration-200 active:scale-95"
        >
          Accept &amp; Continue
        </Link>
      </div>
    </>
  );
}