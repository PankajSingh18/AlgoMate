"use client";
import { useEffect, useCallback, useRef, useState } from "react";
import FocusTrap from "@/app/components/ui/FocusTrap";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeLabel = "Close",
  showCloseButton = true,
}) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const closeBtnRef = useRef(null);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-5xl",
    full: "max-w-7xl",
  };

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    setIsVisible(false);
    const timeout = setTimeout(() => setShouldRender(false), 220);
    return () => clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  if (!shouldRender) return null;

  return (
    <FocusTrap active={isOpen} onEscape={handleClose}>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4">
        <div
          className={`fixed inset-0 bg-black/60 transition-opacity duration-200 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleClose}
          aria-hidden="true"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          className={`relative flex max-h-[92vh] w-full ${sizeClasses[size] || sizeClasses.md} flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white text-neutral-900 shadow-xl transition-all duration-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 ${
            isVisible
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-2 opacity-0 scale-[0.99]"
          }`}
        >
          {title && (
            <div className="flex-none border-b border-neutral-200 px-5 py-4 dark:border-neutral-700">
              <div className="flex items-center justify-between gap-4">
                <h2
                  id="modal-title"
                  className="text-lg font-semibold tracking-tight"
                >
                  {title}
                </h2>
                {showCloseButton && (
                  <button
                    ref={closeBtnRef}
                    onClick={handleClose}
                    className="rounded-md border border-neutral-300 p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    aria-label={closeLabel}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            {children}
          </div>
          {footer && (
            <div className="flex-none border-t border-neutral-200 bg-neutral-50/80 px-5 py-3 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/80">
              {footer}
            </div>
          )}
        </div>
      </div>
    </FocusTrap>
  );
}
