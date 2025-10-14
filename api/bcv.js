// Cloudflare Pages Function to proxy BCV API
export async function onRequest(context) {
  try {
    // Fetch from your SiteGround API
    const response = await fetch('https://bcv-api.vanalva.com/', {
      method: 'GET',
      headers: {
        'User-Agent': 'Cloudflare-Pages-Function'
      }
    });

    // Return with CORS headers
    return new Response(response.body, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'API fetch failed' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  }
}
