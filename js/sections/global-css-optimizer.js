/**
 * GLOBAL CSS OPTIMIZER
 * Optimize global.css loading for better FCP
 */

(function() {
  'use strict';
  
  // Optimize global.css loading
  function optimizeGlobalCSS() {
    const globalCSS = document.querySelector('link[href*="global.css"]');
    if (globalCSS) {
      // Add media query to load only on larger screens initially
      globalCSS.media = 'screen and (min-width: 768px)';
      
      // Load for mobile after page load
      window.addEventListener('load', () => {
        setTimeout(() => {
          globalCSS.media = 'all';
          console.log('📱 Global CSS loaded for mobile');
        }, 1000);
      });
      
      console.log('🎨 Global CSS optimized for mobile');
    }
  }
  
  // Run immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeGlobalCSS);
  } else {
    optimizeGlobalCSS();
  }
  
})();
