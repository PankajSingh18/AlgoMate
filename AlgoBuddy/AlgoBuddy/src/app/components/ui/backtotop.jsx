"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      setVisible(window.scrollY > 300);
    };

    check();
    window.addEventListener("scroll", check);
    return () => window.removeEventListener("scroll", check);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          style={{ position: 'fixed', bottom: '152px', right: '20px' }}
          className="z-[9990] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#a435f0] text-white shadow-lg flex items-center justify-center hover:bg-[#8f2cd6] group"
        >
          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap">
            Back to top
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;