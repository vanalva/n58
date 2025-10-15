/**
 * SAFE INTELLIMIZE BLOCKER
 * Blocks Intellimize only if it's causing performance issues
 */

(function() {
  'use strict';
  
  // Configuration - Easy to modify
  const CONFIG = {
    ENABLED: true,                    // Set to false to disable completely
    BLOCK_ON_MOBILE: true,            // Only block on mobile devices
    BLOCK_ON_SLOW_CONNECTION: true,   // Block on slow connections
    PERFORMANCE_THRESHOLD: 2000,      // Block if page load > 2 seconds
    LOG_ACTIVITY: true                // Log what's being blocked
  };
  
  // Check if we should block Intellimize
  const shouldBlockIntellimize = () => {
    if (!CONFIG.ENABLED) return false;
    
    // Block on mobile
    if (CONFIG.BLOCK_ON_MOBILE && window.innerWidth <= 768) {
      if (CONFIG.LOG_ACTIVITY) console.log('🚫 Blocking Intellimize on mobile');
      return true;
    }
    
    // Block on slow connections
    if (CONFIG.BLOCK_ON_SLOW_CONNECTION && navigator.connection) {
      const connection = navigator.connection;
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        if (CONFIG.LOG_ACTIVITY) console.log('🚫 Blocking Intellimize on slow connection');
        return true;
      }
    }
    
    // Block if performance is poor
    if (performance.timing) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      if (loadTime > CONFIG.PERFORMANCE_THRESHOLD) {
        if (CONFIG.LOG_ACTIVITY) console.log('🚫 Blocking Intellimize due to slow performance:', loadTime + 'ms');
        return true;
      }
    }
    
    return false;
  };
  
  // Lightweight blocking (only if needed)
  const lightBlock = () => {
    if (!shouldBlockIntellimize()) return;
    
    console.log('🚫 Light blocking Intellimize');
    
    // Only block the most harmful parts
    const blockDomains = ['cdn.intellimize.co', 'api.intellimize.co'];
    
    // Block fetch requests
    if (window.fetch) {
      const originalFetch = window.fetch;
      window.fetch = function(url, options) {
        if (typeof url === 'string') {
          for (const domain of blockDomains) {
            if (url.includes(domain)) {
              console.log('🚫 Blocked Intellimize request:', url);
              return Promise.reject(new Error('Intellimize blocked'));
            }
          }
        }
        return originalFetch.call(this, url, options);
      };
    }
    
    // Create minimal dummy Intellimize
    window.intellimize = {
      init: () => {},
      track: () => {},
      identify: () => {},
      page: () => {},
      experiment: () => {},
      variation: () => {}
    };
  };
  
  // Start blocking
  lightBlock();
  
  // Re-check after page load
  window.addEventListener('load', () => {
    setTimeout(lightBlock, 1000);
  });
  
})();
