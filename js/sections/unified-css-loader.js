/**
 * UNIFIED CSS LOADER
 * Loads the single unified CSS file to eliminate render-blocking requests
 */

(function() {
  'use strict';
  
  console.log('🎨 Loading unified CSS...');
  
  // Load unified CSS
  function loadUnifiedCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://n58.pages.dev/css/unified.css';
    link.media = 'all';
    
    // Add to head
    document.head.appendChild(link);
    
    console.log('✅ Unified CSS loaded');
  }
  
  // Run immediately
  loadUnifiedCSS();
  
})();
