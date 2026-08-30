import "./globals.css";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { UserProvider } from "@/features/user/UserContext";
import { NotificationProvider } from "@/features/notifications/NotificationContext";
import ClientLayoutWrapper from "@/app/components/ui/ClientLayoutWrapper";
import BackToTop from "@/app/components/ui/backtotop";
import VoiceAgent from "@/app/components/VoiceAgent";
import { Inter, Source_Sans_3, Source_Serif_4 } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-source-sans-3",
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source-serif-4",
  display: "swap",
});


const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata = {
  metadataBase: new URL("https://www.algobuddy.me"),
  title: "AlgoBuddy | Visualize & Learn DSA the Smart Way",
  description:
    "Master Data Structures and Algorithms with interactive visualizations. Perfect for students, beginners, and interview prep. Visualize Stack, Queue, Tree, Graph, Sorting & more.",
  keywords: [
    "AlgoBuddy",
    "DSA Visualizer",
    "Data Structures and Algorithms",
    "Visual DSA Tool",
    "Learn DSA Online",
    "DSA for Beginners",
    "DSA Practice",
    "Stack Visualizer",
    "Queue Visualizer",
    "Graph Visualizer",
    "Sorting Algorithms",
  ],
  authors: [{ name: "Sohan Rout" }],
  creator: "Sohan Rout",
  publisher: "AlgoBuddy",
  robots: "index, follow",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "AlgoBuddy | Visualize & Learn DSA the Smart Way",
    description:
      "Interactive platform to visualize and learn DSA concepts easily. Great for students and interview preparation.",
    url: "https://www.algobuddy.me/",
    siteName: "AlgoBuddy",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "AlgoBuddy Preview Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlgoBuddy | Learn DSA the Smart Way",
    description:
      "Visualize algorithms like Stack, Queue, Graphs, and Sorting in real-time. Learn DSA interactively.",
    images: ["/og.png"],
  },
};

export default async function RootLayout({ children }) {
  // auth is handled client-side via UserContext (Supabase)

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={`${inter.variable} ${sourceSans3.variable} ${sourceSerif4.variable}`}>
      <head>
        <meta name="application-name" content="AlgoBuddy" />
        <meta property="og:site_name" content="AlgoBuddy" />
        <link rel="icon" href="/favicon.ico?v=3" />

        {/* Prevent flash: apply saved theme before React hydrates */}
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  if (theme === 'dark') document.documentElement.classList.add('dark');
                  else document.documentElement.classList.remove('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
        {/* Google AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5588131730389378"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Google Analytics Script */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="bg-white text-[var(--udemy-text)] dark:bg-[var(--udemy-dark-bg)] dark:text-[var(--udemy-dark-text)]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[var(--color-primary)] focus:text-white focus:rounded-[var(--radius-md)]"
        >
          Skip to content
        </a>
        <UserProvider>
          <NotificationProvider>
            <ClientLayoutWrapper>
              <div id="main-content">{children}</div>
            </ClientLayoutWrapper>
          </NotificationProvider>
        </UserProvider>
      <BackToTop />
      <VoiceAgent />
        <SpeedInsights />
      </body>
    </html>
  );
}
