/**
 * ULTIMATE CSS OPTIMIZER
 * Combines critical CSS injection with aggressive CSS deferring
 */

(function() {
  'use strict';
  
  console.log('🚀 Ultimate CSS optimizer starting...');
  
  // 1. Inject critical CSS immediately
  function injectCriticalCSS() {
    const criticalCSS = `
      /* Critical CSS for immediate rendering */
      body {
        font-family: 'Nugros', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #1a1a1a;
        color: #f0f0f0;
      }
      
      .main-navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background: #1a1a1a;
        border-bottom: 1px solid #4CAF50;
      }
      
      .spline-header {
        min-height: 60vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }
      
      .spline-container.home {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        min-height: 30vh;
      }
      
      .main-title {
        font-size: 2rem;
        font-weight: 700;
        line-height: 1.3;
        color: #f0f0f0;
        text-align: center;
        margin: 0;
      }
      
      #n58-page-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #1a1a1a;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }
      
      .bar-container {
        width: 280px;
        height: 14px;
        background: transparent;
        border: 2px solid #4CAF50;
        position: relative;
        overflow: hidden;
      }
      
      .bar-fill {
        height: 100%;
        background: #4CAF50;
        width: 0%;
        animation: barLoad 2s ease-out forwards;
        position: absolute;
        top: 0;
        left: 0;
      }
      
      @keyframes barLoad {
        0% { width: 0%; }
        100% { width: 100%; }
      }
      
      body.loaded #n58-page-loader {
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }
      
      /* Mobile optimizations */
      @media screen and (max-width: 767px) {
        .main-title { font-size: 1.5rem; }
        .spline-header { min-height: 40vh; }
        .bar-container { width: 240px; height: 12px; }
      }
      
      /* Desktop optimizations */
      @media screen and (min-width: 768px) {
        .main-title { font-size: 3rem; line-height: 1.2; }
        .spline-header { min-height: 100vh; }
        .spline-container.home { min-height: 50vh; }
        .bar-container { width: 320px; height: 16px; }
      }
    `;
    
    const style = document.createElement('style');
    style.id = 'critical-css-inline';
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
    console.log('✅ Critical CSS injected inline');
  }
  
  // 2. Defer non-critical CSS files
  function deferNonCriticalCSS() {
    const cssToDefer = [
      'cambio-marquee.css',
      'inicio.css',
      'global.css'
    ];
    
    cssToDefer.forEach(cssFile => {
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
    });
    
    console.log('✅ All non-critical CSS deferred');
  }
  
  // 3. Add resource hints
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
  
  // Initialize all optimizations
  function initOptimizations() {
    // Run immediately
    injectCriticalCSS();
    addResourceHints();
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        deferNonCriticalCSS();
        optimizeImages();
      });
    } else {
      deferNonCriticalCSS();
      optimizeImages();
    }
    
    console.log('✅ Ultimate CSS optimizer completed');
  }
  
  // Start optimizations
  initOptimizations();
  
})();
