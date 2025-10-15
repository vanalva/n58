/**
 * Font Preloading System
 * Preloads critical fonts to reduce layout shift and improve performance
 */

(function() {
  'use strict';
  
  // Critical fonts that should be preloaded
  const criticalFonts = [
    {
      href: 'https://n58.pages.dev/fonts/Nugros-SemiBold.woff2',
      type: 'font/woff2',
      weight: '600',
      style: 'normal'
    },
    {
      href: 'https://n58.pages.dev/fonts/Nugros-Bold.woff2',
      type: 'font/woff2',
      weight: '700',
      style: 'normal'
    },
    {
      href: 'https://n58.pages.dev/fonts/Nugros-Regular.woff2',
      type: 'font/woff2',
      weight: '400',
      style: 'normal'
    }
  ];
  
  // Preload critical fonts
  function preloadFonts() {
    criticalFonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = font.href;
      link.type = font.type;
      link.crossOrigin = 'anonymous';
      
      // Add font display properties for better loading
      if (font.weight) link.setAttribute('data-weight', font.weight);
      if (font.style) link.setAttribute('data-style', font.style);
      
      document.head.appendChild(link);
    });
  }
  
  // Add font-face declarations for better fallback
  function addFontFaces() {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Nugros';
        font-weight: 400;
        font-style: normal;
        font-display: swap;
        src: url('https://n58.pages.dev/fonts/Nugros-Regular.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Nugros';
        font-weight: 600;
        font-style: normal;
        font-display: swap;
        src: url('https://n58.pages.dev/fonts/Nugros-SemiBold.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Nugros';
        font-weight: 700;
        font-style: normal;
        font-display: swap;
        src: url('https://n58.pages.dev/fonts/Nugros-Bold.woff2') format('woff2');
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize font preloading
  preloadFonts();
  addFontFaces();
  
})();
