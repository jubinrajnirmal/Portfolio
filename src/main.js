/**
 * Portfolio Website JavaScript
 * Vanilla JavaScript implementation for Jubin Raj Nirmal's portfolio
 * Features: Smooth scrolling, scrollspy, animations, mobile menu, data loading
 */

(() => {
  'use strict';

  // Configuration object for easy customization
  const CONFIG = {
    HEADER_OFFSET: 80,
    SCROLL_THRESHOLD: 100,
    ANIMATION_DURATION: 600,
    INTERSECTION_THRESHOLD: 0.1,
    INTERSECTION_ROOT_MARGIN: '0px 0px -50px 0px',
    SCROLLSPY_ROOT_MARGIN: '-100px 0px -50% 0px'
  };

  // State management object
  const state = {
    portfolioData: null,
    isLoading: true,
    activeSection: 'about',
    isMobileMenuOpen: false
  };

  /**
   * Utility Functions
   */

  /**
   * Safely query DOM element with error handling
   * @param {string} selector - CSS selector
   * @param {Element} parent - Parent element (optional)
   * @returns {Element|null} Found element or null
   */
  function safeQuerySelector(selector, parent = document) {
    try {
      return parent.querySelector(selector);
    } catch (error) {
      console.warn(`Error querying selector "${selector}":`, error);
      return null;
    }
  }

  /**
   * Safely query multiple DOM elements
   * @param {string} selector - CSS selector
   * @param {Element} parent - Parent element (optional)
   * @returns {NodeList} Found elements
   */
  function safeQuerySelectorAll(selector, parent = document) {
    try {
      return parent.querySelectorAll(selector);
    } catch (error) {
      console.warn(`Error querying selector "${selector}":`, error);
      return [];
    }
  }

  /**
   * Debounce function to limit function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Check if user prefers reduced motion
   * @returns {boolean} True if reduced motion is preferred
   */
  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Data Loading Functions
   */

  /**
   * Load portfolio data from JSON file
   * @returns {Promise<Object>} Portfolio data object
   */
  async function loadPortfolioData() {
    try {
      const response = await fetch('src/data.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Portfolio data loaded successfully');
      return data;
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      // Return fallback data structure
      return {
        about: {
          name: "Jubin Raj Nirmal",
          title: "Software Engineer & QA Developer",
          summary: "Detail-oriented software engineer with a Master's in Information Security, specializing in Quality Assurance and Testing.",
          location: "Canada",
          email: "contact@jubinrajnirmal.com",
          links: {
            github: "https://github.com/jubinrajnirmal",
            linkedin: "https://linkedin.com/in/jubinrajnirmal"
          }
        },
        experience: [],
        education: [],
        projects: [],
        certifications: [],
        hobbies: []
      };
    }
  }

  /**
   * Content Rendering Functions
   */

  /**
   * Render hero section content
   * @param {Object} aboutData - About section data
   */
  function renderHeroSection(aboutData) {
    const nameElement = safeQuerySelector('[data-testid="text-name"]');
    const surnameElement = safeQuerySelector('[data-testid="text-surname"]');
    const titleElement = safeQuerySelector('[data-testid="text-title"]');
    const summaryElement = safeQuerySelector('[data-testid="text-summary"]');
    const footerNameElement = safeQuerySelector('#footer-name');

    if (nameElement && surnameElement) {
      const nameParts = aboutData.name.split(' ');
      nameElement.textContent = nameParts.slice(0, -1).join(' ');
      surnameElement.textContent = nameParts[nameParts.length - 1];
    }

    if (titleElement) titleElement.textContent = aboutData.title;
    if (summaryElement) summaryElement.textContent = aboutData.summary;
    if (footerNameElement) footerNameElement.textContent = aboutData.name;
  }

  /**
   * Render experience timeline
   * @param {Array} experienceData - Experience data array
   */
  function renderExperience(experienceData) {
    const timelineContainer = safeQuerySelector('#experience-timeline');
    if (!timelineContainer) return;

    timelineContainer.innerHTML = '';

    experienceData.forEach((job, index) => {
      const isEven = index % 2 === 0;
      const dotClass = isEven ? 'primary' : 'secondary';
      const badgeClass = isEven ? 'primary' : 'secondary';

      const timelineItem = document.createElement('div');
      timelineItem.className = 'timeline-item fade-in';
      timelineItem.innerHTML = `
        <div class="timeline-dot ${dotClass}"></div>
        <div class="timeline-content">
          <div class="timeline-card glass-card">
            <h3 class="timeline-role" data-testid="text-role-${index}">${job.role}</h3>
            <h4 class="timeline-company" data-testid="text-company-${index}">${job.company}</h4>
            <p class="timeline-period" data-testid="text-period-${index}">${job.start} – ${job.end}</p>
            <ul class="timeline-highlights">
              ${job.highlights.map((highlight, i) => `<li data-testid="text-highlight-${index}-${i}">${highlight}</li>`).join('')}
            </ul>
            <div class="timeline-badges">
              ${job.stack.map((tech, i) => `<span class="badge ${badgeClass}" data-testid="badge-${index}-${i}">${tech}</span>`).join('')}
            </div>
          </div>
        </div>
      `;

      timelineContainer.appendChild(timelineItem);
    });
  }

  /**
   * Render education section
   * @param {Array} educationData - Education data array
   */
  function renderEducation(educationData) {
    const educationGrid = safeQuerySelector('#education-grid');
    if (!educationGrid) return;

    educationGrid.innerHTML = '';

    educationData.forEach((edu, index) => {
      const isMasters = edu.degree.toLowerCase().includes('master');
      const cardClass = isMasters ? 'primary' : 'secondary';

      const eduCard = document.createElement('div');
      eduCard.className = 'card glass-card fade-in';
      eduCard.innerHTML = `
        <h3 class="card-title ${isMasters ? 'accent-text' : ''}" data-testid="text-degree-${index}">${edu.degree}</h3>
        <h4 class="card-subtitle" data-testid="text-field-${index}">${edu.field || ''}</h4>
        <p class="card-meta" data-testid="text-school-${index}">${edu.school}</p>
        <p class="card-meta" data-testid="text-edu-period-${index}">${edu.start} – ${edu.end}</p>
        ${edu.notes && edu.notes.length > 0 ? `
          <div>
            <h5>Key Coursework:</h5>
            <ul class="timeline-highlights">
              ${edu.notes.map((note, i) => `<li data-testid="text-coursework-${index}-${i}">${note}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      `;

      educationGrid.appendChild(eduCard);
    });
  }

  /**
   * Render projects section
   * @param {Array} projectsData - Projects data array
   */
  function renderProjects(projectsData) {
    const projectsGrid = safeQuerySelector('#projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = '';

    projectsData.forEach((project, index) => {
      const iconClass = index % 2 === 0 ? 'primary' : 'secondary';

      const projectCard = document.createElement('div');
      projectCard.className = 'card glass-card fade-in';
      projectCard.innerHTML = `
        <div class="card-icon ${iconClass}">
          ${getProjectIcon(project.name)}
        </div>
        <h3 class="card-title" data-testid="text-project-title-${index}">${project.name}</h3>
        <p class="card-description" data-testid="text-project-description-${index}">${project.description}</p>
        <div class="card-tags">
          ${project.stack.map((tech, i) => `<span class="badge ${iconClass}" data-testid="badge-project-${index}-${i}">${tech}</span>`).join('')}
        </div>
        <div class="card-actions">
          ${project.links.github ? `<a href="${project.links.github}" class="card-link" data-testid="link-github-${index}" target="_blank" rel="noopener noreferrer">View Code</a>` : ''}
          ${project.links.demo ? `<a href="${project.links.demo}" class="card-link secondary" data-testid="link-demo-${index}" target="_blank" rel="noopener noreferrer">Live Demo</a>` : ''}
        </div>
      `;

      projectsGrid.appendChild(projectCard);
    });
  }

  /**
   * Render certifications section
   * @param {Array} certificationsData - Certifications data array
   */
  function renderCertifications(certificationsData) {
    const certificationsGrid = safeQuerySelector('#certifications-grid');
    if (!certificationsGrid) return;

    certificationsGrid.innerHTML = '';

    certificationsData.forEach((cert, index) => {
      const iconClass = index % 2 === 0 ? 'primary' : 'secondary';

      const certCard = document.createElement('div');
      certCard.className = 'cert-card glass-card fade-in';
      certCard.innerHTML = `
        <div class="cert-icon ${iconClass}">
          ${getCertificationIcon(cert.name)}
        </div>
        <h3 class="cert-name" data-testid="text-cert-name-${index}">${cert.name}</h3>
        <p class="cert-issuer" data-testid="text-cert-issuer-${index}">${cert.issuer}</p>
        <p class="cert-year ${iconClass === 'primary' ? 'accent-text' : ''}" data-testid="text-cert-year-${index}">${cert.year}</p>
      `;

      certificationsGrid.appendChild(certCard);
    });
  }

  /**
   * Render hobbies section
   * @param {Array} hobbiesData - Hobbies data array
   */
  function renderHobbies(hobbiesData) {
    const hobbiesContainer = safeQuerySelector('#hobbies-list');
    if (!hobbiesContainer) return;

    hobbiesContainer.innerHTML = '';

    const hobbiesWrapper = document.createElement('div');
    hobbiesWrapper.className = 'hobbies-list fade-in';

    hobbiesData.forEach((hobby, index) => {
      const hobbyItem = document.createElement('div');
      hobbyItem.className = 'hobby-item glass-card';
      hobbyItem.innerHTML = `
        <svg class="hobby-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span data-testid="text-hobby-${index}">${hobby}</span>
      `;
      hobbiesWrapper.appendChild(hobbyItem);
    });

    hobbiesContainer.appendChild(hobbiesWrapper);
  }

  /**
   * Render contact methods
   * @param {Object} contactData - Contact data object
   */
  function renderContactMethods(contactData) {
    const contactMethodsContainer = safeQuerySelector('#contact-methods');
    if (!contactMethodsContainer) return;

    const methods = [
      {
        title: 'Email',
        value: contactData.email,
        icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>`,
        class: 'primary'
      },
      {
        title: 'LinkedIn',
        value: contactData.links.linkedin.replace('https://', ''),
        icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 8v10a2 2 0 002 2h4a2 2 0 002-2V8"></path>`,
        class: 'secondary'
      },
      {
        title: 'GitHub',
        value: contactData.links.github.replace('https://', ''),
        icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>`,
        class: 'primary'
      }
    ];

    contactMethodsContainer.innerHTML = methods.map((method, index) => `
      <div class="contact-method">
        <div class="contact-method-icon ${method.class}">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            ${method.icon}
          </svg>
        </div>
        <h3 class="contact-method-title" data-testid="text-contact-${method.title.toLowerCase()}-title">${method.title}</h3>
        <p class="contact-method-value" data-testid="text-contact-${method.title.toLowerCase()}-value">${method.value}</p>
      </div>
    `).join('');
  }

  /**
   * Icon Helper Functions
   */

  /**
   * Get project icon based on project name
   * @param {string} projectName - Name of the project
   * @returns {string} SVG icon HTML
   */
  function getProjectIcon(projectName) {
    const iconMap = {
      'test': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>`,
      'infrastructure': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>`,
      'security': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>`,
      'default': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>`
    };

    const lowerName = projectName.toLowerCase();
    if (lowerName.includes('test') || lowerName.includes('automation')) return iconMap.test;
    if (lowerName.includes('infrastructure') || lowerName.includes('terraform') || lowerName.includes('docker')) return iconMap.infrastructure;
    if (lowerName.includes('security') || lowerName.includes('soc') || lowerName.includes('compliance')) return iconMap.security;
    return iconMap.default;
  }

  /**
   * Get certification icon based on certification name
   * @param {string} certName - Name of the certification
   * @returns {string} SVG icon HTML
   */
  function getCertificationIcon(certName) {
    const iconMap = {
      'security': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>`,
      'cloud': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>`,
      'lock': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>`,
      'database': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>`,
      'server': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>`,
      'default': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>`
    };

    const lowerName = certName.toLowerCase();
    if (lowerName.includes('security') || lowerName.includes('cybersecurity')) return iconMap.security;
    if (lowerName.includes('azure') || lowerName.includes('cloud')) return iconMap.cloud;
    if (lowerName.includes('isc2') || lowerName.includes('fortinet')) return iconMap.lock;
    if (lowerName.includes('sql') || lowerName.includes('database')) return iconMap.database;
    if (lowerName.includes('deploy') || lowerName.includes('configure')) return iconMap.server;
    return iconMap.default;
  }

  /**
   * Navigation Functions
   */

  /**
   * Initialize smooth scrolling for navigation links
   */
  function initSmoothScrolling() {
    const navLinks = safeQuerySelectorAll('.nav-link, .nav-link-mobile');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = safeQuerySelector(`#${targetId}`);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - CONFIG.HEADER_OFFSET;
          window.scrollTo({
            top: offsetTop,
            behavior: prefersReducedMotion() ? 'auto' : 'smooth'
          });

          // Close mobile menu if open
          if (state.isMobileMenuOpen) {
            closeMobileMenu();
          }

          // Update active section
          state.activeSection = targetId;
          updateActiveNavLink(targetId);
        }
      });
    });
  }

  /**
   * Initialize scrollspy functionality using Intersection Observer
   */
  function initScrollspy() {
    const sections = safeQuerySelectorAll('section[id]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          state.activeSection = sectionId;
          updateActiveNavLink(sectionId);
        }
      });
    }, {
      rootMargin: CONFIG.SCROLLSPY_ROOT_MARGIN,
      threshold: CONFIG.INTERSECTION_THRESHOLD
    });

    sections.forEach(section => {
      observer.observe(section);
    });
  }

  /**
   * Update active navigation link
   * @param {string} activeId - ID of the active section
   */
  function updateActiveNavLink(activeId) {
    const navLinks = safeQuerySelectorAll('.nav-link, .nav-link-mobile');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /**
   * Animation Functions
   */

  /**
   * Initialize fade-in animations using Intersection Observer
   */
  function initFadeInAnimations() {
    if (prefersReducedMotion()) {
      // Show all elements immediately if reduced motion is preferred
      const fadeElements = safeQuerySelectorAll('.fade-in');
      fadeElements.forEach(element => {
        element.classList.add('visible');
      });
      return;
    }

    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: CONFIG.INTERSECTION_THRESHOLD,
      rootMargin: CONFIG.INTERSECTION_ROOT_MARGIN
    });

    // Observe existing fade elements
    const existingFadeElements = safeQuerySelectorAll('.fade-in');
    existingFadeElements.forEach(element => {
      fadeObserver.observe(element);
    });

    // Store observer reference for future use
    window.portfolioFadeObserver = fadeObserver;
  }

  /**
   * Mobile Menu Functions
   */

  /**
   * Initialize mobile menu functionality
   */
  function initMobileMenu() {
    const mobileMenuBtn = safeQuerySelector('#mobile-menu-btn');
    const mobileMenu = safeQuerySelector('#nav-mobile');

    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (state.isMobileMenuOpen && 
          !mobileMenu.contains(e.target) && 
          !mobileMenuBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.isMobileMenuOpen) {
        closeMobileMenu();
      }
    });
  }

  /**
   * Toggle mobile menu
   */
  function toggleMobileMenu() {
    const mobileMenu = safeQuerySelector('#nav-mobile');
    if (!mobileMenu) return;

    if (state.isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  function openMobileMenu() {
    const mobileMenu = safeQuerySelector('#nav-mobile');
    const mobileMenuBtn = safeQuerySelector('#mobile-menu-btn');
    
    if (mobileMenu) {
      mobileMenu.classList.remove('hidden');
      state.isMobileMenuOpen = true;
      
      if (mobileMenuBtn) {
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      }
    }
  }

  /**
   * Close mobile menu
   */
  function closeMobileMenu() {
    const mobileMenu = safeQuerySelector('#nav-mobile');
    const mobileMenuBtn = safeQuerySelector('#mobile-menu-btn');
    
    if (mobileMenu) {
      mobileMenu.classList.add('hidden');
      state.isMobileMenuOpen = false;
      
      if (mobileMenuBtn) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    }
  }

  /**
   * Scroll Functions
   */

  /**
   * Initialize back to top button
   */
  function initBackToTop() {
    const backToTopBtn = safeQuerySelector('#back-to-top');
    if (!backToTopBtn) return;

    const debouncedScrollHandler = debounce(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > CONFIG.SCROLL_THRESHOLD) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });
    });
  }

  /**
   * Initialize header shrink effect on scroll
   */
  function initHeaderEffects() {
    const header = safeQuerySelector('#header');
    if (!header) return;

    const debouncedScrollHandler = debounce(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > CONFIG.SCROLL_THRESHOLD) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);
  }

  /**
   * Event Handler Functions
   */

  /**
   * Initialize contact and download buttons
   */
  function initButtonHandlers() {
    // Download resume buttons
    const downloadBtns = safeQuerySelectorAll('[data-testid="button-download-resume"], [data-testid="button-download-resume-footer"]');
    downloadBtns.forEach(btn => {
      btn.addEventListener('click', handleDownloadResume);
    });

    // Contact button
    const contactBtn = safeQuerySelector('[data-testid="button-contact"]');
    if (contactBtn) {
      contactBtn.addEventListener('click', handleContactClick);
    }

    // Email button
    const emailBtn = safeQuerySelector('[data-testid="button-email"]');
    if (emailBtn) {
      emailBtn.addEventListener('click', handleEmailClick);
    }
  }

  /**
   * Handle resume download
   */
  function handleDownloadResume() {
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = 'assets/resume.pdf'; // TODO: Add actual resume PDF file
    link.download = 'Jubin_Raj_Nirmal_Resume.pdf';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Resume download initiated');
  }

  /**
   * Handle contact button click
   */
  function handleContactClick() {
    const contactSection = safeQuerySelector('#contact');
    if (contactSection) {
      const offsetTop = contactSection.offsetTop - CONFIG.HEADER_OFFSET;
      window.scrollTo({
        top: offsetTop,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });
    }
  }

  /**
   * Handle email button click
   */
  function handleEmailClick() {
    if (state.portfolioData && state.portfolioData.about.email) {
      window.location.href = `mailto:${state.portfolioData.about.email}`;
    }
  }

  /**
   * Hash Routing Functions
   */

  /**
   * Initialize hash routing support
   */
  function initHashRouting() {
    // Handle initial hash on page load
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetElement = safeQuerySelector(`#${targetId}`);
      
      if (targetElement) {
        setTimeout(() => {
          const offsetTop = targetElement.offsetTop - CONFIG.HEADER_OFFSET;
          window.scrollTo({
            top: offsetTop,
            behavior: prefersReducedMotion() ? 'auto' : 'smooth'
          });
        }, 100);
      }
    }

    // Update hash when scrolling to sections
    window.addEventListener('hashchange', () => {
      if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = safeQuerySelector(`#${targetId}`);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - CONFIG.HEADER_OFFSET;
          window.scrollTo({
            top: offsetTop,
            behavior: prefersReducedMotion() ? 'auto' : 'smooth'
          });
        }
      }
    });
  }

  /**
   * Main Initialization Functions
   */

  /**
   * Render all content based on loaded data
   * @param {Object} data - Portfolio data object
   */
  function renderAllContent(data) {
    try {
      renderHeroSection(data.about);
      renderExperience(data.experience);
      renderEducation(data.education);
      renderProjects(data.projects);
      renderCertifications(data.certifications);
      renderHobbies(data.hobbies);
      renderContactMethods(data.about);
      
      // Update current year in footer
      const currentYearElement = safeQuerySelector('#current-year');
      if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear().toString();
      }

      console.log('All content rendered successfully');
    } catch (error) {
      console.error('Error rendering content:', error);
    }
  }

  /**
   * Initialize all functionality
   */
  async function init() {
    try {
      console.log('Initializing portfolio...');

      // Load portfolio data
      state.portfolioData = await loadPortfolioData();
      state.isLoading = false;

      // Render content
      renderAllContent(state.portfolioData);

      // Initialize navigation and interactions
      initSmoothScrolling();
      initScrollspy();
      initMobileMenu();
      initBackToTop();
      initHeaderEffects();
      initButtonHandlers();
      initHashRouting();

      // Initialize animations (after a short delay to ensure content is rendered)
      setTimeout(() => {
        initFadeInAnimations();
        
        // Trigger animation for initially visible elements
        const observer = window.portfolioFadeObserver;
        if (observer) {
          const newFadeElements = safeQuerySelectorAll('.fade-in:not(.visible)');
          newFadeElements.forEach(element => {
            observer.observe(element);
          });
        }
      }, 100);

      console.log('Portfolio initialized successfully');

    } catch (error) {
      console.error('Error initializing portfolio:', error);
      
      // Show error message to user
      const heroTitle = safeQuerySelector('[data-testid="text-hero-title"]');
      if (heroTitle) {
        heroTitle.textContent = 'Error loading portfolio data';
      }
    }
  }

  /**
   * Error Handling
   */
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });

  /**
   * Initialize when DOM is ready
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /**
   * Expose some functions for testing and debugging
   */
  if (typeof window !== 'undefined') {
    window.portfolio = {
      state,
      loadPortfolioData,
      renderAllContent,
      CONFIG
    };
  }

})();
