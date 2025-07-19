// Main JavaScript for Gender Reveal Site
// Handles global functionality and landing page interactions

document.addEventListener('DOMContentLoaded', function() {
    initLandingPage();
});

function initLandingPage() {
    // Initialize slot machine preview animations
    initSlotPreview();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize intersection observer for animations
    initScrollAnimations();
    
    // Track page view
    if (typeof trackEvent === 'function') {
        trackEvent('page_view', {
            page: 'landing'
        });
    }
}

function initSlotPreview() {
    const slotPreview = document.querySelector('.slot-preview');
    const reelItems = document.querySelectorAll('.preview-reel-item');
    
    if (!slotPreview || reelItems.length === 0) return;
    
    // Add interactive hover effects
    slotPreview.addEventListener('mouseenter', function() {
        startPreviewAnimation();
    });
    
    slotPreview.addEventListener('mouseleave', function() {
        resetPreviewAnimation();
    });
    
    // Auto-demo every 5 seconds
    setInterval(() => {
        if (!slotPreview.matches(':hover')) {
            demoPreviewAnimation();
        }
    }, 5000);
}

function startPreviewAnimation() {
    const reelItems = document.querySelectorAll('.preview-reel-item');
    const symbols = ['B', 'O', 'Y', '?', 'G', 'I', 'R', 'L'];
    
    reelItems.forEach((item, index) => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            item.textContent = symbols[currentIndex % symbols.length];
            currentIndex++;
            
            if (currentIndex > 8) {
                clearInterval(interval);
                // Show final reveal after animation
                setTimeout(() => {
                    const finalSymbols = Math.random() > 0.5 ? ['B', 'O', 'Y'] : ['G', 'I', 'R'];
                    item.textContent = finalSymbols[index] || '?';
                    item.style.color = Math.random() > 0.5 ? '#3b82f6' : '#ec4899';
                    
                    // Reset after showing result
                    setTimeout(() => {
                        item.textContent = '?';
                        item.style.color = '';
                    }, 2000);
                }, 500);
            }
        }, 150 + (index * 50)); // Staggered timing
    });
}

function resetPreviewAnimation() {
    const reelItems = document.querySelectorAll('.preview-reel-item');
    reelItems.forEach(item => {
        item.textContent = '?';
        item.style.color = '';
    });
}

function demoPreviewAnimation() {
    const slotPreview = document.querySelector('.slot-preview');
    if (slotPreview) {
        // Add temporary demo class for styling
        slotPreview.classList.add('demo-active');
        
        startPreviewAnimation();
        
        setTimeout(() => {
            slotPreview.classList.remove('demo-active');
        }, 3000);
    }
}

function initSmoothScrolling() {
    // Add smooth scrolling to anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initScrollAnimations() {
    // Create intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.grid > div, .bg-white, h2, h3');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Enhanced button interactions
function addButtonEnhancements() {
    const buttons = document.querySelectorAll('button, .btn, a[href*="choose"]');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('click', function() {
            // Add click ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add some CSS for scroll animations and ripple effects
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .demo-active {
        animation: demoGlow 3s ease-in-out;
    }
    
    @keyframes demoGlow {
        0%, 100% { box-shadow: 0 0 0 rgba(139, 92, 246, 0); }
        50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.5); }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize button enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    addButtonEnhancements();
});

// Analytics and tracking functions
function trackEvent(event, data) {
    // Basic console logging for now
    console.log('Event:', event, 'Data:', data);
    
    // Here you could integrate with Google Analytics, Mixpanel, etc.
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', event, data);
    // }
}

// Global functions
window.trackEvent = trackEvent;