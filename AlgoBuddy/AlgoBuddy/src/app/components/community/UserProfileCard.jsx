"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaGithub, FaLinkedin, FaTwitter, FaDev } from "react-icons/fa6";

export default function UserProfileCard() {
  const displayName = "Pankaj Singh";
  const displayRole = "Founder & Developer @ AlgoBuddy";
  const displayBio = "Passionate about DSA, clean code, and building developer tools.";
  // Curated premium portrait matching Pankaj Singh's profile description
  const avatarSrc = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-2xl bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700/60 shadow-sm overflow-hidden"
    >
      <div className="p-6 flex flex-col items-center">
        {/* Profile Image */}
        <div className="relative mb-4">
          <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-slate-100 dark:ring-neutral-700 flex items-center justify-center bg-slate-100 dark:bg-neutral-800">
            <Image
              src={avatarSrc}
              alt={`${displayName}'s avatar`}
              width={144}
              height={144}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">{displayName}</h3>
          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-1">
            {displayRole}
          </p>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-center mt-3 max-w-[240px]">
          {displayBio}
        </p>

        {/* Stats Grid */}
        <div className="w-full flex justify-between py-4 my-5 text-center">
          <div className="flex-1">
            <div className="text-base font-bold text-slate-850 dark:text-white">42</div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Projects</div>
          </div>
          <div className="w-[1px] bg-slate-100 dark:bg-neutral-700/60"></div>
          <div className="flex-1">
            <div className="text-base font-bold text-slate-850 dark:text-white">12.3K</div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Followers</div>
          </div>
          <div className="w-[1px] bg-slate-100 dark:bg-neutral-700/60"></div>
          <div className="flex-1">
            <div className="text-base font-bold text-slate-850 dark:text-white">98</div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Following</div>
          </div>
        </div>

        {/* Connect Links */}
        <div className="w-full text-left space-y-4 mb-6">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Connect</h4>
          <div className="space-y-3">
            {/* GitHub */}
            <a
              href="https://github.com/PankajSingh34"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 group"
            >
              <FaGithub className="w-5 h-5 text-slate-850 dark:text-slate-200 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">GitHub</div>
                <div className="text-[11px] text-purple-600 dark:text-purple-400 group-hover:underline leading-tight mt-0.5">
                  github.com/pankajsingh
                </div>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/pankaj-singh-2a968b212"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 group"
            >
              <FaLinkedin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">LinkedIn</div>
                <div className="text-[11px] text-purple-600 dark:text-purple-400 group-hover:underline leading-tight mt-0.5">
                  linkedin.com/in/pankaj-singh
                </div>
              </div>
            </a>

            {/* Twitter */}
            <a
              href="https://twitter.com/pankajcodes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 group"
            >
              <FaTwitter className="w-5 h-5 text-sky-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">Twitter</div>
                <div className="text-[11px] text-purple-600 dark:text-purple-400 group-hover:underline leading-tight mt-0.5">
                  twitter.com/pankajcodes
                </div>
              </div>
            </a>

            {/* Dev.to */}
            <a
              href="https://dev.to/pankajsingh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 group"
            >
              <FaDev className="w-5 h-5 text-slate-800 dark:text-slate-200 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">Dev.to</div>
                <div className="text-[11px] text-purple-600 dark:text-purple-400 group-hover:underline leading-tight mt-0.5">
                  dev.to/pankajsingh
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* View Full Profile Button */}
        <button 
        onClick={() =>
          window.open(
            "https://github.com/PankajSingh34",
            "_blank"
          )
        }className="w-full py-2.5 px-4 rounded-xl border border-purple-250 dark:border-purple-900/30 text-purple-600 dark:text-purple-400 font-semibold text-sm hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-200"
        >
          View Full Profile
        </button>
      </div>
    </motion.div>
  );
}
