/**
 * RESOURCE HINTS
 * Add critical resource hints for faster loading
 */

(function() {
  'use strict';
  
  // Add critical resource hints
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
  
  // Run immediately
  addResourceHints();
  
})();
