import AboutSection from "@/app/components/about";
import KeyboardShortcutsLegend from '@/components/ui/KeyboardShortcutsLegend';

export const metadata = {
  title: "About | AlgoBuddy",
  description:
    "Learn more about AlgoBuddy, its mission, and how it helps students understand algorithms and data structures through interactive learning."
};

export default function AboutPage() {
  return (
    <>
      <AboutSection />
      {/* Floating Keyboard Shortcuts Legend - visible on all pages */}
      <div className="fixed bottom-4 right-4 z-50">
        <KeyboardShortcutsLegend />
      </div>
    </>
  );
}
