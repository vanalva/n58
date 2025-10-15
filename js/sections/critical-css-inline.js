/**
 * CRITICAL CSS INLINE
 * Inject critical CSS inline to prevent FOUC while deferring non-critical CSS
 */

(function() {
  'use strict';
  
  console.log('🎨 Injecting critical CSS...');
  
  // Critical CSS for immediate rendering
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
  
  // Inject critical CSS immediately
  function injectCriticalCSS() {
    const style = document.createElement('style');
    style.id = 'critical-css-inline';
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
    console.log('✅ Critical CSS injected inline');
  }
  
  // Run immediately
  injectCriticalCSS();
  
})();
