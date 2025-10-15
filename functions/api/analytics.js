// Cloudflare Pages Function for Analytics API
// This file should be placed in: /functions/api/analytics.js

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // Get the request body
    const data = await request.json();
    
    // For Cloudflare Pages, we'll store data in KV storage
    // If you don't have KV, we can use a different approach
    
    // Get existing data
    let analyticsData = [];
    try {
      const existingData = await env.ANALYTICS_KV.get('analytics_data');
      if (existingData) {
        analyticsData = JSON.parse(existingData);
      }
    } catch (e) {
      console.log('No existing analytics data found');
    }
    
    // Add new data
    analyticsData.push(...data);
    
    // Store back to KV
    await env.ANALYTICS_KV.put('analytics_data', JSON.stringify(analyticsData));
    
    return new Response(JSON.stringify({ 
      message: 'Analytics data received and stored.',
      count: data.length 
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
  const { env } = context;
  
  try {
    // Get analytics data from KV
    const analyticsData = await env.ANALYTICS_KV.get('analytics_data');
    
    if (!analyticsData) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    return new Response(analyticsData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return new Response(JSON.stringify({ 
      message: 'Error fetching analytics data.', 
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
