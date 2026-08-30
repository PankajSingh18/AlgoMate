"use client";
import React from "react";
import Link from "next/link";


const cookieSections = [
  {
    id: "what-are-cookies",
    title: "What Cookies Are",
    content: (
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently, provide a better user experience, and supply information to the owners of the site.
      </p>
    )
  },
  {
    id: "why-we-use-cookies",
    title: "Why We Use Cookies",
    content: (
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        We use cookies and similar tracking technologies to recognize you when you visit our platform, remember your preferences, understand how you interact with our services, and enhance your overall experience. They also help us ensure the security of your account and prevent fraudulent activity.
      </p>
    )
  },
  {
    id: "essential-cookies",
    title: "Essential Cookies",
    content: (
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        These cookies are strictly necessary to provide you with services available through our platform and to use some of its features. Because these cookies are strictly necessary to deliver the website, refusing them will impact how our site functions. You can block or delete them by changing your browser settings, but some parts of the site will not work properly.
      </p>
    )
  },
  {
    id: "functional-cookies",
    title: "Functional Cookies",
    content: (
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        These cookies allow our website to remember choices you make (such as your user name, language, or the region you are in) and provide enhanced, more personal features. The information these cookies collect may be anonymized and they cannot track your browsing activity on other websites.
      </p>
    )
  },
  {
    id: "analytics-cookies",
    title: "Analytics Cookies",
    content: (
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website and application for you in order to enhance your experience.
      </p>
    )
  },
  {
    id: "performance-cookies",
    title: "Performance Cookies",
    content: (
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        These cookies collect information about how visitors use a website, for instance which pages visitors go to most often, and if they get error messages from web pages. These cookies don't collect information that identifies a visitor. All information these cookies collect is aggregated and therefore anonymous.
      </p>
    )
  },
  {
    id: "third-party-cookies",
    title: "Third-Party Cookies",
    content: (
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In some special cases, we also use cookies provided by trusted third parties. For example, we use third-party analytics to help us understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit.
      </p>
    )
  },
  {
    id: "cookie-retention",
    title: "Cookie Retention Policy",
    content: (
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The length of time that a cookie remains on your computer or mobile device depends on whether it is a "persistent" or "session" cookie. Session cookies last until you stop browsing, and persistent cookies last until they expire or are deleted. Most of the cookies we use are persistent and will expire between 30 minutes and two years from the date they are downloaded to your device.
      </p>
    )
  },
  {
    id: "managing-preferences",
    title: "Managing Cookie Preferences",
    content: (
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        You can manage your cookie preferences at any time by accessing our cookie consent manager. This tool allows you to adjust your settings for non-essential cookies. Please note that blocking some types of cookies may impact your experience of the site and the services we are able to offer.
      </p>
    )
  },
  {
    id: "browser-controls",
    title: "Browser Cookie Controls",
    content: (
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In addition to our cookie consent manager, most browsers allow you to manage cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you.
      </p>
    )
  },
  {
    id: "updates",
    title: "Updates to This Policy",
    content: (
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
      </p>
    )
  },
  {
    id: "contact",
    title: "Contact Information",
    content: (
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If you have any questions about our use of cookies or other technologies, please contact us at{" "}
        <a href="mailto:hello@algobuddy.in" className="text-purple-600 dark:text-purple-400 hover:underline font-medium transition-colors">
          hello@algobuddy.in
        </a>.
      </p>
    )
  }
];

export default function CookiePolicyContent() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-8"
      >
        <span className="mr-2">←</span> Return Home
      </Link>

      {/* Hero Section */}
      <div className="mb-16 max-w-3xl">
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-[#1E1E26] dark:text-gray-300 text-xs font-bold tracking-[0.15em] uppercase mb-6">
          Legal
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
          Cookie Policy
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          Learn how we use cookies and similar technologies to improve your experience on AlgoBuddy. We believe in transparency and giving you control over your data.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 font-medium mt-6">
          Last updated: May 17, 2025
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[250px_1fr] items-start">
        {/* Sidebar */}
        <aside className="sticky top-24 hidden lg:block">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
            Contents
          </h2>
          <ul className="space-y-3 border-l border-gray-200 dark:border-[#2A2A35]">
            {cookieSections.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block pl-4 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-l-2 border-transparent hover:border-gray-400 dark:hover:border-purple-400 transition-all duration-200"
                >
                  {item.title}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#cookie-types"
                className="block pl-4 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-l-2 border-transparent hover:border-gray-400 dark:hover:border-purple-400 transition-all duration-200"
              >
                Cookie Types Table
              </a>
            </li>
          </ul>
        </aside>

        {/* Content */}
        <div className="space-y-12">
          {cookieSections.map((section) => (
            <section 
              key={section.id} 
              id={section.id}
              className="scroll-mt-24 pb-10 border-b border-gray-200 dark:border-[#2A2A35]"
            >
              <div className="flex items-start mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {section.title}
                  </h2>
                  {section.content}
                </div>
              </div>
            </section>
          ))}

          {/* Cookie Types Table */}
          <section id="cookie-types" className="scroll-mt-24 bg-white dark:bg-[#14141A] rounded-2xl border border-gray-200 dark:border-[#2A2A35] overflow-hidden shadow-sm hover:border-purple-500/40 transition-colors duration-300">
            <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-[#2A2A35]">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Cookie Types & Details</h2>
              <p className="text-gray-600 dark:text-gray-400">
                A detailed breakdown of the specific cookies we use on our platform.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-[#1A1A24]/50">
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-white">Cookie Type</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-white">Purpose</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-white">Duration</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-white">Requirement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-[#2A2A35]">
                  <tr className="hover:bg-gray-50 dark:hover:bg-[#1A1A24]/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-900 dark:text-gray-300 font-medium">Session ID</td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">Maintains your active session while using AlgoBuddy.</td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">Session</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300">
                        Required
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-[#1A1A24]/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-900 dark:text-gray-300 font-medium">Authentication</td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">Keeps you securely logged into your account.</td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">30 Days</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300">
                        Required
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-[#1A1A24]/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-900 dark:text-gray-300 font-medium">Theme Preference</td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">Remembers your choice of Light or Dark mode.</td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">1 Year</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300">
                        Optional
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-[#1A1A24]/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-900 dark:text-gray-300 font-medium">Analytics</td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">Helps us understand how features are used to improve the platform.</td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">2 Years</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300">
                        Optional
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Accept Button area */}
          <div className="pt-8 flex justify-end">
             <Link
               href="/"
               className="px-8 py-3.5 bg-black text-white dark:bg-white dark:text-black font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 active:scale-95 shadow-md flex items-center gap-2"
             >
               Accept & Continue
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}