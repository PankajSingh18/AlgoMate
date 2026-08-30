import CodeOfConductContent from "@/app/components/CodeOfConductContent";
import Footer from "@/app/components/footer";

export default function CodeOfConductPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">
          Code Of Conduct
        </h1>

        <CodeOfConductContent />
      </div>
      <Footer/>
    </main>
  );
}
