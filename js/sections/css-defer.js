/**
 * CSS Deferring System
 * Loads CSS asynchronously to prevent render blocking
 */

(function() {
  'use strict';
  
  // Critical CSS that must load immediately
  const criticalCSS = [
    'https://n58.pages.dev/css/global.css'
  ];
  
  // Non-critical CSS that can be deferred
  const deferredCSS = [
    'https://n58.pages.dev/css/sections/cambio-marquee.css',
    'https://n58.pages.dev/css/static/inicio.css'
  ];
  
  // Load CSS with preload technique
  function loadCSS(href, critical = false) {
    if (critical) {
      // Critical CSS - load normally
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'all';
      document.head.appendChild(link);
      return;
    }
    
    // Non-critical CSS - preload technique
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = function() {
      this.onload = null;
      this.rel = 'stylesheet';
      this.media = 'all';
    };
    document.head.appendChild(link);
    
    // Fallback for browsers that don't support preload
    const noscript = document.createElement('noscript');
    const fallbackLink = document.createElement('link');
    fallbackLink.rel = 'stylesheet';
    fallbackLink.href = href;
    fallbackLink.media = 'all';
    noscript.appendChild(fallbackLink);
    document.head.appendChild(noscript);
  }
  
  // Load critical CSS immediately
  criticalCSS.forEach(href => loadCSS(href, true));
  
  // Load deferred CSS after page load
  function loadDeferredCSS() {
    deferredCSS.forEach(href => loadCSS(href, false));
  }
  
  // Load deferred CSS after LCP or with timeout
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDeferredCSS);
  } else {
    loadDeferredCSS();
  }
  
  // Fallback timeout
  setTimeout(loadDeferredCSS, 1000);
  
})();
