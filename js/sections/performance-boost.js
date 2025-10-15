/**
 * PERFORMANCE BOOST
 * Lightweight performance optimizations to improve FCP and LCP
 */

(function() {
  'use strict';
  
  console.log('🚀 Performance boost starting...');
  
  // 1. Add critical resource hints immediately
  function addResourceHints() {
    const hints = [
      { rel: 'preconnect', href: 'https://cdnjs.cloudflare.com' },
      { rel: 'preconnect', href: 'https://unpkg.com' },
      { rel: 'dns-prefetch', href: 'https://cdn.prod.website-files.com' },
      { rel: 'dns-prefetch', href: 'https://d3e54v103j8qbb.cloudfront.net' }
    ];
    
    hints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      document.head.appendChild(link);
    });
    
    console.log('🔗 Resource hints added');
  }
  
  // 2. Defer non-critical CSS
  function deferNonCriticalCSS() {
    const nonCriticalCSS = [
      'cambio-marquee.css',
      'inicio.css'
    ];
    
    nonCriticalCSS.forEach(cssFile => {
      const existingLink = document.querySelector(`link[href*="${cssFile}"]`);
      if (existingLink) {
        existingLink.rel = 'preload';
        existingLink.as = 'style';
        existingLink.onload = function() {
          this.rel = 'stylesheet';
        };
        console.log(`⏳ Deferred CSS: ${cssFile}`);
      }
    });
  }
  
  // 3. Optimize global.css for mobile
  function optimizeGlobalCSS() {
    const globalCSS = document.querySelector('link[href*="global.css"]');
    if (globalCSS) {
      // Load only on larger screens initially
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
  
  // 4. Optimize images for mobile
  function optimizeImages() {
    if (window.innerWidth <= 768) {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        if (!img.hasAttribute('decoding')) {
          img.setAttribute('decoding', 'async');
        }
      });
      console.log('📱 Images optimized for mobile');
    }
  }
  
  // 5. Remove any remaining references to deleted files
  function cleanupDeletedFiles() {
    // Remove any script tags that might reference deleted files
    const scripts = document.querySelectorAll('script[src*="intellimize-nuker"]');
    scripts.forEach(script => {
      console.log('🗑️ Removing reference to deleted file:', script.src);
      script.remove();
    });
  }
  
  // Initialize optimizations
  function initOptimizations() {
    // Run immediately
    addResourceHints();
    cleanupDeletedFiles();
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        deferNonCriticalCSS();
        optimizeGlobalCSS();
        optimizeImages();
      });
    } else {
      deferNonCriticalCSS();
      optimizeGlobalCSS();
      optimizeImages();
    }
    
    console.log('✅ Performance boost completed');
  }
  
  // Start optimizations
  initOptimizations();
  
})();
