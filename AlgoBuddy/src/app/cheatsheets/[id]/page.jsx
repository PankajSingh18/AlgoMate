import CheatsheetDetail from "@/app/components/cheatsheets/CheatsheetDetail";
import Footer from "@/app/components/footer";
import { allCheatsheets, getCheatsheetById } from "@/app/components/cheatsheets/data";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return allCheatsheets.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }) {
  const cheatsheet = getCheatsheetById(params.id);
  if (!cheatsheet) return { title: "Cheatsheet Not Found | AlgoBuddy" };
  return {
    title: `${cheatsheet.title} Cheatsheet | AlgoBuddy`,
    description: `${cheatsheet.title} — ${cheatsheet.whenToUse || ""} Time complexity: ${cheatsheet.timeComplexity.average}, Space: ${cheatsheet.spaceComplexity}.`,
  };
}

export default function CheatsheetPage({ params }) {
  const cheatsheet = getCheatsheetById(params.id);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <main className="container-app section-app">
        <CheatsheetDetail cheatsheet={cheatsheet} />
      </main>
      <Footer />
    </div>
  );
}
