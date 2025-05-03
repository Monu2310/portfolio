/**
 * Advanced Scroll Animations for Portfolio - Performance Optimized
 * Using Anime.js for smooth, efficient animations
 */

// Detect when elements enter viewport - with performance optimizations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

// Device capability detection
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const isLowPowerDevice = isMobile || window.innerWidth < 768 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

// Reduce animation complexity based on device capability
const animationSettings = {
  duration: isLowPowerDevice ? 800 : 1000,
  delayFactor: isLowPowerDevice ? 0.5 : 1,
  useStaggering: !isLowPowerDevice,
  maxAnimationsPerFrame: isLowPowerDevice ? 3 : 10,
  disableParallax: isLowPowerDevice,
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

// Queue for managing animations
let animationQueue = [];
let isProcessingQueue = false;
let activeAnimationsCount = 0;
const maxConcurrentAnimations = animationSettings.maxAnimationsPerFrame;

// Function to handle animations when elements come into view - optimized
function handleIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      
      // Queue animation instead of running immediately
      queueAnimation(target);
      
      // Unobserve after animation is triggered to avoid duplicate animations
      observer.unobserve(target);
    }
  });
}

// Queue and process animations to prevent too many running at once
function queueAnimation(element) {
  animationQueue.push(element);
  
  if (!isProcessingQueue) {
    processAnimationQueue();
  }
}

// Process animation queue
function processAnimationQueue() {
  isProcessingQueue = true;
  
  // Process animations if we have capacity
  while (animationQueue.length > 0 && activeAnimationsCount < maxConcurrentAnimations) {
    const element = animationQueue.shift();
    animateElement(element);
    activeAnimationsCount++;
  }
  
  // Check if we need to continue processing later
  if (animationQueue.length > 0) {
    setTimeout(processAnimationQueue, 100);
  } else {
    isProcessingQueue = false;
  }
}

// Animation complete callback
function onAnimationComplete() {
  activeAnimationsCount = Math.max(0, activeAnimationsCount - 1);
  
  // If we have capacity and elements in queue, process more
  if (animationQueue.length > 0 && activeAnimationsCount < maxConcurrentAnimations) {
    processAnimationQueue();
  }
}

// Apply animation to element
function animateElement(target) {
  // Get animation type from data attribute
  const animationType = target.dataset.animation || 'fadeIn';
  
  // For reduced motion preference, simplify all animations
  if (animationSettings.reduceMotion) {
    anime({
      targets: target,
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: 300,
      complete: onAnimationComplete
    });
    return;
  }
  
  // Apply different animations based on the element's data-animation attribute
  switch (animationType) {
    case 'fadeIn':
      anime({
        targets: target,
        opacity: [0, 1],
        translateY: [30, 0],
        easing: 'easeOutExpo',
        duration: animationSettings.duration,
        delay: 100 * animationSettings.delayFactor,
        complete: onAnimationComplete
      });
      break;
    case 'slideRight':
      anime({
        targets: target,
        opacity: [0, 1],
        translateX: [-50, 0],
        easing: 'easeOutCubic',
        duration: animationSettings.duration * 0.8,
        delay: 120 * animationSettings.delayFactor,
        complete: onAnimationComplete
      });
      break;
    case 'slideLeft':
      anime({
        targets: target,
        opacity: [0, 1],
        translateX: [50, 0],
        easing: 'easeOutCubic',
        duration: animationSettings.duration * 0.8,
        delay: 120 * animationSettings.delayFactor,
        complete: onAnimationComplete
      });
      break;
    case 'scaleUp':
      anime({
        targets: target,
        opacity: [0, 1],
        scale: [0.9, 1],
        easing: 'easeOutQuint',
        duration: animationSettings.duration,
        delay: 150 * animationSettings.delayFactor,
        complete: onAnimationComplete
      });
      break;
    case 'staggered':
      if (animationSettings.useStaggering) {
        // For elements that contain multiple children to animate one after another
        anime({
          targets: target.querySelectorAll('.stagger-item'),
          opacity: [0, 1],
          translateY: [20, 0],
          easing: 'easeOutExpo',
          duration: animationSettings.duration * 0.8,
          delay: anime.stagger(50 * animationSettings.delayFactor),
          complete: onAnimationComplete
        });
      } else {
        // Simplified animation for lower-end devices
        anime({
          targets: target.querySelectorAll('.stagger-item'),
          opacity: [0, 1],
          easing: 'easeOutQuad',
          duration: animationSettings.duration * 0.7,
          complete: onAnimationComplete
        });
      }
      break;
    case 'serviceCard':
      anime({
        targets: target,
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.95, 1],
        easing: 'easeOutQuint',
        duration: animationSettings.duration,
        delay: 100 * animationSettings.delayFactor,
        complete: onAnimationComplete
      });
      break;
    case 'portfolioItem':
      anime({
        targets: target,
        opacity: [0, 1],
        translateY: [40, 0],
        easing: 'easeOutCubic',
        duration: animationSettings.duration * 0.9,
        delay: 150 * animationSettings.delayFactor,
        complete: onAnimationComplete
      });
      break;
    case 'progressBar':
      // For skill progress bars - simplified for performance
      const progressEl = target.querySelector('div[class*="-progress"]');
      if (!progressEl) {
        onAnimationComplete();
        return;
      }
      
      // Get target width from content
      const targetWidth = progressEl.textContent;
      
      // Set initial width to avoid layout shifts
      progressEl.style.width = '0%';
      
      anime({
        targets: progressEl,
        width: [0, targetWidth],
        easing: 'easeInOutQuart',
        duration: animationSettings.duration * 1.2,
        delay: 200 * animationSettings.delayFactor,
        complete: onAnimationComplete
      });
      break;
    default:
      // Default simple animation for unknown types
      anime({
        targets: target,
        opacity: [0, 1],
        duration: animationSettings.duration * 0.7,
        easing: 'easeOutQuad',
        complete: onAnimationComplete
      });
  }
}

// Create the intersection observer - with debounced callback
const animationObserver = new IntersectionObserver(
  (entries, observer) => {
    // Throttle the processing of entries to avoid excessive calculations
    requestAnimationFrame(() => handleIntersection(entries, observer));
  }, 
  observerOptions
);

// Optimized parallax scrolling for high-performance devices only
let lastScrollY = 0;
let ticking = false;

function parallaxScroll() {
  // Skip parallax on low-power devices
  if (animationSettings.disableParallax) return;
  
  const scrolled = window.pageYOffset;
  
  // Skip if scroll delta is tiny
  if (Math.abs(scrolled - lastScrollY) < 5) return;
  
  lastScrollY = scrolled;
  
  if (!ticking) {
    requestAnimationFrame(() => {
      if (document.querySelector('#particles')) {
        const particles = document.querySelector('#particles');
        particles.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
      
      if (document.querySelector('.header-content')) {
        const headerContent = document.querySelector('.header-content');
        headerContent.style.transform = `translateY(${scrolled * 0.2}px)`;
        headerContent.style.opacity = 1 - (scrolled * 0.002);
      }
      
      // Apply parallax to elements with parallax-element class
      document.querySelectorAll('.parallax-element').forEach(element => {
        const speed = element.dataset.parallaxSpeed || 0.2;
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
      
      ticking = false;
    });
    
    ticking = true;
  }
}

// Optimized cursor enhancement
function enhanceCursor() {
  // Skip on mobile/touch devices
  if (isMobile) return;
  
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;
  
  // Use CSS for animation instead of JS for better performance
  document.addEventListener('mousemove', (e) => {
    // Use requestAnimationFrame to limit updates
    requestAnimationFrame(() => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  });
  
  // Use event delegation for hover effects
  document.addEventListener('mouseover', (e) => {
    // Check if the target is a button or link
    if (e.target.tagName === 'BUTTON' || 
        e.target.tagName === 'A' || 
        e.target.closest('button') || 
        e.target.closest('a')) {
      cursor.classList.add('active');
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    if (e.target.tagName === 'BUTTON' || 
        e.target.tagName === 'A' || 
        e.target.closest('button') || 
        e.target.closest('a')) {
      cursor.classList.remove('active');
    }
  });
}

// Initialize animations when document is ready - with optimizations
document.addEventListener('DOMContentLoaded', function() {
  // Delay non-critical initializations
  setTimeout(() => {
    // 1. Setup animated elements - only observe elements in or near viewport initially
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    if ('IntersectionObserver' in window) {
      // Use a more efficient way to initialize observers
      // Batch by animation type to reduce observer count
      const observerMap = new Map();
      
      animatedElements.forEach(el => {
        const animationType = el.dataset.animation || 'default';
        
        if (!observerMap.has(animationType)) {
          observerMap.set(animationType, []);
        }
        
        observerMap.get(animationType).push(el);
      });
      
      // Now observe elements in batches
      observerMap.forEach((elements) => {
        elements.forEach(el => {
          animationObserver.observe(el);
        });
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      animatedElements.forEach(el => {
        // Simple animation without scroll trigger
        el.style.opacity = 1;
      });
    }
    
    // 2. Setup scroll handlers - with passive option for performance
    if (!animationSettings.disableParallax) {
      // Throttle scroll event
      let scrollTimeout;
      window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
          scrollTimeout = setTimeout(() => {
            parallaxScroll();
            scrollTimeout = null;
          }, 20);
        }
      }, { passive: true });
    }
    
    // 3. Enhance cursor - only on desktop
    if (!isMobile) {
      enhanceCursor();
    }
    
    // 4. Setup scroll-triggered navigation highlighting (optimized)
    setupScrollSpy();
  }, 100); // Short delay to prioritize initial page render
});

// Scroll spy to highlight active navigation based on scroll position - optimized
function setupScrollSpy() {
  const sections = document.querySelectorAll('div[id]');
  const navItems = document.querySelectorAll('.navigation-links a');
  
  if (sections.length === 0 || navItems.length === 0) return;
  
  // Pre-calculate section positions once and update on resize
  let sectionPositions = [];
  
  function calculateSectionPositions() {
    sectionPositions = Array.from(sections).map(section => ({
      id: section.getAttribute('id'),
      top: section.offsetTop - 120,
      bottom: section.offsetTop + section.offsetHeight - 120
    }));
  }
  
  calculateSectionPositions();
  
  // Recalculate on resize with debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(calculateSectionPositions, 200);
  }, { passive: true });
  
  // Throttled scroll handler for section highlighting
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (scrollTimeout) return;
    
    scrollTimeout = setTimeout(() => {
      const scrollPos = window.pageYOffset;
      let current = '';
      
      // Find current section
      for (const section of sectionPositions) {
        if (scrollPos >= section.top && scrollPos < section.bottom) {
          current = section.id;
          break;
        }
      }
      
      // Update active class
      navItems.forEach(item => {
        item.classList.remove('active-nav');
        if (current && item.getAttribute('id') === current + '-link') {
          item.classList.add('active-nav');
        }
      });
      
      scrollTimeout = null;
    }, 100);
  }, { passive: true });
}

// Use native smooth scrolling instead of JS-based
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    
    // Use native smooth scrolling API for better performance
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});