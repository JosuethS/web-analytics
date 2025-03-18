// File: /app/scripts/analytics.js

// Web data object to store analytics
export const webData = {
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

// Function to detect device type
function detectDeviceType() {
  const userAgent = navigator.userAgent;

  if (/Mobi|Android/i.test(userAgent)) {
    if (/iPad/i.test(userAgent)) {
      return 'tablet';
    } else if (/iPhone|iPod/i.test(userAgent)) {
      return 'ios';
    } else if (/Android/i.test(userAgent)) {
      return 'android';
    } else {
      return 'mobile';
    }
  } else {
    return 'desktop';
  }
}

// Function to detect referrer
function detectReferrer() {
  // Ensure this only runs on the client-side
  if (typeof document !== 'undefined') {
    const referrer = document.referrer.toLowerCase();

    if (referrer.includes("facebook.com")) {
      return "facebook";
    } else if (referrer.includes("youtube.com")) {
      return "youtube";
    } else if (referrer.includes("instagram.com")) {
      return "instagram";
    } else if (referrer.includes("google.com")) { 
      return "google";
    } else if (referrer === "") {
      return "direct"; 
    } else {
      return "direct";
    }
  }
  return "direct"; 
}

// Function to track total visitors
function trackTotalVisitors() {
  const visitorId = crypto.randomUUID(); 
  const visitorData = {
    visitorId,
    timestamp: Date.now(), 
    deviceType: detectDeviceType(), 
    referrer: detectReferrer() 
  };

  webData.visitors.push(visitorData);
  webData.totalViews += 1; 

  // Increment device type counter
  if (visitorData.deviceType === 'desktop') {
    webData.deviceType.desktop += 1;
  } else if (visitorData.deviceType === 'mobile') {
    webData.deviceType.mobile += 1;
  } else if (visitorData.deviceType === 'ios') {
    webData.deviceType.ios += 1;
  } else if (visitorData.deviceType === 'android') {
    webData.deviceType.android += 1;
  } else if (visitorData.deviceType === 'tablet') {
    webData.deviceType.tablet += 1;
  }

  // Increment referrer counter
  if (visitorData.referrer === 'facebook') {
    webData.referrers.facebook += 1;
  } else if (visitorData.referrer === 'youtube') {
    webData.referrers.youtube += 1;
  } else if (visitorData.referrer === 'instagram') {
    webData.referrers.instagram += 1;
  } else if (visitorData.referrer === 'google') { 
    webData.referrers.google += 1;
  } else {
    webData.referrers.direct += 1;
  }

  // Check if localStorage is available and track new visitors
  if (typeof window !== 'undefined' && window.localStorage) {
    if (!localStorage.getItem("visitedBefore")) {
      localStorage.setItem("visitedBefore", "true");
      webData.newVisitors += 1;
    }
  }
}

// Track session duration
function trackSessionDuration() {
  const sessionStart = Date.now();
  const elapsedTime = Date.now() - sessionStart;
  webData.sessionDuration = Math.floor(elapsedTime / 60000); // Convert milliseconds to minutes
}


// Track the visitor data and session duration
function initializeTracking() {
  trackTotalVisitors();
  trackSessionDuration();
}

// Call this function when you want to send the data
initializeTracking();

async function sendAnalyticsDataWithRetry(retries = 3, delay = 1000) {
  try {
    const response = await fetch('http://localhost:3000/sendAnalytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webData), // Send the webData object as a JSON string
    });

    const result = await response.json(); // Parse the JSON response from the server

    if (response.ok) {
      console.log('Analytics data sent successfully:', result);
    } else {
      console.error('Failed to send analytics data:', result);
    }
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... ${retries} attempts left.`);
      setTimeout(() => sendAnalyticsDataWithRetry(retries - 1), delay); // Retry after delay
    } else {
      console.error('Error sending analytics data after retries:', error);
    }
  }
}

// Start sending data with retry mechanism
sendAnalyticsDataWithRetry();



