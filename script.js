document.addEventListener('DOMContentLoaded', function() {
    
    // ========== Feature Flags ========== //
    
    const FEATURES = {
        SHOW_SOURCE_CODE: false,
        SHOW_DEMO_VIDEO: false,
        ENABLE_ANALYTICS: false
    };
    
    // 📝 Current Configuration:
    // - Entire Manual Installation section: HIDDEN
    // - Installation section title: "Get Notified" instead of "Easy Installation"
    // - Hero CTA button: "Get Notified" instead of "Install Extension"
    // - Community engagement section: SHOWN
    // - Main GitHub link redirects to: Discussions page
    // - Navigation button shows: "Discussions" instead of "GitHub"
    
    function applyFeatureFlags() {
        // Hide/show source code related elements
        const sourceCodeElements = document.querySelectorAll('[data-feature="source-code"]');
        sourceCodeElements.forEach(element => {
            if (FEATURES.SHOW_SOURCE_CODE) {
                element.style.display = '';
                element.classList.remove('feature-disabled');
            } else {
                element.style.display = 'none';
                element.classList.add('feature-disabled');
            }
        });
        
        // Show/hide alternative content when source code is not available
        const altElements = document.querySelectorAll('[data-feature-alt="source-code"]');
        altElements.forEach(element => {
            if (FEATURES.SHOW_SOURCE_CODE) {
                element.style.display = 'none';
            } else {
                element.style.display = '';
            }
        });
        
        // Update GitHub links based on source code availability
        const githubLinks = document.querySelectorAll('a[href*="github.com/cHAuHaNz/Frame.io-Comments-Sync"]');
        githubLinks.forEach(link => {
            if (!FEATURES.SHOW_SOURCE_CODE && !link.href.includes('/issues') && !link.href.includes('/discussions')) {
                // Redirect main repo links to discussions page when source code is hidden
                if (link.href === 'https://github.com/cHAuHaNz/Frame.io-Comments-Sync') {
                    link.href = 'https://github.com/cHAuHaNz/Frame.io-Comments-Sync/discussions';
                    link.title = 'Go to discussions and provide feedback';
                }
            }
        });
        
        // Update button text for non-source code access
        const mainGithubBtn = document.querySelector('.nav-cta .btn-outline');
        if (mainGithubBtn && !FEATURES.SHOW_SOURCE_CODE) {
            mainGithubBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
                </svg>
                Discussions
            `;
            mainGithubBtn.title = 'Go to discussions and provide feedback';
        }
    }
    
    // Apply feature flags immediately
    applyFeatureFlags();
    
    // ========== Navigation ========== //
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    
    function handleNavbarScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide navbar on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }
    
    // Throttled scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleNavbarScroll, 10);
    });
    
    // Mobile hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        // Toggle menu
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking on links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on window resize (if going to desktop)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Smooth scrolling for navigation links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========== Animations and Effects ========== //
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add staggered animation delay for feature cards
                if (entry.target.classList.contains('feature-card')) {
                    const cards = entry.target.parentElement.querySelectorAll('.feature-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                }
                
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Apply fade-in animation to elements
    const fadeElements = document.querySelectorAll('.feature-card, .support-card, .demo-step');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        fadeInObserver.observe(el);
    });
    
    // ========== Interactive Elements ========== //
    
    // Feature card hover effects
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Button hover effects with ripple animation
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple CSS dynamically
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // ========== Dynamic Content ========== //
    
    // Animated counter for hero stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = counter.textContent;
            const numericValue = parseInt(target.replace(/[^\d]/g, ''));
            
            if (!isNaN(numericValue)) {
                let current = 0;
                const increment = numericValue / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= numericValue) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        const suffix = target.replace(/[\d]/g, '');
                        counter.textContent = Math.floor(current) + suffix;
                    }
                }, 40);
            }
        });
    }
    
    // Trigger counter animation when hero section is visible
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(animateCounters, 1000);
                    heroObserver.unobserve(entry.target);
                }
            });
        });
        heroObserver.observe(heroSection);
    }
    
    // ========== Demo Video Interaction ========== //
    
    const videoPlaceholder = document.querySelector('.video-placeholder');
    const playButton = document.querySelector('.play-button');
    
    if (playButton && videoPlaceholder) {
        playButton.addEventListener('click', function() {
            // Placeholder for video functionality
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                // Here you would typically load and play the actual video
                showNotification('Demo video coming soon!', 'info');
            }, 150);
        });
    }
    
    // ========== Particle Animation ========== //
    
    function createParticles() {
        const particlesContainer = document.querySelector('.hero-particles');
        if (!particlesContainer) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float-particle ${Math.random() * 10 + 10}s linear infinite;
                pointer-events: none;
            `;
            particlesContainer.appendChild(particle);
        }
    }
    
    // Add particle animation CSS
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes float-particle {
            0% {
                transform: translateY(100vh) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particleStyle);
    
    // Initialize particles
    createParticles();
    
    // ========== Utility Functions ========== //
    
    // Notification system
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #5B53FF, #667eea)' : 'linear-gradient(135deg, #667eea, #764ba2)'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 12px 40px rgba(31, 38, 135, 0.25);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
            max-width: 300px;
            font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // ========== CSV Preview Animation ========== //
    
    const csvRows = document.querySelectorAll('.csv-row:not(.header)');
    if (csvRows.length > 0) {
        let currentRow = 0;
        
        function animateCSVRows() {
            csvRows.forEach((row, index) => {
                row.style.opacity = index === currentRow ? '1' : '0.4';
                row.style.transform = index === currentRow ? 'scale(1.02)' : 'scale(1)';
            });
            
            currentRow = (currentRow + 1) % csvRows.length;
        }
        
        // Start CSV animation after a delay
        setTimeout(() => {
            setInterval(animateCSVRows, 2000);
        }, 2000);
    }
    
    // ========== Installation Steps Animation ========== //
    
    const steps = document.querySelectorAll('.step');
    if (steps.length > 0) {
        let currentStep = 0;
        
        function highlightStep() {
            steps.forEach((step, index) => {
                const stepNumber = step.querySelector('.step-number');
                if (index === currentStep) {
                    stepNumber.style.background = 'linear-gradient(135deg, #5B53FF, #667eea)';
                    stepNumber.style.transform = 'scale(1.1)';
                    step.style.opacity = '1';
                } else if (index < currentStep) {
                    stepNumber.style.background = 'linear-gradient(135deg, #27ca3f, #20bf6b)';
                    stepNumber.style.transform = 'scale(1)';
                    step.style.opacity = '0.7';
                } else {
                    stepNumber.style.background = 'rgba(255, 255, 255, 0.2)';
                    stepNumber.style.transform = 'scale(1)';
                    step.style.opacity = '0.5';
                }
            });
            
            currentStep = (currentStep + 1) % (steps.length + 1);
            if (currentStep === 0) {
                setTimeout(highlightStep, 2000); // Longer pause before restart
            }
        }
        
        // Start step animation when installation section is visible
        const installationSection = document.querySelector('.installation');
        if (installationSection) {
            const installationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            setInterval(highlightStep, 1500);
                        }, 1000);
                        installationObserver.unobserve(entry.target);
                    }
                });
            });
            installationObserver.observe(installationSection);
        }
    }
    
    // ========== Copy to Clipboard Functionality ========== //
    
    const codeElements = document.querySelectorAll('code');
    codeElements.forEach(code => {
        code.style.cursor = 'pointer';
        code.title = 'Click to copy';
        
        code.addEventListener('click', function() {
            const text = this.textContent;
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Copied to clipboard!', 'success');
                
                // Visual feedback
                const originalBg = this.style.background;
                this.style.background = 'rgba(91, 83, 255, 0.3)';
                setTimeout(() => {
                    this.style.background = originalBg;
                }, 200);
            }).catch(() => {
                showNotification('Failed to copy', 'error');
            });
        });
    });
    
    // ========== Scroll Progress Indicator ========== //
    
    function createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #5B53FF, #667eea, #764ba2);
            z-index: 10001;
            transition: width 0.1s ease-out;
        `;
        document.body.appendChild(progressBar);
        
        function updateProgress() {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = Math.min(scrolled, 100) + '%';
        }
        
        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Initial call
    }
    
    createScrollProgress();
    
    // ========== Lazy Loading for Images ========== //
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // ========== Performance Monitoring ========== //
    
    // Simple performance logging (can be removed in production)
    if (window.performance && window.performance.mark) {
        window.performance.mark('website-interactive');
        
        window.addEventListener('load', () => {
            window.performance.mark('website-loaded');
            
            // Log some basic performance metrics
            const paintMetrics = performance.getEntriesByType('paint');
            const navigationMetrics = performance.getEntriesByType('navigation')[0];
            
            console.group('🚀 Website Performance');
            console.log('DOM Content Loaded:', navigationMetrics.domContentLoadedEventEnd - navigationMetrics.domContentLoadedEventStart, 'ms');
            console.log('Load Complete:', navigationMetrics.loadEventEnd - navigationMetrics.loadEventStart, 'ms');
            if (paintMetrics.length > 0) {
                paintMetrics.forEach(metric => {
                    console.log(`${metric.name}:`, metric.startTime.toFixed(2), 'ms');
                });
            }
            console.groupEnd();
        });
    }
    
    // ========== Error Handling ========== //
    
    window.addEventListener('error', function(e) {
        console.error('Website Error:', e.error);
    });
    
    // ========== Initialization Complete ========== //
    
    console.log('🎉 Frame.io Comment Sync website initialized successfully!');
    
    // Add some Easter eggs for developers
    const styles = [
        'background: linear-gradient(135deg, #5B53FF, #667eea)',
        'color: white',
        'padding: 12px 20px',
        'border-radius: 8px',
        'font-weight: bold',
        'font-size: 14px'
    ].join(';');
    
    console.log('%c🚀 Frame.io Comment Sync', styles);
    console.log('Thanks for checking out the source code! 🎬\nCreated with ❤️ by cHAuHaN\nGitHub: https://github.com/cHAuHaNz');
});