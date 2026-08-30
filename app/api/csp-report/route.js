// app/api/csp-report/route.js

export async function POST(request) {
  try {
    const report = await request.json();
    
    // Log the CSP violation
    console.error('CSP Violation Report:', {
      documentUri: report['csp-report']?.['document-uri'] || 'N/A',
      violatedDirective: report['csp-report']?.['violated-directive'] || 'N/A',
      blockedUri: report['csp-report']?.['blocked-uri'] || 'N/A',
      scriptSample: report['csp-report']?.['script-sample'] || 'N/A',
      timestamp: new Date().toISOString()
    });

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to Sentry, Datadog, etc.
      // await sendToMonitoring(report);
    }

    return new Response(null, {
      status: 204,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error processing CSP report:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Also handle GET for testing
export async function GET() {
  return new Response(
    JSON.stringify({ 
      status: 'CSP report endpoint is working',
      message: 'Send POST requests with CSP violation reports'
    }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}