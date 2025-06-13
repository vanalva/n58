// Homepage specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize homepage specific functionality
    console.log('Homepage JavaScript loaded');

    // Example: Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Example: Initialize any homepage-specific animations or interactions
    function initHomepageAnimations() {
        // Add your homepage-specific animations here
    }

    // Call initialization functions
    initHomepageAnimations();
}); 