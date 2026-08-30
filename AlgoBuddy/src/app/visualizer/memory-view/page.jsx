import MemoryRepresentation from "@/app/components/MemoryRepresentation";

export const metadata = {
  title: "Memory Representation | AlgoBuddy",
  description:
    "Visualize how arrays, linked lists, stacks, queues, trees, and hash maps are stored and managed in memory.",
};

export default function MemoryViewPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] text-gray-800 dark:text-white p-6">
      
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-4xl font-bold text-center mb-4">
          Data Structure Memory Representation
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-10">
          Understand how different data structures are organized in memory,
          including indexing, node links, stack/queue behavior, tree relations,
          and hash map bucket allocation.
        </p>

        <MemoryRepresentation />

      </div>

    </div>
  );
}