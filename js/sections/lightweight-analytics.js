/**
 * LIGHTWEIGHT ANALYTICS REPLACEMENT
 * Replaces Intellimize with fast, privacy-friendly analytics
 */

(function() {
  'use strict';
  
  // Configuration
  const CONFIG = {
    ENABLED: true,
    ENDPOINT: 'https://n58.pages.dev/api/analytics', // Your own endpoint
    BATCH_SIZE: 10,
    FLUSH_INTERVAL: 30000, // 30 seconds
    SESSION_TIMEOUT: 1800000, // 30 minutes
    LOG_ACTIVITY: true
  };
  
  // Analytics data storage
  let analyticsData = {
    sessionId: generateSessionId(),
    userId: getUserId(),
    events: [],
    pageViews: 0,
    interactions: 0,
    startTime: Date.now()
  };
  
  // Generate unique session ID
  function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Get or create user ID
  function getUserId() {
    let userId = localStorage.getItem('n58_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('n58_user_id', userId);
    }
    return userId;
  }
  
  // Track page view
  function trackPageView() {
    const pageData = {
      type: 'pageview',
      url: window.location.href,
      title: document.title,
      timestamp: Date.now(),
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenSize: {
        width: window.screen.width,
        height: window.screen.height
      },
      viewportSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      deviceType: getDeviceType()
    };
    
    analyticsData.events.push(pageData);
    analyticsData.pageViews++;
    
    if (CONFIG.LOG_ACTIVITY) {
      console.log('📊 Page view tracked:', pageData.url);
    }
  }
  
  // Track user interactions
  function trackInteraction(element, eventType, data = {}) {
    const interactionData = {
      type: 'interaction',
      eventType: eventType,
      element: {
        tagName: element.tagName,
        id: element.id,
        className: element.className,
        text: element.textContent?.substring(0, 100) || '',
        href: element.href || '',
        src: element.src || ''
      },
      position: {
        x: data.x || 0,
        y: data.y || 0
      },
      timestamp: Date.now(),
      pageUrl: window.location.href
    };
    
    analyticsData.events.push(interactionData);
    analyticsData.interactions++;
    
    if (CONFIG.LOG_ACTIVITY) {
      console.log('📊 Interaction tracked:', eventType, interactionData.element);
    }
  }
  
  // Track button clicks
  function trackButtonClicks() {
    document.addEventListener('click', (event) => {
      const element = event.target;
      
      // Track button clicks
      if (element.tagName === 'BUTTON' || 
          element.classList.contains('button') ||
          element.classList.contains('notch-button') ||
          element.classList.contains('w-button')) {
        
        trackInteraction(element, 'click', {
          x: event.clientX,
          y: event.clientY
        });
      }
      
      // Track link clicks
      if (element.tagName === 'A') {
        trackInteraction(element, 'link_click', {
          x: event.clientX,
          y: event.clientY
        });
      }
    });
  }
  
  // Track form interactions
  function trackFormInteractions() {
    document.addEventListener('submit', (event) => {
      const form = event.target;
      trackInteraction(form, 'form_submit');
    });
    
    document.addEventListener('focus', (event) => {
      const element = event.target;
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        trackInteraction(element, 'form_focus');
      }
    });
  }
  
  // Track scroll behavior
  function trackScrollBehavior() {
    let scrollTimeout;
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        const scrollPercentage = Math.round((currentScrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercentage % 25 === 0) { // Track at 25%, 50%, 75%, 100%
          trackInteraction(document.body, 'scroll', {
            percentage: scrollPercentage,
            direction: scrollDirection
          });
        }
        
        lastScrollY = currentScrollY;
      }, 150);
    });
  }
  
  // Track time on page
  function trackTimeOnPage() {
    let startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - startTime;
      trackInteraction(document.body, 'time_on_page', {
        duration: timeOnPage
      });
      
      // Send data immediately before page unload
      sendAnalyticsData(true);
    });
  }
  
  // Track Spline interactions
  function trackSplineInteractions() {
    const splineContainers = document.querySelectorAll('[data-spline]');
    splineContainers.forEach(container => {
      container.addEventListener('click', (event) => {
        trackInteraction(container, 'spline_interaction', {
          x: event.clientX,
          y: event.clientY
        });
      });
    });
  }
  
  // Track Lottie interactions
  function trackLottieInteractions() {
    const lottieContainers = document.querySelectorAll('[data-lottie]');
    lottieContainers.forEach(container => {
      container.addEventListener('click', (event) => {
        trackInteraction(container, 'lottie_interaction', {
          x: event.clientX,
          y: event.clientY
        });
      });
    });
  }
  
  // Get device type
  function getDeviceType() {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }
  
  // Send analytics data
  function sendAnalyticsData(immediate = false) {
    if (analyticsData.events.length === 0) return;
    
    const dataToSend = {
      ...analyticsData,
      events: [...analyticsData.events]
    };
    
    // Clear events after sending
    analyticsData.events = [];
    
    if (CONFIG.LOG_ACTIVITY) {
      console.log('📊 Sending analytics data:', dataToSend.events.length, 'events');
    }
    
    // Send via fetch (non-blocking)
    fetch(CONFIG.ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend)
    }).catch(error => {
      if (CONFIG.LOG_ACTIVITY) {
        console.log('📊 Analytics send failed:', error);
      }
    });
  }
  
  // Initialize analytics
  function initAnalytics() {
    if (!CONFIG.ENABLED) return;
    
    console.log('📊 Lightweight Analytics initialized');
    
    // Track initial page view
    trackPageView();
    
    // Set up event tracking
    trackButtonClicks();
    trackFormInteractions();
    trackScrollBehavior();
    trackTimeOnPage();
    trackSplineInteractions();
    trackLottieInteractions();
    
    // Send data periodically
    setInterval(() => {
      if (analyticsData.events.length >= CONFIG.BATCH_SIZE) {
        sendAnalyticsData();
      }
    }, CONFIG.FLUSH_INTERVAL);
    
    // Send data on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        sendAnalyticsData();
      }
    });
  }
  
  // Public API (replaces Intellimize functions)
  window.n58Analytics = {
    track: (eventName, data) => {
      trackInteraction(document.body, eventName, data);
    },
    identify: (userId) => {
      analyticsData.userId = userId;
      localStorage.setItem('n58_user_id', userId);
    },
    page: (pageName) => {
      trackPageView();
    },
    experiment: (experimentName) => {
      // Simple A/B testing without performance impact
      const hash = hashString(analyticsData.userId + experimentName);
      return hash % 2 === 0 ? 'A' : 'B';
    },
    variation: (experimentName) => {
      return window.n58Analytics.experiment(experimentName);
    }
  };
  
  // Simple hash function for A/B testing
  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
  
  // Start analytics
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
  } else {
    initAnalytics();
  }
  
})();
