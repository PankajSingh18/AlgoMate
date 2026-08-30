"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
    hasAnalyticsConsent,
    hasMarketingConsent,
    CONSENT_UPDATED_EVENT,
} from "@/lib/cookieConsent";

export default function AnalyticsScripts({ gaId, adsenseClientId }) {
    const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
    const [marketingAllowed, setMarketingAllowed] = useState(false);
    const safeGaId =
    typeof gaId === "string" && /^G-[A-Z0-9]+$/i.test(gaId) ? gaId : "";

    useEffect(() => {
    const syncConsent = () => {
        setAnalyticsAllowed(hasAnalyticsConsent());
        setMarketingAllowed(hasMarketingConsent());
    };
        syncConsent();
        window.addEventListener(CONSENT_UPDATED_EVENT, syncConsent);
        window.addEventListener("storage", syncConsent);
        return () => {
        window.removeEventListener(CONSENT_UPDATED_EVENT, syncConsent);
        window.removeEventListener("storage", syncConsent);
    };
    }, []);

    return (
    <>
        {marketingAllowed && adsenseClientId && (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
        )}
        {analyticsAllowed && safeGaId && (
        <>
            <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(safeGaId)}`}
            strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', ${JSON.stringify(safeGaId)}, {
                page_path: window.location.pathname,
                });
                `}
            </Script>
        </>
        )}
    </>
    );
}
