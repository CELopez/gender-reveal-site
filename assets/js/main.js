// Main JavaScript for Gender Reveal Site

document.addEventListener('DOMContentLoaded', function() {
    // Initialize main page functionality
    initMainPage();
});

function initMainPage() {
    // Add smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover effects to preview elements
    const slotReels = document.querySelectorAll('.slot-reel');
    slotReels.forEach((reel, index) => {
        reel.addEventListener('mouseenter', function() {
            // Add subtle animation on hover
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        reel.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add interactive preview animation
    let previewInterval;
    const slotPreview = document.querySelector('.slot-preview');
    
    if (slotPreview) {
        slotPreview.addEventListener('mouseenter', function() {
            startPreviewAnimation();
        });
        
        slotPreview.addEventListener('mouseleave', function() {
            stopPreviewAnimation();
        });
    }

    function startPreviewAnimation() {
        const reels = document.querySelectorAll('.slot-preview .preview-reel-item');
        const symbols = ['B', 'O', 'Y', 'G', 'I', 'R', 'L', '★', '♦', '?'];
        let animationStep = 0;
        
        previewInterval = setInterval(() => {
            reels.forEach((reel, index) => {
                // Create a more realistic slot machine effect
                const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                reel.textContent = randomSymbol;
                
                // Add spinning effect
                reel.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    reel.style.transform = 'translateY(0)';
                }, 100);
            });
            
            animationStep++;
            
            // After some spins, show the final result
            if (animationStep > 15) {
                clearInterval(previewInterval);
                showPreviewResult();
            }
        }, 150);
    }

    function showPreviewResult() {
        const reels = document.querySelectorAll('.slot-preview .preview-reel-item');
        const results = ['B', 'O', 'Y'];
        
        reels.forEach((reel, index) => {
            setTimeout(() => {
                reel.textContent = results[index];
                reel.style.background = 'linear-gradient(45deg, #ffd700, #ffed4e)';
                reel.style.color = '#1f2937';
                reel.style.borderRadius = '8px';
                reel.style.transform = 'scale(1.1)';
                
                setTimeout(() => {
                    reel.style.transform = 'scale(1)';
                }, 300);
            }, index * 200);
        });
        
        // Reset after a delay
        setTimeout(() => {
            stopPreviewAnimation();
        }, 2000);
    }

    function stopPreviewAnimation() {
        clearInterval(previewInterval);
        const reels = document.querySelectorAll('.slot-preview .preview-reel-item');
        reels.forEach(reel => {
            reel.textContent = '?';
            reel.style.background = '';
            reel.style.color = '';
            reel.style.borderRadius = '';
            reel.style.transform = '';
        });
    }

    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.bg-gradient-to-br');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Initialize analytics (placeholder for future implementation)
    initAnalytics();
}

function initAnalytics() {
    // Placeholder for analytics initialization
    // This can be replaced with actual analytics code later
    console.log('Analytics initialized');
    
    // Track page view
    trackEvent('page_view', {
        page: 'landing',
        timestamp: new Date().toISOString()
    });
}

function trackEvent(eventName, properties) {
    // Placeholder for event tracking
    console.log('Event tracked:', eventName, properties);
    
    // This is where you would integrate with analytics services like:
    // - Google Analytics
    // - PostHog
    // - Plausible
    // - etc.
}

// Utility function for smooth page transitions
function navigateToPage(url) {
    // Add fade effect before navigation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// Export functions for global use
window.navigateToPage = navigateToPage;
window.trackEvent = trackEvent;