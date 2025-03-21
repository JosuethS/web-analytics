import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

// Set up Express server
const app = express();
const port = 3000;

// Parse JSON request bodies
app.use(bodyParser.json());

// Sample webData object from client-side (just for the example)
const webData = {
  visitors: [],
  totalViews: 0,
  newVisitors: 0,
  sessionDuration: 0,
  deviceType: {
    desktop: 0,
    mobile: 0,
    ios: 0,
    android: 0,
    tablet: 0
  },
  referrers: {
    facebook: 0,
    youtube: 0,
    instagram: 0,
    google: 0,
    direct: 0
  }
};

// Route to receive analytics data
app.post('/sendAnalytics', async(req, res) => {
  try {
    const data = req.body; // Data sent from client
    console.log('Received Analytics Data:', data);

    // Update the webData object with incoming data
    webData.totalViews += data.totalViews;
    webData.newVisitors += data.newVisitors;
    webData.sessionDuration += data.sessionDuration;

    const analyticsUpdate = await prisma.clients.update({
      where: {
        id: `67d87870bb629dbbf656a649`,
      },
      data: {
        analytics: {
          device_type: 
          { 
            android: 0, 
            desktop: 0, 
            ios: 0, 
            mobile: 0, 
            tablet: 0 
          },
          new_visitors: data.newVisitors,
          referal_source: 
          { 
            direct: 0, 
            facebook: 0, 
            google: 0, 
            instagram: 0, 
            youtube: 0 
          },
          session_duration: data.sessionDuration,
          total_visitors: data.totalViews
        }
      },
    })

    // Respond with success
    res.status(200).json({ success: true, message: 'Data received and stored.' });
  } catch (error) {
    console.error('Error receiving analytics data:', error);
    res.status(500).json({ success: false, message: 'Error saving analytics data.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
