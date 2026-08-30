"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";

const roleBadges = {
  Founder: "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400",
  "Co-Founder": "bg-blue-50 text-blue-650 dark:bg-blue-950/30 dark:text-blue-400",
  "Lead Designer": "bg-pink-50 text-pink-600 dark:bg-pink-950/30 dark:text-pink-400",
  "Tech Lead": "bg-orange-50 text-orange-650 dark:bg-orange-950/30 dark:text-orange-400",
  DevOps: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
};

const teamMembers = [
  {
    name: "Pankaj Singh",
    role: "Founder",
    title: "Full Stack Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    links: { github: "https://github.com/PankajSingh34", linkedin: "https://www.linkedin.com/in/pankaj-singh-2a968b212", twitter: "#" },
  },
  {
    name: "Rohit Verma",
    role: "Co-Founder",
    title: "Backend Developer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    links: { github: "#", linkedin: "#" },
  },
  {
    name: "Ananya Sharma",
    role: "Lead Designer",
    title: "UI/UX Designer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    links: { globe: "#", linkedin: "#", twitter: "#" },
  },
  {
    name: "Aditya Raj",
    role: "Tech Lead",
    title: "Frontend Developer",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80",
    links: { github: "#", linkedin: "#", twitter: "#" },
  },
  {
    name: "Priyanshu Gupta",
    role: "DevOps",
    title: "DevOps Engineer",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    links: { github: "#", linkedin: "#" },
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function CoreTeamSection() {
  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="text-purple-600 dark:text-purple-400">
          <FiUsers className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-none">Core Team</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">The brain behind AlgoBuddy</p>
        </div>
      </div>

      {/* Grid of Team Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {teamMembers.map((member) => (
          <motion.div
            key={member.name}
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="flex flex-col items-center text-center p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700/60 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Avatar */}
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-slate-50 dark:ring-neutral-700 flex items-center justify-center bg-slate-50 dark:bg-neutral-800">
                <Image
                  src={member.avatar}
                  alt={`${member.name}'s avatar`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Role Badge */}
            <span
              className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                roleBadges[member.role] || "bg-slate-100 text-slate-600"
              }`}
            >
              {member.role}
            </span>

            {/* Name & Title */}
            <h4 className="text-sm font-bold text-slate-850 dark:text-white mt-2 leading-none">
              {member.name}
            </h4>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              {member.title}
            </p>

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-3 mt-4">
              {Object.entries(member.links).map(([platform, url]) => {
                let Icon = FaGithub;
                let hoverColor = "hover:text-slate-900 dark:hover:text-white";

                if (platform === "linkedin") {
                  Icon = FaLinkedin;
                  hoverColor = "hover:text-blue-600";
                } else if (platform === "twitter") {
                  Icon = FaTwitter;
                  hoverColor = "hover:text-sky-500";
                } else if (platform === "globe") {
                  Icon = FaGlobe;
                  hoverColor = "hover:text-pink-500";
                }

                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-slate-400 dark:text-slate-500 transition-colors duration-150 ${hoverColor}`}
                  >
                    <Icon className="w-[14px] h-[14px]" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
