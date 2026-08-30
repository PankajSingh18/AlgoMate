"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

// Dictionary of brand logo SVGs and display names
const COMPANY_DEFS = {
  google: {
    name: "Google",
    bg: "bg-white",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1">
        <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.58 15.02 1 12 1 7.24 1 3.22 3.73 1.25 7.7l3.97 3.08C6.18 7.79 8.85 5.04 12 5.04z" />
        <path fill="#4285F4" d="M23.45 12.3c0-.82-.07-1.6-.21-2.3H12v4.35h6.43c-.28 1.44-1.1 2.66-2.33 3.48l3.6 2.79c2.1-1.94 3.75-4.8 3.75-8.32z" />
        <path fill="#FBBC05" d="M5.22 10.78c-.24-.7-.37-1.46-.37-2.28s.13-1.58.37-2.28L1.25 3.14C.45 4.74 0 6.53 0 8.5s.45 3.76 1.25 5.36l3.97-3.08z" />
        <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.6-2.79c-1.01.68-2.31 1.09-3.96 1.09-3.15 0-5.82-2.75-6.78-5.74L1.25 15.73C3.22 19.7 7.24 23 12 23z" />
      </svg>
    )
  },
  microsoft: {
    name: "Microsoft",
    bg: "bg-white",
    icon: (
      <svg viewBox="0 0 23 23" className="w-full h-full p-1.5">
        <rect x="0" y="0" width="10.5" height="10.5" fill="#F25022" />
        <rect x="11.5" y="0" width="10.5" height="10.5" fill="#7FBA00" />
        <rect x="0" y="11.5" width="10.5" height="10.5" fill="#00A4EF" />
        <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#FFB900" />
      </svg>
    )
  },
  amazon: {
    name: "Amazon",
    bg: "bg-white",
    icon: (
      <svg viewBox="0 0 16 16" className="w-full h-full p-1">
        {/* Official Amazon 'a' letter shape */}
        <path fill="#000000" d="M10.813 11.968c.157.083.36.074.5-.05l.005.005a90 90 0 0 1 1.623-1.405c.173-.143.143-.372.006-.563l-.125-.17c-.345-.465-.673-.906-.673-1.791v-3.3l.001-.335c.008-1.265.014-2.421-.933-3.305C10.404.274 9.06 0 8.03 0 6.017 0 3.77.75 3.296 3.24c-.047.264.143.404.316.443l2.054.22c.19-.009.33-.196.366-.387.176-.857.896-1.271 1.703-1.271.435 0 .929.16 1.188.55.264.39.26.91.257 1.376v.432q-.3.033-.621.065c-1.113.114-2.397.246-3.36.67C3.873 5.91 2.94 7.08 2.94 8.798c0 2.2 1.387 3.298 3.168 3.298 1.506 0 2.328-.354 3.489-1.54l.167.246c.274.405.456.675 1.047 1.166ZM6.03 8.431C6.03 6.627 7.647 6.3 9.177 6.3v.57c.001.776.002 1.434-.396 2.133-.336.595-.87.961-1.465.961-.812 0-1.286-.619-1.286-1.533" />
        {/* Official Amazon Smile arrow line */}
        <path fill="#FF9900" d="M.435 12.174c2.629 1.603 6.698 4.084 13.183.997.28-.116.475.078.199.431C13.538 13.96 11.312 16 7.57 16 3.832 16 .968 13.446.094 12.386c-.24-.275.036-.4.199-.299z" />
        {/* Official Amazon Smile arrowhead dimple */}
        <path fill="#FF9900" d="M13.828 11.943c.567-.07 1.468-.027 1.645.204.135.176-.004.966-.233 1.533-.23.563-.572.961-.762 1.115s-.333.094-.23-.137c.105-.23.684-1.663.455-1.963-.213-.278-1.177-.177-1.625-.13l-.09.009q-.142.013-.233.024c-.193.021-.245.027-.274-.032-.074-.209.779-.556 1.347-.623" />
      </svg>
    )
  },
  meta: {
    name: "Meta",
    bg: "bg-white",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1">
        <path fill="#0081FB" d="M16.5 6c-1.8 0-3.4 1-4.5 2.6C10.9 7 9.3 6 7.5 6 4.5 6 2 8.5 2 11.5S4.5 17 7.5 17c1.8 0 3.4-1 4.5-2.6 1.1 1.6 2.7 2.6 4.5 2.6 3 0 5.5-2.5 5.5-5.5S19.5 6 16.5 6zm0 9c-1.5 0-2.8-.9-3.5-2.2l-.3-.5-.3.5c-.7 1.3-2 2.2-3.5 2.2-2.1 0-3.8-1.7-3.8-3.8s1.7-3.8 3.8-3.8c1.5 0 2.8.9 3.5 2.2l.3.5.3-.5c.7-1.3 2-2.2 3.5-2.2 2.1 0 3.8 1.7 3.8 3.8s-1.7 3.8-3.8 3.8z" />
      </svg>
    )
  },
  apple: {
    name: "Apple",
    bg: "bg-white text-black dark:text-white",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1.5" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.51-.62.73-1.16 1.87-1.01 2.98 1.1.09 2.22-.53 2.94-1.43z" />
      </svg>
    )
  },
  adobe: {
    name: "Adobe",
    bg: "bg-white",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#FF0000">
        <path d="M14.58 2H22v20zM9.42 2H2v20zM12 9.24L17.75 22h-3.32l-2.07-4.9h-4.7l2.06 4.9H6.28z" />
      </svg>
    )
  },
  netflix: {
    name: "Netflix",
    bg: "bg-[#141414]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1.5" fill="#E50914">
        <path d="M5.5 2h4l4.5 13.5V2h4v20h-4L9.5 8.5V22h-4z" />
      </svg>
    )
  },
  uber: {
    name: "Uber",
    bg: "bg-black",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1.5" fill="#FFFFFF">
        <path d="M12 18.5c-3.6 0-6.5-2.9-6.5-6.5V5.5h2.2V12c0 2.4 1.9 4.3 4.3 4.3s4.3-1.9 4.3-4.3V5.5h2.2V12c0 3.6-2.9 6.5-6.5 6.5z" />
      </svg>
    )
  },
  airbnb: {
    name: "Airbnb",
    bg: "bg-white",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#FF5A5F">
        <path d="M12 2C11.5 2 11 2.3 10.7 2.7L2.3 16C1.9 16.6 2 17.5 2.7 17.9C3 18.1 3.3 18.2 3.6 18.2H8.3C8.6 18.2 8.8 18 9 17.7C9.5 16.5 10.7 15.7 12 15.7C13.3 15.7 14.5 16.5 15 17.7C15.2 18 15.4 18.2 15.7 18.2H20.4C21.2 18.2 21.8 17.6 21.8 16.8C21.8 16.5 21.7 16.2 21.6 16L13.3 2.7C13 2.3 12.5 2 12 2ZM12 13.7C10.6 13.7 9.5 12.6 9.5 11.2C9.5 9.8 10.6 8.7 12 8.7C13.4 8.7 14.5 9.8 14.5 11.2C14.5 12.6 13.4 13.7 12 13.7Z" />
      </svg>
    )
  },
  atlassian: {
    name: "Atlassian",
    bg: "bg-white",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#0052CC">
        <path d="M13.8 2.3c-.3-.4-.8-.4-1.1 0l-9.8 9.8c-.4.4-.4.9 0 1.3l2.8 2.8c.4.4.9.4 1.3 0l5.7-5.7 5.7 5.7c.4.4.9.4 1.3 0l2.8-2.8c.4-.4.4-.9 0-1.3l-8.7-9.8z" />
      </svg>
    )
  },
  salesforce: {
    name: "Salesforce",
    bg: "bg-white",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#00A1E0">
        <path d="M19.3 12.1c-.2-.1-.5-.2-.7-.2-.2-1.3-1.3-2.3-2.6-2.3-.6 0-1.1.2-1.5.5C13.8 8.6 12 7.5 10 7.5c-2.3 0-4.2 1.6-4.6 3.8-.4-.2-.9-.3-1.4-.3-1.6 0-2.9 1.3-2.9 2.9s1.3 2.9 2.9 2.9h15.3c1.7 0 3-1.3 3-3s-1.3-2.9-3-2.9v1.2z" />
      </svg>
    )
  },
  flipkart: {
    name: "Flipkart",
    bg: "bg-white",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1">
        <circle cx="12" cy="12" r="11" fill="#2874F0" />
        <path d="M9 7h6a1 1 0 0 1 1 1v8a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1zm3-3a3 3 0 0 1 3 3H9a3 3 0 0 1 3-3z" fill="#FFE11B" />
      </svg>
    )
  },
  meesho: {
    name: "Meesho",
    bg: "bg-[#FF3E6C]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
        <path d="M6 16V8h2.5l2 3.5 2-3.5H15v8h-2.2v-4.5l-1.8 3h-.8l-1.8-3V16H6z" fill="#FFFFFF" />
      </svg>
    )
  },
  phonepe: {
    name: "PhonePe",
    bg: "bg-[#5F259F]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1">
        <text x="12" y="16.5" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">Pe</text>
      </svg>
    )
  },
  razorpay: {
    name: "Razorpay",
    bg: "bg-white",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#0B44CD">
        <path d="M18.5 2h-13c-.8 0-1.5.7-1.5 1.5v17c0 .8.7 1.5 1.5 1.5h6l6-10V3.5c0-.8-.7-1.5-1.5-1.5zm-5 13l-4 4V13h4v2zm2-5h-6V7h6v3z" />
      </svg>
    )
  },
  swiggy: {
    name: "Swiggy",
    bg: "bg-[#FC8019]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1">
        <path d="M12 5.5c-3 0-5 2-5 4 0 .8.3 1.5.8 2.2L12 18.5l4.2-6.8c.5-.7.8-1.4.8-2.2 0-2-2-4-5-4zm0 2.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="#FFFFFF" />
      </svg>
    )
  },
  zomato: {
    name: "Zomato",
    bg: "bg-[#E23744]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1">
        <path d="M12 7.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm0 6.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="#FFFFFF" />
      </svg>
    )
  },
  tcs: {
    name: "TCS",
    bg: "bg-[#00519E]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1">
        <text x="12" y="15.5" fill="#FFFFFF" fontSize="9" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">TCS</text>
      </svg>
    )
  },
  infosys: {
    name: "Infosys",
    bg: "bg-[#007CC3]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1">
        <text x="12" y="16.5" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">I</text>
      </svg>
    )
  },
  wipro: {
    name: "Wipro",
    bg: "bg-white",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1" stroke="#003594" strokeWidth="0.5">
        <text x="12" y="15.5" fill="#003594" fontSize="10" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">W</text>
      </svg>
    )
  },
  accenture: {
    name: "Accenture",
    bg: "bg-[#A100FF]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1">
        <path d="M7 6l7 6-7 6h4l7-6-7-6H7z" fill="#FFFFFF" />
      </svg>
    )
  },
  qualcomm: {
    name: "Qualcomm",
    bg: "bg-[#3253DC]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1">
        <text x="12" y="16.5" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">Q</text>
      </svg>
    )
  },
  nvidia: {
    name: "NVIDIA",
    bg: "bg-[#76B900]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1">
        <path d="M12 6.5C8 6.5 5 9.5 5 12s3 5.5 7 5.5 7-3 7-5.5-3-5.5-7-5.5zm0 8.5c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" fill="#FFFFFF" />
      </svg>
    )
  },
  intel: {
    name: "Intel",
    bg: "bg-[#0068B5]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1">
        <text x="12" y="15.5" fill="#FFFFFF" fontSize="9" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">intel</text>
      </svg>
    )
  },
  amd: {
    name: "AMD",
    bg: "bg-black",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1">
        <path d="M14 6l6 6-6 6h-3.5l6-6-6-6H14z" fill="#ED1C24" />
        <path d="M10 6l6 6-6 6H6.5l6-6-6-6H10z" fill="#FFFFFF" />
      </svg>
    )
  }
};

export default function CompanyLogos({ companies = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!companies || companies.length === 0) {
    return <span className="text-xs text-surface-300 dark:text-neutral-700 font-semibold">-</span>;
  }

  const limit = 3;
  const displayCompanies = companies.slice(0, limit);
  const extraCount = companies.length - limit;

  // Tooltip content listing all companies
  const allNames = companies
    .map((c) => COMPANY_DEFS[c.toLowerCase()]?.name || c)
    .join(", ");

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center -space-x-2 select-none relative group/container cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all"
        title="Click to view all asking companies"
      >
        {displayCompanies.map((cKey, idx) => {
          const item = COMPANY_DEFS[cKey.toLowerCase()];
          if (!item) return null;

          return (
            <div
              key={idx}
              className="group relative"
              style={{ zIndex: limit - idx }}
            >
              {/* Logo Circle */}
              <div
                className={`w-7 h-7 rounded-full border-2 border-white dark:border-[#2d2f31] flex items-center justify-center overflow-hidden shadow-sm transition-all duration-200 hover:scale-125 hover:z-30 ${item.bg}`}
              >
                {item.icon}
              </div>

              {/* Individual Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-[10px] font-extrabold px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                {item.name}
              </div>
            </div>
          );
        })}

        {/* Extra companies count badge */}
        {extraCount > 0 && (
          <div className="group relative" style={{ zIndex: 0 }}>
            <div
              className="w-7 h-7 rounded-full border-2 border-white dark:border-[#2d2f31] bg-neutral-900 dark:bg-neutral-800 text-white flex items-center justify-center text-[10px] font-black shadow-sm transition-all duration-200 hover:scale-125 hover:z-30"
            >
              +{extraCount}
            </div>

            {/* Tooltip listing the remaining companies */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-[10px] font-extrabold px-2.5 py-1 rounded shadow-lg whitespace-nowrap z-50">
              +{extraCount} more companies
            </div>
          </div>
        )}

        {/* Full Container Tooltip (triggers if hovering the container but not specific icons) */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 pointer-events-none opacity-0 group-hover/container:opacity-100 transition-opacity duration-300 bg-neutral-900/90 dark:bg-white/90 text-white dark:text-neutral-950 text-[9px] px-2 py-0.5 rounded shadow whitespace-nowrap z-40 hidden md:block">
          Click to view all
        </div>
      </div>

      {/* Interactive Companies List Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-[#1c1d1f] text-surface-900 dark:text-white rounded-3xl p-6 border border-surface-200 dark:border-neutral-800 shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-surface-100 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="text-[17px] font-black tracking-tight">Asking Companies</h3>
                <p className="text-[11px] text-surface-500 dark:text-surface-400 font-semibold mt-0.5">Frequently asked in interviews at:</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-50 hover:bg-surface-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors text-surface-500 dark:text-neutral-300"
              >
                <X size={16} />
              </button>
            </div>

            {/* Grid of Companies */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {companies.map((cKey, idx) => {
                const item = COMPANY_DEFS[cKey.toLowerCase()];
                if (!item) return null;

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-surface-50/60 dark:bg-neutral-800 border border-surface-100 dark:border-neutral-800/80 shadow-sm hover:scale-[1.03] transition-all duration-200"
                  >
                    <div
                      className={`w-8 h-8 rounded-full border border-surface-200 dark:border-neutral-700 flex items-center justify-center overflow-hidden flex-shrink-0 ${item.bg}`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-xs font-bold text-surface-800 dark:text-neutral-200 truncate">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
