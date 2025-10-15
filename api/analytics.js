/**
 * ANALYTICS API ENDPOINT
 * Simple endpoint to receive analytics data
 * Place this in your backend or use a service like Vercel/Netlify
 */

// For Vercel/Netlify Functions
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const analyticsData = req.body;
    
    // Log the data (replace with your preferred storage)
    console.log('Analytics data received:', {
      sessionId: analyticsData.sessionId,
      userId: analyticsData.userId,
      events: analyticsData.events.length,
      pageViews: analyticsData.pageViews,
      interactions: analyticsData.interactions
    });
    
    // Store in your database (example with JSON file)
    const fs = require('fs');
    const path = require('path');
    
    const dataFile = path.join(process.cwd(), 'analytics-data.json');
    let existingData = [];
    
    try {
      existingData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch (error) {
      // File doesn't exist yet
    }
    
    existingData.push(analyticsData);
    
    // Keep only last 1000 entries to prevent file from growing too large
    if (existingData.length > 1000) {
      existingData = existingData.slice(-1000);
    }
    
    fs.writeFileSync(dataFile, JSON.stringify(existingData, null, 2));
    
    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// For Node.js/Express
/*
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

app.post('/api/analytics', (req, res) => {
  try {
    const analyticsData = req.body;
    
    console.log('Analytics data received:', {
      sessionId: analyticsData.sessionId,
      userId: analyticsData.userId,
      events: analyticsData.events.length,
      pageViews: analyticsData.pageViews,
      interactions: analyticsData.interactions
    });
    
    // Store in JSON file
    const dataFile = path.join(__dirname, 'analytics-data.json');
    let existingData = [];
    
    try {
      existingData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch (error) {
      // File doesn't exist yet
    }
    
    existingData.push(analyticsData);
    
    // Keep only last 1000 entries
    if (existingData.length > 1000) {
      existingData = existingData.slice(-1000);
    }
    
    fs.writeFileSync(dataFile, JSON.stringify(existingData, null, 2));
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Analytics server running on port 3000');
});
*/
