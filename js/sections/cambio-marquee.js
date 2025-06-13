// Enhanced Marquee with Drag and Touch Support
console.log('✅ cambio-marquee.js loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 Initializing enhanced marquee...');

    document.querySelectorAll('.marquee_container').forEach(container => {
        const marqueeId = 'marquee_' + Math.random().toString(36).substr(2, 9);
        container.dataset.marqueeId = marqueeId;

        // Get the scrolling element
        const scrollElement = container.querySelector('.marquee_elements-container');
        if (!scrollElement) {
            console.warn('⚠️ No marquee elements container found');
            return;
        }

        // State management
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;
        let animationPaused = false;
        let currentTransform = 0;

        // Helper function to get current transform value
        const getCurrentTransform = () => {
            const style = window.getComputedStyle(scrollElement);
            const matrix = style.transform;
            if (matrix === 'none') return 0;
            const values = matrix.split('(')[1].split(')')[0].split(',');
            return parseFloat(values[4]) || 0;
        };

        // Helper function to pause animation and store current position
        const pauseAnimation = () => {
            if (!animationPaused) {
                currentTransform = getCurrentTransform();
                scrollElement.style.animationPlayState = 'paused';
                scrollElement.style.transform = `translateX(${currentTransform}px)`;
                animationPaused = true;
            }
        };

        // Helper function to resume animation from current position
        const resumeAnimation = () => {
            if (animationPaused) {
                scrollElement.style.animationPlayState = 'running';
                scrollElement.style.transform = '';
                animationPaused = false;
            }
        };

        // Mouse Events
        const handleMouseDown = (e) => {
            isDragging = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = getCurrentTransform();
            pauseAnimation();
            container.style.cursor = 'grabbing';
            e.preventDefault();
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
            const newTransform = scrollLeft + walk;
            scrollElement.style.transform = `translateX(${newTransform}px)`;
        };

        const handleMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                container.style.cursor = 'grab';
                // Resume animation after a short delay
                setTimeout(() => {
                    if (!container.matches(':hover')) {
                        resumeAnimation();
                    }
                }, 500);
            }
        };

        // Touch Events
        const handleTouchStart = (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - container.offsetLeft;
            scrollLeft = getCurrentTransform();
            pauseAnimation();
            e.preventDefault();
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            const newTransform = scrollLeft + walk;
            scrollElement.style.transform = `translateX(${newTransform}px)`;
        };

        const handleTouchEnd = () => {
            if (isDragging) {
                isDragging = false;
                // Resume animation after a short delay
                setTimeout(() => {
                    resumeAnimation();
                }, 500);
            }
        };

        // Original hover functionality (enhanced)
        const handleMouseEnter = () => {
            if (!isDragging) {
                pauseAnimation();
            }
        };

        const handleMouseLeave = () => {
            if (!isDragging) {
                resumeAnimation();
            }
        };

        // Add event listeners
        container.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd);

        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        // Prevent text selection during drag
        container.addEventListener('selectstart', (e) => {
            if (isDragging) e.preventDefault();
        });

        // Set initial cursor style
        container.style.cursor = 'grab';

        console.log(`✅ Enhanced marquee initialized: ${marqueeId}`);
    });
});
  