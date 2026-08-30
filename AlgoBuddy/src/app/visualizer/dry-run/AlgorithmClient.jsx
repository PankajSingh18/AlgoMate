import Footer from "@/app/components/footer";
import DryRunClient from "./DryRunClient";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import { createVisualizerPaths } from "@/app/visualizer/components/VisualizerPageLayout";

export default function DryRunPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#101216] dark:text-slate-100 flex flex-col">
      <div className="w-full px-6 md:px-12 pt-6">
        <div className="mb-4 mt-2">
          <Breadcrumbs paths={createVisualizerPaths("Code Lab", "Dry Run")} />
        </div>
      </div>
      <div className="flex-1">
        <DryRunClient />
      </div>
      <Footer />
    </div>
  );
}
