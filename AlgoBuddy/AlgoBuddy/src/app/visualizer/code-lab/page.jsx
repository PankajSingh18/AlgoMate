import InteractiveCodeEditor from "./components/InteractiveCodeEditor";

export const metadata = {
  title: "Code Lab | AlgoBuddy",
  description: "Write, edit and run algorithm code in your browser",
};

export default function CodeLabPage() {
  return (
    <div className="min-h-screen bg-[#0f0a1e] text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-400 mb-2">
          🧪 Interactive Code Lab
        </h1>
        <p className="text-white/60 mb-8">
          Write, edit and run algorithm code directly in your browser.
        </p>
        <InteractiveCodeEditor />
      </div>
    </div>
  );
}