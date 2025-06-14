/**
 * Scroll Prevention Script
 * Prevents unwanted automatic scrolling on page load and navigation
 */

(function() {
    'use strict';
    
    // Prevent scroll restoration
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    // Track if this is initial page load
    let isInitialLoad = true;
    let preventScroll = true;
    
    // Function to disable scroll temporarily
    function disableScroll() {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }
    
    // Function to enable scroll
    function enableScroll() {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }
    
    // Prevent any scroll events during initial load
    function preventInitialScroll(e) {
        if (preventScroll) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
    
    // Initialize prevention
    document.addEventListener('DOMContentLoaded', function() {
        // Ensure we start at the top
        window.scrollTo(0, 0);
        
        // Temporarily disable scroll
        disableScroll();
        
        // Add event listeners to prevent scrolling
        window.addEventListener('wheel', preventInitialScroll, { passive: false });
        window.addEventListener('touchmove', preventInitialScroll, { passive: false });
        window.addEventListener('scroll', preventInitialScroll, { passive: false });
        
        // Wait for all scripts to initialize
        setTimeout(() => {
            // Check if we're on the home section or need to navigate
            const currentHash = window.location.hash;
            
            if (!currentHash || currentHash === '#home' || currentHash === '#') {
                // Ensure we're at the top for home
                window.scrollTo(0, 0);
            }
            
            // Re-enable scrolling after a brief delay
            setTimeout(() => {
                preventScroll = false;
                enableScroll();
                
                // Remove event listeners
                window.removeEventListener('wheel', preventInitialScroll);
                window.removeEventListener('touchmove', preventInitialScroll);
                window.removeEventListener('scroll', preventInitialScroll);
                
                isInitialLoad = false;
            }, 500);
        }, 200);
    });
    
    // Handle page visibility changes to prevent scroll jumps
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible' && isInitialLoad) {
            window.scrollTo(0, 0);
        }
    });
    
    // Prevent hash changes from causing unwanted scrolling
    window.addEventListener('hashchange', function(e) {
        if (isInitialLoad) {
            e.preventDefault();
            window.scrollTo(0, 0);
        }
    });
    
    // Override any potential scroll-inducing functions
    const originalScrollTo = window.scrollTo;
    const originalScrollBy = window.scrollBy;
    
    window.scrollTo = function(x, y) {
        if (preventScroll && isInitialLoad) {
            return;
        }
        return originalScrollTo.call(window, x, y);
    };
    
    window.scrollBy = function(x, y) {
        if (preventScroll && isInitialLoad) {
            return;
        }
        return originalScrollBy.call(window, x, y);
    };
    
})();
