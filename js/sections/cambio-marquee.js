// Enhanced Marquee with Drag and Touch Support (Infinite Loop)
console.log('✅ cambio-marquee.js loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 Initializing enhanced marquee...');

    document.querySelectorAll('.marquee_container').forEach(container => {
        const marqueeId = 'marquee_' + Math.random().toString(36).substr(2, 9);
        container.dataset.marqueeId = marqueeId;

        // Get both scrolling elements for infinite loop
        const scrollElements = container.querySelectorAll('.marquee_elements-container');
        if (scrollElements.length < 2) {
            console.warn('⚠️ Need at least 2 marquee elements containers for infinite loop');
            return;
        }

        // State management
        let isDragging = false;
        let startX = 0;
        let startTransforms = [];
        let animationPaused = false;
        let dragOffset = 0;

        // Helper function to get current transform value
        const getCurrentTransform = (element) => {
            const style = window.getComputedStyle(element);
            const matrix = style.transform;
            if (matrix === 'none') return 0;
            const values = matrix.split('(')[1].split(')')[0].split(',');
            return parseFloat(values[4]) || 0;
        };

        // Helper function to pause animation and store current positions
        const pauseAnimation = () => {
            if (!animationPaused) {
                startTransforms = [];
                scrollElements.forEach((element, index) => {
                    const currentTransform = getCurrentTransform(element);
                    startTransforms[index] = currentTransform;
                    element.style.animationPlayState = 'paused';
                    element.style.transform = `translateX(${currentTransform}px)`;
                });
                animationPaused = true;
            }
        };

        // Helper function to resume animation
        const resumeAnimation = () => {
            if (animationPaused) {
                scrollElements.forEach(element => {
                    element.style.animationPlayState = 'running';
                    element.style.transform = '';
                });
                animationPaused = false;
                dragOffset = 0;
            }
        };

        // Helper function to update positions during drag
        const updateDragPositions = (deltaX) => {
            scrollElements.forEach((element, index) => {
                const newTransform = startTransforms[index] + deltaX;
                element.style.transform = `translateX(${newTransform}px)`;
            });
        };

        // Mouse Events
        const handleMouseDown = (e) => {
            isDragging = true;
            startX = e.pageX;
            pauseAnimation();
            container.style.cursor = 'grabbing';
            e.preventDefault();
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const deltaX = (e.pageX - startX) * 1.5; // Multiply for more responsive dragging
            dragOffset = deltaX;
            updateDragPositions(deltaX);
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
                }, 300);
            }
        };

        // Touch Events
        const handleTouchStart = (e) => {
            isDragging = true;
            startX = e.touches[0].pageX;
            pauseAnimation();
            e.preventDefault();
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const deltaX = (e.touches[0].pageX - startX) * 1.5;
            dragOffset = deltaX;
            updateDragPositions(deltaX);
        };

        const handleTouchEnd = () => {
            if (isDragging) {
                isDragging = false;
                // Resume animation after a short delay
                setTimeout(() => {
                    resumeAnimation();
                }, 300);
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

        // Prevent context menu on long press (mobile)
        container.addEventListener('contextmenu', (e) => {
            if (isDragging) e.preventDefault();
        });

        // Set initial cursor style
        container.style.cursor = 'grab';

        console.log(`✅ Enhanced infinite marquee initialized: ${marqueeId}`);
    });
});
  