"use client";

import React, { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/apiClient";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  Clock3,
  MessageSquare,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Footer from "@/app/components/footer";

const faqs = [
  {
    question: "How quickly can I expect a response?",
    answer:
      "Most queries are answered within 24-48 hours depending on workload.",
  },
  {
    question: "Can I contribute to AlgoBuddy?",
    answer:
      "Yes! Contributions, feature suggestions, and improvements are always welcome.",
  },
  {
    question: "Where can I report bugs?",
    answer: "You can use this contact form or reach out through GitHub issues.",
  },
];

const ContactUs = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "General",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSubmitted(false);

    try {
      const data = await api.request("/api/contact", {
        method: "POST",
        body: {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          category: formData.category,
          message: formData.message,
          captchaToken: "",
        },
      });

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "General",
        message: "",
      });

      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-udemy-bg dark:bg-udemy-dark-bg text-udemy-text dark:text-udemy-dark-text overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 blur-3xl rounded-full opacity-40" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full opacity-30" />

        {/* Hero */}
        <section className="relative container-app pt-24 pb-14">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium">
              <Sparkles size={16} />
              We'd Love to Hear From You
            </div>

            <h1 className="mt-6 text-5xl md:text-6xl font-black tracking-tight leading-tight">
              Contact <span className="text-primary">AlgoBuddy</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-udemy-muted dark:text-udemy-dark-muted ...">
              Whether you have feedback, collaboration ideas, feature requests, or
              bug reports — our inbox is always open.
            </p>
          </div>
        </section>

        {/* Main Grid */}
        <section className="relative container-app pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10">
            {/* LEFT SIDE */}
            <div className="space-y-8">
              {/* Contact Info Card */}
              <div className="bg-white/80 dark:bg-udemy-dark-surface/80 backdrop-blur-xl border border-udemy-border dark:border-udemy-dark-border rounded-3xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold mb-8">Contact Information</h2>

                <div className="space-y-6">
                  <div className="group flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <p className="text-udemy-muted dark:text-udemy-dark-muted text-sm mt-1">
                        singhps588@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Phone</h3>
                      <p className="text-udemy-muted dark:text-udemy-dark-muted text-sm mt-1">
                        +91 XXXXX XXXXX
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Location</h3>
                      <p className="text-udemy-muted dark:text-udemy-dark-muted text-sm mt-1">India</p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition">
                      <Clock3 size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Response Time</h3>
                      <p className="text-udemy-muted dark:text-udemy-dark-muted text-sm mt-1">
                        Usually within 24-48 hours
                      </p>
                    </div>
                  </div>

                </div>

                {/* Social Buttons */}
                <div className="mt-10">
                  <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://github.com/PankajSingh34/AlgoBuddy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-2xl border border-udemy-border dark:border-udemy-dark-border flex items-center justify-center text-udemy-muted dark:text-udemy-dark-muted hover:text-white hover:border-primary hover:bg-primary/10 transition-all duration-300"
                    >
                      <Github size={24} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/pankaj-singh-2a968b212/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-2xl border border-udemy-border dark:border-udemy-dark-border flex items-center justify-center text-udemy-muted dark:text-udemy-dark-muted  hover:text-white hover:border-primary hover:bg-primary/10 transition-all duration-300"
                    >
                      <Linkedin size={24} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Help Card */}
              <div className="bg-gradient-to-br from-primary/10 to-blue-500/5 border border-primary/20 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="text-primary" size={26} />
                  <h3 className="text-2xl font-bold">Need Quick Help?</h3>
                </div>
                <p className="text-udemy-muted dark:text-udemy-dark-muted leading-relaxed">
                  For faster communication, mention the exact issue, feature, or
                  topic in your subject line.
                </p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-udemy-text dark:text-udemy-dark-text">
                    <CheckCircle2 size={18} className="text-primary" />
                    Bug Reports
                  </div>
                  <div className="flex items-center gap-2 text-sm text-udemy-text dark:text-udemy-dark-text">
                    <CheckCircle2 size={18} className="text-primary" />
                    Feature Requests
                  </div>
                  <div className="flex items-center gap-2 text-sm text-udemy-text dark:text-udemy-dark-text">
                    <CheckCircle2 size={18} className="text-primary" />
                    Collaboration Ideas
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE — Contact Form */}
            <div className="bg-white/80 dark:bg-udemy-dark-surface/80 backdrop-blur-xl border border-udemy-border dark:border-udemy-dark-border rounded-3xl p-8 shadow-2xl">
              <h2 className="text-3xl font-bold mb-2">Send a Message</h2>
              <p className="text-udemy-muted dark:text-udemy-dark-muted mb-8">
                Fill out the form below and we'll get back to you soon.
              </p>

              {submitted && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-4 text-green-400">
                  <CheckCircle2 size={22} />
                  Message sent successfully!
                </div>
              )}

              {error && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-red-400">
                  <span className="text-lg">&#9888;</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full rounded-2xl bg-white dark:bg-udemy-dark-bg border border-udemy-border dark:border-udemy-dark-border text-udemy-text dark:text-udemy-dark-text px-4 py-3 outline-none focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full rounded-2xl bg-white dark:bg-udemy-dark-bg border border-udemy-border dark:border-udemy-dark-border text-udemy-text dark:text-udemy-dark-text px-4 py-3 outline-none focus:border-primary transition"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Enter subject"
                      className="w-full rounded-2xl bg-white dark:bg-udemy-dark-bg border border-udemy-border dark:border-udemy-dark-border text-udemy-text dark:text-udemy-dark-text px-4 py-3 outline-none focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full rounded-2xl bg-white dark:bg-udemy-dark-bg border border-udemy-border dark:border-udemy-dark-border text-udemy-text dark:text-udemy-dark-text px-4 py-3 outline-none focus:border-primary transition"
                    >
                      <option>General</option>
                      <option>Bug Report</option>
                      <option>Feature Request</option>
                      <option>Collaboration</option>
                      <option>Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={7}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className="w-full rounded-2xl bg-white dark:bg-udemy-dark-bg border border-udemy-border dark:border-udemy-dark-border text-udemy-text dark:text-udemy-dark-text px-4 py-4 outline-none focus:border-primary transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full bg-primary hover:opacity-90 transition-all duration-300 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send
                        size={18}
                        className="group-hover:translate-x-1 transition"
                      />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black">Frequently Asked Questions</h2>
              <p className="text-udemy-muted dark:text-udemy-dark-muted mt-4">
                Quick answers to common questions.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-5">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-udemy-border dark:border-udemy-dark-border rounded-2xl overflow-hidden bg-white dark:bg-udemy-dark-surface"
                >
                  <button
                    onClick={() =>
                      setActiveFaq(activeFaq === index ? null : index)
                    }
                    className="w-full text-left px-6 py-5 flex items-center justify-between"
                  >
                    <span className="font-semibold text-lg">{faq.question}</span>
                    <span className="text-primary text-2xl">
                      {activeFaq === index ? "-" : "+"}
                    </span>
                  </button>

                  {activeFaq === index && (
                    <div className="px-6 pb-5 text-udemy-dark-muted leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Back Home */}
          <div className="mt-20 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-udemy-dark-border hover:border-primary hover:text-primary transition"
            >
              ← Back to Home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ContactUs;