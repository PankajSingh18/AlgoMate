import CookiePolicyContent from "@/app/components/CookiePolicyContent";
import Footer from "@/app/components/footer";

export const metadata = {
  title: "Cookies Policy | AlgoBuddy",
  description: "Cookie policy for AlgoBuddy.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen">
      <CookiePolicyContent />
      <Footer/>
    </main>
  );
}