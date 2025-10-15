// Simple Analytics API for Cloudflare Pages
// Alternative approach using GitHub as data storage

export async function onRequestPost(context) {
  const { request } = context;
  
  try {
    const data = await request.json();
    
    // For now, we'll just return success
    // In production, you'd want to store this data somewhere
    console.log('Analytics data received:', data.length, 'events');
    
    return new Response(JSON.stringify({ 
      message: 'Analytics data received.',
      count: data.length,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
    
  } catch (error) {
    console.error('Error processing analytics data:', error);
    return new Response(JSON.stringify({ 
      message: 'Error processing analytics data.', 
      error: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestGet(context) {
  // Return empty array for now
  // In production, you'd fetch from your data storage
  return new Response(JSON.stringify([]), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function onRequestOptions(context) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
