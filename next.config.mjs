/** @type {import('next').NextConfig} */

// ============================================
// 1. SECURITY HEADERS CONFIGURATION
// ============================================

// Helper function to generate CSP with nonce placeholder
const generateCSP = (withNonce = true) => {
  const baseCSP = [
    // Default Policy
    "default-src 'self'",
    
    // Script Sources
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.googlesyndication.com https://*.google.com https://challenges.cloudflare.com https://va.vercel-scripts.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com https://apis.google.com https://accounts.google.com https://*.supabase.co",
    
    // Web Workers
    "worker-src 'self' blob:",
    
    // Style Sources
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
    
    // Font Sources
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:",
    
    // Image Sources
    "img-src 'self' data: blob: https: https://*.googlesyndication.com https://*.googleusercontent.com https://*.githubusercontent.com https://*.supabase.co https://lh3.googleusercontent.com https://img.icons8.com https://*.gravatar.com https://api.dicebear.com https://images.unsplash.com",
    
    // Connection Sources
    "connect-src 'self' http://localhost:8080 ws://localhost:4000 http://localhost:4000 ws://127.0.0.1:4000 http://127.0.0.1:4000 https://algobuddy-backend-7iwv.onrender.com https://algobuddy-backend.onrender.com https://algobuddy-socket-server.onrender.com wss://algobuddy-socket-server.onrender.com https://*.supabase.co wss://*.supabase.co https://*.googlesyndication.com https://*.google.com https://*.google-analytics.com https://*.googletagmanager.com https://*.tagassistant.google.com https://*.cloudflare.com https://api.gemini.com https://*.algobuddy.me wss://*.algobuddy.me https://va.vercel-scripts.com",
    
    // Frame Sources
    "frame-src 'self' https://challenges.cloudflare.com https://*.googleads.g.doubleclick.net https://*.google.com https://*.supabase.co https://accounts.google.com https://www.youtube.com https://player.vimeo.com",
    
    // Security Directives
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "block-all-mixed-content",
    "upgrade-insecure-requests",
    
    // CSP Reporting
    "report-uri /api/csp-report",
    "report-to csp-endpoint",
  ];

  // If nonce is required, add it to script-src and style-src
  if (withNonce) {
    // Add nonce to script-src
    const scriptIndex = baseCSP.findIndex(directive => directive.startsWith("script-src"));
    if (scriptIndex !== -1) {
      baseCSP[scriptIndex] = baseCSP[scriptIndex].replace(
        "script-src",
        `script-src 'nonce-{NONCE}' 'strict-dynamic'`
      );
    }

    // Add nonce to style-src
    const styleIndex = baseCSP.findIndex(directive => directive.startsWith("style-src"));
    if (styleIndex !== -1) {
      baseCSP[styleIndex] = baseCSP[styleIndex].replace(
        "style-src",
        `style-src 'nonce-{NONCE}'`
      );
    }
  }

  return baseCSP.join("; ");
};

const securityHeaders = [
  // Prevent browsers from rendering the page inside a frame or iframe
  { key: "X-Frame-Options", value: "DENY" },

  // Stop browsers from MIME-sniffing responses
  { key: "X-Content-Type-Options", value: "nosniff" },

  // Referrer Policy
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  // Enforce HTTPS
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },

  // Disable unused hardware APIs
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },

  // CSP with nonce placeholder
  {
    key: "Content-Security-Policy",
    value: generateCSP(true), // true = include nonce placeholder
  },

  // Report-To header for CSP reporting
  {
    key: "Report-To",
    value: JSON.stringify({
      group: "csp-endpoint",
      max_age: 10886400,
      endpoints: [{ url: "/api/csp-report" }],
    }),
  },
];

// ============================================
// 2. NEXT.JS CONFIGURATION
// ============================================

const nextConfig = {
  // Server external packages
  serverExternalPackages: ["isolated-vm"],
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" 
      ? { exclude: ["error", "warn"] } 
      : false,
  },
  
  // Disable dev indicators
  devIndicators: false,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.producthunt.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/visualizer/graph/traversal/bfs',
        destination: '/visualizer/graph/bfs',
        permanent: true,
      },
      {
        source: '/visualizer/graph/traversal/dfs',
        destination: '/visualizer/graph/dfs',
        permanent: true,
      },
      {
        source: '/visualizer/graph/algorithms/dijkstra',
        destination: '/visualizer/graph/dijkstra',
        permanent: true,
      },
      {
        source: '/visualizer/graph/algorithms/prim',
        destination: '/visualizer/graph/prim',
        permanent: true,
      },
      {
        source: '/visualizer/graph/algorithms/kruskal',
        destination: '/visualizer/graph/kruskal',
        permanent: true,
      },
      {
        source: '/visualizer/graph/algorithms/topological-sort',
        destination: '/visualizer/graph/topological-sort',
        permanent: true,
      },
      {
        source: '/visualizer/graph/representation/adjacency-list',
        destination: '/visualizer/graph/adjacency-list',
        permanent: true,
      },
      {
        source: '/visualizer/graph/representation/adjacency-matrix',
        destination: '/visualizer/graph/adjacency-matrix',
        permanent: true,
      },
      // New redirects for security
      {
        source: '/csp-test',
        destination: '/csp-test',
        permanent: false,
      },
    ];
  },

  // Headers configuration
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/api/csp-report",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
  
  // Webpack configuration for CSP
  webpack: (config, { isServer }) => {
    // Handle crypto for nonce generation
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
        buffer: false,
      };
    }
    
    // Add CSP nonce to scripts in production
    if (!isServer && process.env.NODE_ENV === 'production') {
      config.output = {
        ...config.output,
        crossOriginLoading: 'anonymous',
      };
    }
    
    return config;
  },
  
  // Experimental features
  experimental: {
    optimizeCss: true,
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Production source maps (disable in production for security)
  productionBrowserSourceMaps: false,

  // Powered by header removal
  poweredByHeader: false,

  // Environment variables available to client
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.NODE_ENV,
  },
};

export default nextConfig;