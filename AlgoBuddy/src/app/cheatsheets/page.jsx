import CheatsheetsIndex from "@/app/components/cheatsheets/index";
import Footer from "@/app/components/footer";
import Link from "next/link";

export const metadata = {
  title: "DSA Cheatsheets | AlgoBuddy",
  description:
    "Comprehensive DSA cheatsheets covering sorting, searching, trees, graphs, linked lists, stacks, queues, hashmaps, recursion, and more. Includes time/space complexity, code snippets, and algorithm steps.",
};

export default function CheatsheetsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <main className="container-app section-app">
        <div className="mx-auto max-w-6xl">
          <CheatsheetsIndex />
          <div className="mt-16 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all font-semibold text-sm text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
