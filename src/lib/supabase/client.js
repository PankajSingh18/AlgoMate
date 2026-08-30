// lib/supabase/client.js

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Add CSP-compliant fetch options
const fetchOptions = {
  headers: {
    'Content-Security-Policy': "default-src 'self'",
  },
};

export const createClient = () => {
  return createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    options: {
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          ...fetchOptions,
        });
      },
    },
  });
};