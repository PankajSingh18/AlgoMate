import React, { useState, useEffect } from "react";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    functional: false,
    marketing: false,
  });

  // Check if user has already given consent
  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (type) => {
    localStorage.setItem("cookieConsent", type);
    setShowBanner(false);
    setShowPreferences(false);

    // You can add actual cookie setting logic here
    console.log(`Cookies ${type} - Preferences:`, preferences);
  };

  const handleAcceptAll = () => {
    setPreferences({
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
    });
    saveConsent("accepted");
  };

  const handleRejectNonEssential = () => {
    setPreferences({
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    });
    saveConsent("rejected");
  };

  const handleSavePreferences = () => {
    saveConsent("preferences_saved");
  };

  const togglePreference = (key) => {
    if (key === "essential") return; // Essential cookies cannot be disabled
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const closeBanner = () => {
    // Dismiss without saving (treat as reject)
    localStorage.setItem("cookieConsent", "dismissed");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Main Cookie Banner */}
      <div className="cookie-banner">
        <div className="cookie-content">
          <button
            className="close-btn"
            onClick={closeBanner}
            aria-label="Close"
          >
            ×
          </button>

          <div className="cookie-text">
            <h3>We use cookies</h3>
            <p>
              This website uses cookies to enhance your experience, analyze
              traffic, and serve personalized content. By clicking "Accept All",
              you consent to our use of cookies. Read our{" "}
              <a
                href="/cookie-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cookie Policy
              </a>
              .
            </p>
          </div>

          <div className="cookie-buttons">
            <button
              className="btn btn-secondary"
              onClick={handleRejectNonEssential}
            >
              Reject Non-Essential
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setShowPreferences(true)}
            >
              Manage Preferences
            </button>
            <button className="btn btn-primary" onClick={handleAcceptAll}>
              Accept All
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Cookie Preferences</h2>
              <button
                className="close-btn"
                onClick={() => setShowPreferences(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="preference-item">
                <div>
                  <strong>Essential Cookies</strong>
                  <p>
                    These cookies are necessary for the website to function
                    properly.
                  </p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked disabled />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div>
                  <strong>Analytics Cookies</strong>
                  <p>
                    Help us understand how visitors interact with the website.
                  </p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={() => togglePreference("analytics")}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div>
                  <strong>Functional Cookies</strong>
                  <p>Enable enhanced functionality and personalization.</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={() => togglePreference("functional")}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div>
                  <strong>Marketing Cookies</strong>
                  <p>
                    Used to deliver relevant advertisements and track
                    effectiveness.
                  </p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={() => togglePreference("marketing")}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={handleRejectNonEssential}
              >
                Reject All
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSavePreferences}
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .cookie-banner {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #1f2937;
          color: white;
          max-width: 520px;
          width: 90%;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          z-index: 10000;
          padding: 20px;
          font-family:
            system-ui,
            -apple-system,
            sans-serif;
        }

        .cookie-content {
          position: relative;
        }

        .close-btn {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #374151;
          color: white;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .cookie-text h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
        }

        .cookie-text p {
          margin: 0 0 20px 0;
          line-height: 1.5;
          font-size: 14px;
          color: #d1d5db;
        }

        .cookie-text a {
          color: #60a5fa;
          text-decoration: underline;
        }

        .cookie-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        .btn {
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          font-size: 14px;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .btn-secondary {
          background: #4b5563;
          color: white;
        }

        .btn-secondary:hover {
          background: #374151;
        }

        .btn-outline {
          background: transparent;
          border: 2px solid #6b7280;
          color: white;
        }

        .btn-outline:hover {
          border-color: #9ca3af;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10001;
        }

        .modal {
          background: white;
          color: #1f2937;
          max-width: 480px;
          width: 90%;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-body {
          padding: 20px 24px;
        }

        .preference-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .preference-item:last-child {
          border-bottom: none;
        }

        .modal-footer {
          padding: 20px 24px;
          background: #f9fafb;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          border-top: 1px solid #e5e7eb;
        }

        /* Toggle Switch */
        .toggle {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 26px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 26px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #3b82f6;
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }

        @media (max-width: 480px) {
          .cookie-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
};

export default CookieConsent;
