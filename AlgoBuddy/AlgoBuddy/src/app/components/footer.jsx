'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Users } from 'lucide-react'
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaDiscord,
  FaYoutube,
  FaXTwitter,
  FaInstagram,
} from 'react-icons/fa6'



const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterEmailError, setNewsletterEmailError] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (value, isSubmit = false) => {
    if (!value) {
      if (isSubmit) {
        setNewsletterEmailError("Email is required");
        return false;
      }
      setNewsletterEmailError("");
      return true;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setNewsletterEmailError("Please enter a valid email address");
      return false;
    }
    setNewsletterEmailError("");
    return true;
  };

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    setNewsletterSuccess("");
    if (!validateEmail(newsletterEmail, true)) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        setNewsletterEmailError(data.error || "Subscription failed");
      } else {
        setNewsletterSuccess(data.message || "Successfully subscribed!");
        setNewsletterEmail("");
      }
    } catch (error) {
      setNewsletterEmailError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerHeading =
    'text-surface-900 dark:text-white text-lg font-semibold mb-6 relative after:absolute after:left-0 after:-bottom-2 after:w-10 after:h-[2px] after:bg-surface-300 dark:after:bg-gray-600'
  const footerLink =
    'block text-surface-500 dark:text-gray-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-300 text-sm'
  const socialIcon =
    'w-10 h-10 rounded-full bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/10 flex items-center justify-center text-surface-500 dark:text-gray-400 hover:bg-primary/20 hover:border-primary/50 hover:text-primary dark:hover:text-white transition-all duration-300'

  return (
    <>
      <footer className="relative bg-udemy-bg dark:bg-udemy-dark-bg text-surface-500 dark:text-gray-400 overflow-hidden border-t border-surface-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-12">
            {/* Left Section */}
            <div>
              <h2 className="text-4xl font-black tracking-tight">
                <span className="text-surface-900 dark:text-white">Algo</span><span className="text-primary">Buddy</span>
              </h2>

              <p className="mt-6 text-sm leading-8 max-w-xs text-surface-500 dark:text-gray-400">
                Interactive visualization tools for mastering data structures
                and algorithms.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3 mt-8">
                <a
                  href="https://github.com/PankajSingh34/AlgoBuddy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialIcon}
                  aria-label="GitHub"
                >
                  <FaGithub className="w-4 h-4" />
                </a>

                <a
                  href="https://www.linkedin.com/company/algobuddy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialIcon}
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-4 h-4" />
                </a>

                <a
                  href="mailto:AlgoBuddy.connect@gmail.com"
                  className={socialIcon}
                  aria-label="Email"
                >
                  <FaEnvelope className="w-4 h-4" />
                </a>

                <a
                  href="https://www.instagram.com/algobuddy.connect/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialIcon}
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>

                <a
                  href="https://discord.gg/PqnazRxPc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialIcon}
                  aria-label="Join AlgoBuddy Discord Community"
                >
                  <FaDiscord className="w-4 h-4" />
                </a>
              </div>

              {/* Newsletter */}
              <form onSubmit={handleNewsletterSubscribe} className="mt-10">
                <h3 className="text-surface-900 dark:text-white font-semibold mb-2">Stay updated</h3>
                <p className="text-sm mb-4 text-surface-500 dark:text-gray-400 max-w-xs">
                  Subscribe to get the latest updates, features, and tutorials.
                </p>

                <div className="flex overflow-hidden rounded-xl border border-surface-200 dark:border-white/10 bg-surface-100 dark:bg-white/5 focus-within:border-primary/50 transition-colors w-full max-w-sm">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value);
                      validateEmail(e.target.value, false);
                    }}
                    className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-gray-500 disabled:opacity-50"
                  />
                  <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50">
                    {isSubmitting ? "..." : "Subscribe"}
                  </button>
                </div>
                {newsletterEmailError && (
                  <p className="text-red-500 text-xs mt-2" role="alert">
                    {newsletterEmailError}
                  </p>
                )}
                {newsletterSuccess && (
                  <p className="text-green-500 text-xs mt-2" role="alert">
                    {newsletterSuccess}
                  </p>
                )}
              </form>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className={footerHeading}>Quick Links</h3>
              <div className="space-y-4">
                <Link href="/" className={footerLink}>
                  Home
                </Link>
                <Link href="/visualizer" className={footerLink}>
                  Visualizations
                </Link>
                {/* <Link href="/data-structures" className={footerLink}>
                  Data Structures
                </Link> */}
                {/* <Link href="/algorithms" className={footerLink}>
                  Algorithms
                </Link> */}
                <Link href="/about" className={footerLink}>
                  About Us
                </Link>
                <Link href="/contactus" className={footerLink}>
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h3 className={footerHeading}>Resources</h3>
              <div className="space-y-4">
                <Link href="/tutorials" className={footerLink}>
                  Tutorials
                </Link>
                <Link href="/cheatsheets" className={footerLink}>
                  Cheatsheets
                </Link>
                <Link href="/practice" className={footerLink}>
                  Practice Problems
                </Link>
                <Link href="/roadmaps" className={footerLink}>
                  Roadmaps
                </Link>
                <Link href="/recently-viewed" className={footerLink}>
                  Recently Viewed
                </Link>
                <Link href="/blog" className={footerLink}>
                  Blog
                </Link>
                <Link href="/faq" className={footerLink}>
                  FAQ
                </Link>
              </div>
            </div>

            {/* Community */}
            <div>
              <h3 className={footerHeading}>Community</h3>
              <p className="text-sm text-surface-500 dark:text-gray-400 mb-6 leading-relaxed pr-4">
                Join our community and connect with learners and developers.
              </p>
              <div className="space-y-4">
                <Link
                  href="/community"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                  aria-label="Visit AlgoBuddy Community"
                >
                  <Users className="w-4 h-4" /> Community
                </Link>
                <a
                  href="https://discord.gg/PqnazRxPc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-surface-500 dark:text-gray-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-300 text-sm"
                  aria-label="Join AlgoBuddy Discord Community"
                >
                  <FaDiscord className="w-4 h-4" /> Discord
                </a>
                <a
                  href="https://github.com/PankajSingh34/AlgoBuddy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-surface-500 dark:text-gray-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-300 text-sm"
                >
                  <FaGithub className="w-4 h-4" /> GitHub
                </a>
                <a
                  href="https://www.youtube.com/@AlgoBuddy.connect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-surface-500 dark:text-gray-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-300 text-sm"
                >
                  <FaYoutube className="w-4 h-4" /> YouTube
                </a>
                <a
                  href="https://www.instagram.com/algobuddy.connect/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-surface-500 dark:text-gray-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-300 text-sm"
                >
                  <FaInstagram className="w-4 h-4" /> Instagram
                </a>
                <a
                  href="https://x.com/AlgoBuddy_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-surface-500 dark:text-gray-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-300 text-sm"
                >
                  <FaXTwitter className="w-4 h-4" /> Twitter
                </a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h3 className={footerHeading}>Legal</h3>
              <div className="space-y-4">
                <Link href="/privacy"
                  className="flex items-center gap-3 text-surface-500 dark:text-gray-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-300 text-sm"
                >
                  Privacy Policy
                </Link>
                
                  <Link href="/terms" className={footerLink}>
  Terms of Service
</Link>
<Link href="/cookie" className={footerLink}>
  Cookies Policy
</Link>


                <Link href="/code-of-conduct"
                  className="flex items-center gap-3 text-surface-500 dark:text-gray-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-300 text-sm"
                >
                  Code Of Conduct
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="border-t border-surface-200 dark:border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-surface-400 dark:text-gray-500">
            <p>© {new Date().getFullYear()} AlgoBuddy. All rights reserved.</p>
            <p>
              Made with <span className="text-primary">💜</span> by developers,
              for developers.
            </p>
          </div>
        </div>
      </footer>
      
    </>
  )
}

export default Footer
