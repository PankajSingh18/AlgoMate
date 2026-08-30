// app/api/auth/login/route.js

import { withRateLimit } from '../../../../lib/rate-limit/route-wrapper.js';

export const POST = withRateLimit(async (request) => {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return Response.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }
    
    // Your login logic
    const user = await authenticateUser(email, password);
    
    if (!user) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    return Response.json({
      success: true,
      user,
      token: generateToken(user)
    });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}, 'auth'); // Stricter limit for auth routes