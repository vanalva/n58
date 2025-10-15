/**
 * SIMPLE CSS DEFER
 * Defer non-critical CSS to improve FCP
 */

(function() {
  'use strict';
  
  // List of non-critical CSS files to defer
  const nonCriticalCSS = [
    'cambio-marquee.css',
    'inicio.css'
  ];
  
  // Defer CSS files
  function deferCSS() {
    nonCriticalCSS.forEach(cssFile => {
      const existingLink = document.querySelector(`link[href*="${cssFile}"]`);
      if (existingLink) {
        // Convert to preload, then load as stylesheet
        existingLink.rel = 'preload';
        existingLink.as = 'style';
        existingLink.onload = function() {
          this.rel = 'stylesheet';
        };
        console.log(`⏳ Deferred CSS: ${cssFile}`);
      }
    });
  }
  
  // Run immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', deferCSS);
  } else {
    deferCSS();
  }
  
})();
