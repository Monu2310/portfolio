/**
 * Advanced Theme Color Management
 * Enhances color switching with smooth transitions and CSS variables
 */

// Color Theme Manager
class ColorThemeManager {
  constructor() {
    this.currentTheme = null;
    this.themes = {
      'red': {
        primary: '#ff2a75',
        secondary: '#f44336',
        tertiary: '#ff9e80',
        text: '#ffffff',
        background: '#1f1f1f',
        loader: '#ff2a75'
      },
      'blue': {
        primary: '#3e59df',
        secondary: '#2196f3',
        tertiary: '#90caf9',
        text: '#ffffff',
        background: '#1f1f1f',
        loader: '#3e59df'
      },
      'green': {
        primary: '#39b54a',
        secondary: '#4caf50',
        tertiary: '#a5d6a7',
        text: '#ffffff',
        background: '#1f1f1f',
        loader: '#39b54a'
      },
      'purple': {
        primary: '#7928ca',
        secondary: '#9c27b0',
        tertiary: '#ce93d8',
        text: '#ffffff',
        background: '#1f1f1f',
        loader: '#7928ca'
      },
      'malt': {
        primary: '#d4ac2b',
        secondary: '#ffb300',
        tertiary: '#ffe082',
        text: '#ffffff',
        background: '#1f1f1f',
        loader: '#d4ac2b'
      },
      'orange': {
        primary: '#fa5b0f',
        secondary: '#ff9800',
        tertiary: '#ffcc80',
        text: '#ffffff',
        background: '#1f1f1f',
        loader: '#fa5b0f'
      }
    };
    
    // Store the original color stylesheets
    this.originalStylesheets = {};
    
    // Initialize the theme manager
    this.init();
  }
  
  // Initialize color theme manager
  init() {
    // Add CSS variables to document root
    this.applyDefaultTheme();
    
    // Add event listeners to color switcher elements
    this.setupEventListeners();
    
    // Set up local storage for theme persistence
    this.loadSavedTheme();
  }
  
  // Apply default theme (red)
  applyDefaultTheme() {
    this.applyTheme('red');
  }
  
  // Apply a specific theme
  applyTheme(themeName) {
    // Check if theme exists
    if (!this.themes[themeName]) {
      console.error(`Theme "${themeName}" not found.`);
      return;
    }
    
    // Save current theme name
    this.currentTheme = themeName;
    
    // Get theme colors
    const theme = this.themes[themeName];
    
    // Apply CSS variables to document root
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-secondary', theme.secondary);
    document.documentElement.style.setProperty('--color-tertiary', theme.tertiary);
    document.documentElement.style.setProperty('--text-color', theme.text);
    document.documentElement.style.setProperty('--background-color', theme.background);
    document.documentElement.style.setProperty('--loader-color', theme.loader);
    
    // Add special properties for scroll indicator gradient
    document.documentElement.style.setProperty('--loader-secondary-color', theme.secondary);
    
    // Save theme to local storage
    localStorage.setItem('portfolio-theme', themeName);
    
    // Add the theme-specific stylesheet
    this.addThemeStylesheet(themeName);
    
    // Update active theme indicator
    this.updateActiveThemeIndicator(themeName);
    
    // Trigger theme change event
    this.triggerThemeChangeEvent(themeName);
  }
  
  // Add theme-specific stylesheet
  addThemeStylesheet(themeName) {
    // Remove any existing theme stylesheets
    const existingLinks = document.querySelectorAll('link[data-theme]');
    existingLinks.forEach(link => {
      link.remove();
    });
    
    // Add new theme stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `css/color-${themeName}.css`;
    link.dataset.theme = themeName;
    document.head.appendChild(link);
  }
  
  // Update active theme indicator in the color selector
  updateActiveThemeIndicator(themeName) {
    // Remove active class from all theme options
    document.querySelectorAll('.colors a').forEach(link => {
      link.classList.remove('active-theme');
    });
    
    // Add active class to selected theme
    const activeThemeLink = document.querySelector(`.colors a[title="color-${themeName}"]`);
    if (activeThemeLink) {
      activeThemeLink.classList.add('active-theme');
    }
  }
  
  // Load saved theme from local storage
  loadSavedTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme && this.themes[savedTheme]) {
      this.applyTheme(savedTheme);
    }
  }
  
  // Set up event listeners for theme switching
  setupEventListeners() {
    // Find all theme color options
    document.querySelectorAll('.colors a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get theme name from title attribute
        const attr = link.getAttribute('title');
        if (attr && attr.startsWith('color-')) {
          const themeName = attr.replace('color-', '');
          this.applyTheme(themeName);
        }
      });
    });
  }
  
  // Trigger custom event when theme changes
  triggerThemeChangeEvent(themeName) {
    const event = new CustomEvent('themechange', {
      detail: {
        theme: themeName,
        colors: this.themes[themeName]
      }
    });
    document.dispatchEvent(event);
  }
  
  // Apply theme transition animation
  animateThemeTransition(oldTheme, newTheme) {
    // Add transition overlay
    const overlay = document.createElement('div');
    overlay.classList.add('theme-transition-overlay');
    document.body.appendChild(overlay);
    
    // Animate overlay
    anime({
      targets: overlay,
      opacity: [0, 1, 1, 0],
      duration: 800,
      easing: 'easeInOutQuad',
      complete: function() {
        document.body.removeChild(overlay);
      }
    });
  }
  
  // Get current theme colors
  getCurrentThemeColors() {
    return this.currentTheme ? this.themes[this.currentTheme] : this.themes.red;
  }
}

// Create and initialize color theme manager on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
  window.colorThemeManager = new ColorThemeManager();
  
  // Listen for theme change events
  document.addEventListener('themechange', function(e) {
    // Update cursor color to match theme
    const cursor = document.querySelector('.cursor');
    if (cursor) {
      cursor.style.backgroundColor = e.detail.colors.primary;
    }
    
    // Update scroll indicator color
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.style.background = `linear-gradient(90deg, ${e.detail.colors.primary} 0%, ${e.detail.colors.secondary} 100%)`;
    }
    
    // Apply subtle animation to all elements with the theme's color
    anime({
      targets: '.color, .colors, button, .button a button',
      scale: [1, 1.05, 1],
      duration: 500,
      easing: 'easeInOutQuad'
    });
  });
  
  // Apply smooth transition when switching between pages
  document.querySelectorAll('#home-link, #about-link, #portfolio-link, #contact-link, #blog-link').forEach(link => {
    link.addEventListener('click', function(e) {
      // Add page transition overlay
      const pageOverlay = document.createElement('div');
      pageOverlay.classList.add('page-transition-overlay');
      pageOverlay.style.backgroundColor = window.colorThemeManager.getCurrentThemeColors().primary;
      document.body.appendChild(pageOverlay);
      
      // Animate page transition
      anime({
        targets: pageOverlay,
        scaleX: [0, 1, 1, 0],
        easing: 'easeInOutExpo',
        duration: 1200,
        complete: function() {
          document.body.removeChild(pageOverlay);
        }
      });
    });
  });
});