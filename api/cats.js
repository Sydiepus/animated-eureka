// api/cats.js - Vercel Serverless Function
// This function acts as a secure proxy to the API-Ninjas Cat API
// It keeps the API key hidden from the client

export default async function handler(request, response) {
  // Read API key from environment variable (set in Vercel dashboard or .env.local)
  const apiKey = process.env.NINJA_KEY;

  if (!apiKey) {
    return response.status(500).json({
      error: 'API key not configured in server environment'
    });
  }

  try {
    // Build the URL with query parameters from the request
    const url = new URL('https://api.api-ninjas.com/v1/cats');

    // Forward all query parameters to the external API
    // This allows the frontend to use the same parameters (offset, min_weight, etc.)
    for (const [key, value] of Object.entries(request.query)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    }

    // Add default parameter if no others are present (API requires at least one)
    if (url.searchParams.toString() === '') {
      url.searchParams.append('min_weight', '1');
    }

    const apiResponse = await fetch(url.toString(), {
      headers: {
        'X-Api-Key': apiKey
      }
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      const status = apiResponse.status;
      const errorMessage = errorData.message || errorData.error || `API request failed: ${status}`;
      
      console.error('API-Ninjas error:', errorMessage);
      
      return response.status(status).json({
        error: errorMessage
      });
    }

    const data = await apiResponse.json();
    
    // Set CORS headers for browser requests
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return response.status(200).json(data);

  } catch (error) {
    console.error('Serverless function error:', error);
    return response.status(500).json({
      error: error.message || 'Failed to fetch cats from API'
    });
  }
}
