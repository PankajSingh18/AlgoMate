"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronDown,
  FiSearch,
  FiHelpCircle,
  FiMail,
  FiGithub,
  FiMessageCircle,
  FiBook,
  FiCode,
  FiActivity,
  FiUsers,
} from "react-icons/fi";
import Support from "@/app/components/support";
import Footer from "@/app/components/footer";

const faqData = {
  "General": [
    { question: "What is AlgoBuddy?", answer: "AlgoBuddy is an interactive learning platform designed to help you master Data Structures and Algorithms through dynamic visual representations and hands-on practice." },
    { question: "Is AlgoBuddy free?", answer: "Yes, AlgoBuddy provides many free resources for learners. We also plan to introduce premium features in the future for advanced tracking and personalized learning paths." },
    { question: "Who is AlgoBuddy for?", answer: "It's for everyone! Whether you're a beginner taking your first computer science class, or an experienced developer preparing for coding interviews." }
  ],
  "Getting Started": [
    { question: "How do I create an account?", answer: "You can create an account by clicking the 'Sign Up' button in the top right corner. You can use your email or sign in directly with Google or GitHub." },
    { question: "Do I need to install anything?", answer: "No, AlgoBuddy runs entirely in your web browser. There's no need to install any software or configure local environments." },
    { question: "Where should I start?", answer: "If you're new, we recommend starting with the Practice page and the beginner tutorial series, which introduce basic arrays and loops." }
  ],
  "Visualizers": [
    { question: "How do visualizers work?", answer: "Visualizers take abstract code execution and render it graphically step-by-step. You can control the speed, pause, step forward, or step backward to understand exactly how variables and structures change." },
    { question: "Can I input my own data?", answer: "Yes! Most of our visualizers allow you to input custom arrays, graphs, or strings to see how the algorithm handles your specific edge cases." },
    { question: "Are new algorithms being added?", answer: "Absolutely. We constantly update our library. If there's a specific algorithm you want to see, let us know in the community Discord!" }
  ],
  "Practice": [
    { question: "How can I track my progress?", answer: "Once logged in, your progress is automatically saved. You can view your completed problems, current streak, and mastery level on your profile." },
    { question: "Does the code editor support multiple languages?", answer: "Currently, our integrated code editor supports JavaScript, Python, Java, and C++. We are working on adding more languages soon." }
  ],
  "Arena": [
    { question: "What is the Arena?", answer: "The Arena is a competitive section where you can test your skills against other developers in real-time algorithm challenges." },
    { question: "How does Arena ranking work?", answer: "Rankings are based on the Elo rating system. You gain points by solving problems faster and more accurately than your peers during Arena matches." }
  ],
  "Community": [
    { question: "Can I contribute to the project?", answer: "Yes! AlgoBuddy is open to community contributions. Check out our GitHub repository for contribution guidelines and open issues." },
    { question: "How do I report bugs?", answer: "If you find a bug, please open an issue on our GitHub page or report it in the '#bug-reports' channel on our Discord server." }
  ],
  "Account": [
    { question: "How do I reset my password?", answer: "You can reset your password by clicking 'Forgot Password' on the login screen. A reset link will be sent to your registered email address." },
    { question: "Can I delete my account?", answer: "Yes, you can permanently delete your account and all associated data from the Settings page." }
  ]
};

const categories = Object.keys(faqData);

const stats = [
  { label: "Algorithms Covered", value: "50+", icon: FiCode },
  { label: "Visualizers Available", value: "30+", icon: FiActivity },
  { label: "Practice Problems", value: "200+", icon: FiBook },
  { label: "Contributors", value: "15+", icon: FiUsers },
];

const FAQSection = () => {
  const [activeCategory, setActiveCategory] = useState("General");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Handle Search Filtering
  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return faqData[activeCategory];

    const lowerQuery = searchQuery.toLowerCase();
    // If searching, search across all categories to make it useful
    const allFaqs = [];
    Object.entries(faqData).forEach(([cat, faqs]) => {
      faqs.forEach(faq => {
        if (faq.question.toLowerCase().includes(lowerQuery) || faq.answer.toLowerCase().includes(lowerQuery)) {
          allFaqs.push({ ...faq, category: cat });
        }
      });
    });
    return allFaqs;
  }, [searchQuery, activeCategory]);

  return (
    <>
      <section className="relative min-h-screen bg-udemy-surface dark:bg-udemy-dark-bg overflow-hidden font-sans">

        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 dark:opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-udemy-purple via-udemy-purple-light to-transparent blur-3xl rounded-full mix-blend-multiply dark:mix-blend-screen transform -translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-20 pb-16">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-udemy-purple/10 text-udemy-purple dark:text-udemy-purple-light text-sm font-bold tracking-wider uppercase mb-6">
                <FiHelpCircle className="w-4 h-4" />
                Help Center
              </span>
              <h1 className="text-4xl md:text-6xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text mb-6">
                How can we{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-udemy-purple to-udemy-purple-light">
                  help you?
                </span>
              </h1>
              <p className="text-lg md:text-xl text-udemy-muted dark:text-udemy-dark-muted leading-relaxed max-w-2xl mx-auto mb-10">
                Search our knowledge base or browse categories to find answers to your questions.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-udemy-muted dark:text-udemy-dark-muted" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-udemy-dark-surface border-2 border-transparent focus:border-udemy-purple dark:focus:border-udemy-purple rounded-2xl text-udemy-text dark:text-udemy-dark-text placeholder-udemy-muted dark:placeholder-udemy-dark-muted shadow-lg focus:ring-0 transition-all outline-none text-lg"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setActiveIndex(null); // reset accordion on search
                  }}
                />
              </div>
            </motion.div>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Sidebar / Categories */}
            <div className="lg:col-span-3">
              <div className="sticky top-24">
                <h3 className="text-sm font-bold text-udemy-muted dark:text-udemy-dark-muted uppercase tracking-wider mb-4 px-2 hidden lg:block">
                  Categories
                </h3>
                {/* Horizontal scroll on mobile, vertical list on desktop */}
                <div className="flex overflow-x-auto lg:flex-col gap-2 pb-4 lg:pb-0 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setActiveCategory(category);
                        setSearchQuery("");
                        setActiveIndex(null);
                      }}
                      className={`whitespace-nowrap flex-shrink-0 lg:w-full text-left px-4 lg:px-5 py-3 rounded-xl transition-all duration-200 font-medium ${activeCategory === category && !searchQuery
                          ? "bg-udemy-purple text-white shadow-md"
                          : "bg-white/50 dark:bg-udemy-dark-surface/50 text-udemy-text dark:text-udemy-dark-text hover:bg-udemy-purple/10 hover:text-udemy-purple dark:hover:text-udemy-purple-light"
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ Accordion List */}
            <div className="lg:col-span-9 min-h-[400px]">
              <div className="mb-6 flex items-end justify-between">
                <h2 className="text-2xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text">
                  {searchQuery ? "Search Results" : activeCategory}
                </h2>
                {searchQuery && (
                  <span className="text-sm text-udemy-muted dark:text-udemy-dark-muted">
                    Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {filteredFAQs.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-udemy-dark-surface rounded-2xl border border-udemy-border dark:border-udemy-dark-border border-dashed">
                  <FiSearch className="w-12 h-12 mx-auto text-udemy-muted/50 dark:text-udemy-dark-muted/50 mb-4" />
                  <p className="text-lg text-udemy-muted dark:text-udemy-dark-muted">
                    No FAQs found matching "{searchQuery}"
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-udemy-purple hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={index}
                      className={`bg-white dark:bg-udemy-dark-surface border border-udemy-border dark:border-udemy-dark-border rounded-2xl overflow-hidden transition-all duration-300 ${activeIndex === index
                          ? "shadow-md ring-1 ring-udemy-purple/20"
                          : "shadow-sm hover:shadow-md hover:border-udemy-purple/30 dark:hover:border-udemy-purple/50"
                        }`}
                    >
                      <button
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                        onClick={() => toggleAccordion(index)}
                        aria-expanded={activeIndex === index}
                      >
                        <div className="pr-8">
                          {searchQuery && (
                            <span className="text-xs font-bold text-udemy-purple dark:text-udemy-purple-light uppercase tracking-wider mb-2 block">
                              {faq.category}
                            </span>
                          )}
                          <h3 className="text-lg font-bold text-udemy-text dark:text-udemy-dark-text leading-tight">
                            {faq.question}
                          </h3>
                        </div>
                        <motion.div
                          animate={{ rotate: activeIndex === index ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex-shrink-0 text-udemy-muted dark:text-udemy-dark-muted"
                        >
                          <FiChevronDown className="w-6 h-6" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {activeIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 pt-0 text-udemy-muted dark:text-udemy-dark-muted leading-relaxed">
                              <div className="pt-4 border-t border-udemy-border/50 dark:border-udemy-dark-border/50">
                                {faq.answer}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Section */}
          <div className="max-w-6xl mx-auto mt-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white/50 dark:bg-udemy-dark-surface/50 backdrop-blur-sm border border-udemy-border dark:border-udemy-dark-border rounded-2xl p-6 text-center hover:bg-white dark:hover:bg-udemy-dark-surface transition-colors">
                  <div className="w-12 h-12 mx-auto bg-udemy-purple/10 dark:bg-udemy-purple/20 rounded-xl flex items-center justify-center text-udemy-purple dark:text-udemy-purple-light mb-4">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold text-udemy-text dark:text-udemy-dark-text mb-1 font-serif">{stat.value}</div>
                  <div className="text-sm text-udemy-muted dark:text-udemy-dark-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Support Options */}
          <div className="max-w-6xl mx-auto mt-24">
            <div className="bg-gradient-to-br from-udemy-purple to-udemy-purple-dark rounded-3xl p-8 lg:p-12 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold font-serif mb-4">
                  Still need help?
                </h3>
                <p className="text-purple-100 text-lg mb-10">
                  Can't find the answer you're looking for? Reach out to our community or support team.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                  <Link href="mailto:support@algobuddy.com" className="flex flex-col items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 transition-all group backdrop-blur-sm">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FiMail className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">Contact Support</span>
                  </Link>
                  <Link href="https://github.com/PankajSingh34/AlgoBuddy/issues" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 transition-all group backdrop-blur-sm">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FiGithub className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">GitHub Issues</span>
                  </Link>
                  <Link href="https://discord.gg/Gv2N4U3KAc" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 transition-all group backdrop-blur-sm">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FiMessageCircle className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">Discord Community</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Support component backward compatibility */}
          <div className="hidden">
            <Support />
          </div>

          <Link
            href="/"
            className="mt-16 mx-auto flex w-fit items-center gap-2 px-6 py-3 rounded-2xl border border-udemy-border dark:border-udemy-dark-border hover:border-udemy-purple hover:text-udemy-purple dark:hover:text-udemy-purple-light transition bg-white dark:bg-udemy-dark-surface font-medium"
          >
            ← Back to Home
          </Link>

        </div>
      </section>
      <Footer />
    </>
  );
};

export default FAQSection;
