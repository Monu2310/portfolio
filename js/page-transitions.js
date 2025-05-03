/**
 * Advanced Page Transitions
 * This script handles smooth transitions between different sections of the portfolio
 */

// Create transition overlay element if it doesn't exist
function createTransitionElements() {
  if (!document.querySelector('.page-transition-overlay')) {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);
  }
}

// Initialize page transitions
function initializePageTransitions() {
  createTransitionElements();
  const overlay = document.querySelector('.page-transition-overlay');
  const links = document.querySelectorAll('.navigation-links a');
  const sections = document.querySelectorAll('.section-container');
  
  // Initial state of overlay
  gsap.set(overlay, { 
    scaleX: 0, 
    transformOrigin: 'right'
  });

  // Set up click handlers for navigation links
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').replace('#', '');
      const currentSection = document.querySelector('.section-active') || sections[0];
      const targetSection = document.getElementById(targetId);
      
      if (targetSection && currentSection !== targetSection) {
        performPageTransition(currentSection, targetSection);
      }
    });
  });
}

// Perform the transition animation between pages
function performPageTransition(fromSection, toSection) {
  const overlay = document.querySelector('.page-transition-overlay');
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
  
  // Update active navigation link
  document.querySelectorAll('.navigation-links a').forEach(link => {
    const linkTarget = link.getAttribute('href').replace('#', '');
    if (linkTarget === toSection.id) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // First half of animation - cover the screen
  gsap.to(overlay, {
    scaleX: 1,
    duration: 0.5,
    ease: "power2.inOut",
    onComplete: () => {
      // Hide current section, show target section
      if (fromSection) {
        fromSection.classList.remove('section-active');
        fromSection.style.display = 'none';
      }
      
      toSection.classList.add('section-active');
      toSection.style.display = 'block';
      
      // Prepare and run animations for the new section
      prepareNewSectionAnimations(toSection);
      
      // Set transform origin for the reveal animation
      gsap.set(overlay, { transformOrigin: 'left' });
      
      // Second half of animation - reveal the new section
      gsap.to(overlay, {
        scaleX: 0,
        duration: 0.5,
        delay: 0.1,
        ease: "power2.inOut",
        onComplete: () => {
          // After animation completes, make sure target section remains visible
          toSection.style.opacity = 1;
          
          // Update URL hash (without scrolling)
          const scrollPosition = window.scrollY;
          window.location.hash = toSection.id;
          window.scrollTo(0, scrollPosition);
        }
      });
    }
  });
}

// Prepare animations for the new section
function prepareNewSectionAnimations(section) {
  // Reset opacity for all animation elements in the new section
  const animationElements = section.querySelectorAll('[data-animation], [data-framer-animate]');
  
  // Reset standard animation elements
  animationElements.forEach(element => {
    gsap.set(element, { opacity: 0 });
  });
  
  // After a tiny delay, trigger animations for the new section
  setTimeout(() => {
    // Run anime.js animations if using data-framer-animate attribute
    section.querySelectorAll('[data-framer-animate]').forEach(element => {
      const animationType = element.getAttribute('data-framer-animate');
      const delay = parseInt(element.getAttribute('data-framer-delay') || 0);
      
      switch(animationType) {
        case 'fadeUp':
          anime({
            targets: element,
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 800,
            easing: 'easeOutExpo',
            delay: delay
          });
          break;
        case 'fadeLeft':
          anime({
            targets: element,
            opacity: [0, 1],
            translateX: [-50, 0],
            duration: 800,
            easing: 'easeOutExpo',
            delay: delay
          });
          break;
        case 'fadeRight':
          anime({
            targets: element,
            opacity: [0, 1],
            translateX: [50, 0],
            duration: 800,
            easing: 'easeOutExpo',
            delay: delay
          });
          break;
        case 'scaleUp':
          anime({
            targets: element,
            opacity: [0, 1],
            scale: [0.8, 1],
            duration: 800,
            easing: 'easeOutExpo',
            delay: delay
          });
          break;
        default:
          anime({
            targets: element,
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutExpo',
            delay: delay
          });
      }
    });
    
    // Run GSAP animations if using data-animation attribute
    section.querySelectorAll('[data-animation]').forEach(element => {
      const animationType = element.getAttribute('data-animation');
      
      switch(animationType) {
        case 'fadeIn':
          gsap.to(element, {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
          });
          break;
        case 'slideLeft':
          gsap.fromTo(element, 
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
          );
          break;
        case 'slideRight':
          gsap.fromTo(element, 
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
          );
          break;
        case 'progressBar':
          gsap.set(element, { opacity: 1 });
          gsap.fromTo(element.querySelector('.wow'), 
            { width: '0%' },
            { width: '100%', duration: 1.5, ease: "power2.out" }
          );
          break;
        case 'serviceCard':
          gsap.fromTo(element, 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.2)" }
          );
          break;
        case 'portfolioItem':
          gsap.fromTo(element, 
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.2)" }
          );
          break;
        default:
          gsap.to(element, {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
          });
      }
    });
  }, 100);
}

// Check if initial view has a hash and trigger appropriate section
function checkInitialHash() {
  if (window.location.hash) {
    const targetId = window.location.hash.substring(1);
    const targetSection = document.getElementById(targetId);
    const sections = document.querySelectorAll('.section-container');
    
    if (targetSection) {
      // Hide all sections initially
      sections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('section-active');
      });
      
      // Show the target section
      targetSection.style.display = 'block';
      targetSection.classList.add('section-active');
      
      // Update active navigation link
      document.querySelectorAll('.navigation-links a').forEach(link => {
        const linkTarget = link.getAttribute('href').replace('#', '');
        if (linkTarget === targetId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      
      // Prepare animations for target section
      prepareNewSectionAnimations(targetSection);
    }
  } else {
    // If no hash, set the first section as active
    const firstSection = document.querySelector('.section-container');
    if (firstSection) {
      firstSection.classList.add('section-active');
      firstSection.style.display = 'block';
      
      // Add active class to the first navigation link
      const firstLink = document.querySelector('.navigation-links a');
      if (firstLink) {
        firstLink.classList.add('active');
      }
      
      // Prepare animations for first section
      prepareNewSectionAnimations(firstSection);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Setup section displays initially
  const sections = document.querySelectorAll('.section-container');
  sections.forEach(section => {
    if (!section.classList.contains('section-active')) {
      section.style.display = 'none';
    }
  });
  
  // Initialize page transitions
  initializePageTransitions();
  
  // Check initial hash
  checkInitialHash();
  
  // Add special transition for menu toggle
  const menubar = document.querySelector('.menubar');
  const navigationContent = document.querySelector('#navigation-content');
  
  if (menubar && navigationContent) {
    menubar.addEventListener('click', function() {
      // Create a menu-specific overlay animation
      const overlay = document.querySelector('.page-transition-overlay');
      
      gsap.set(overlay, { 
        scaleX: 0, 
        transformOrigin: 'top'
      });
      
      gsap.to(overlay, {
        scaleY: 1,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          navigationContent.classList.add('active');
          gsap.set(overlay, { transformOrigin: 'bottom' });
          
          gsap.to(overlay, {
            scaleY: 0,
            duration: 0.3,
            delay: 0.1,
            ease: "power2.inOut"
          });
        }
      });
    });
    
    // Also handle navigation close button
    const navigationClose = document.querySelector('.navigation-close');
    if (navigationClose) {
      navigationClose.addEventListener('click', function() {
        const overlay = document.querySelector('.page-transition-overlay');
        
        gsap.set(overlay, { 
          scaleX: 0, 
          transformOrigin: 'top'
        });
        
        gsap.to(overlay, {
          scaleY: 1,
          duration: 0.3,
          ease: "power2.inOut",
          onComplete: () => {
            navigationContent.classList.remove('active');
            gsap.set(overlay, { transformOrigin: 'bottom' });
            
            gsap.to(overlay, {
              scaleY: 0,
              duration: 0.3,
              delay: 0.1,
              ease: "power2.inOut"
            });
          }
        });
      });
    }
  }
});