/**
 * AGGRESSIVE CSS DEFER
 * Immediately defer all non-critical CSS to improve FCP
 */

(function() {
  'use strict';
  
  console.log('🚀 Aggressive CSS defer starting...');
  
  // List of CSS files to defer
  const cssToDefer = [
    'cambio-marquee.css',
    'inicio.css',
    'global.css'
  ];
  
  // Function to defer a CSS file
  function deferCSSFile(cssFile) {
    const existingLink = document.querySelector(`link[href*="${cssFile}"]`);
    if (existingLink) {
      console.log(`⏳ Deferring CSS: ${cssFile}`);
      
      // Convert to preload, then load as stylesheet
      existingLink.rel = 'preload';
      existingLink.as = 'style';
      existingLink.onload = function() {
        this.rel = 'stylesheet';
        console.log(`✅ CSS loaded: ${cssFile}`);
      };
      
      // Fallback: load after 3 seconds if onload doesn't fire
      setTimeout(() => {
        if (existingLink.rel === 'preload') {
          existingLink.rel = 'stylesheet';
          console.log(`⏰ CSS fallback loaded: ${cssFile}`);
        }
      }, 3000);
    }
  }
  
  // Defer all CSS files immediately
  function deferAllCSS() {
    cssToDefer.forEach(deferCSSFile);
    console.log('✅ All CSS files deferred');
  }
  
  // Run immediately
  deferAllCSS();
  
  // Also run on DOM ready as backup
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', deferAllCSS);
  }
  
})();
