import SmartRevisionFlashcards from "@/app/components/SmartRevisionFlashcards";

export const metadata = {
  title: "Smart Revision | AlgoBuddy",
  description:
    "Revise completed DSA topics and practice with flashcards to test your knowledge.",
};

export default function SmartRevisionPage() {
  return (
    <div className="min-h-screen p-8 bg-white dark:bg-[#1c1d1f] text-black dark:text-white">
      <h1 className="text-4xl font-bold mb-4">
        Smart Revision
      </h1>

      <p className="text-lg mb-6">
        Revise your completed DSA topics using interactive flashcards.
      </p>

      <SmartRevisionFlashcards />
    </div>
  );
}
