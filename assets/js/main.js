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
    const handleGrip = document.querySelector('.handle-grip');
    
    if (!slotPreview) return;
    
    // Add handle click interaction
    if (handleGrip) {
        handleGrip.addEventListener('click', function(e) {
            e.preventDefault();
            // Add pull animation
            this.style.transform = 'translateY(12px) scale(0.95)';
            this.style.transition = 'transform 0.1s ease';
            
            setTimeout(() => {
                this.style.transform = '';
                this.style.transition = '';
                startPreviewAnimation();
            }, 150);
        });
        
        // Add cursor pointer
        handleGrip.style.cursor = 'pointer';
        handleGrip.title = 'Click to spin!';
    }
    
    // Add interactive hover effects
    slotPreview.addEventListener('mouseenter', function() {
        // Don't auto-start on hover anymore, let user click handle
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    slotPreview.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.transition = '';
    });
    
    // Auto-demo every 8 seconds (less frequent since we have click interaction)
    setInterval(() => {
        if (!slotPreview.matches(':hover')) {
            demoPreviewAnimation();
        }
    }, 8000);
}

function startPreviewAnimation() {
    const reelStrips = document.querySelectorAll('.preview-reel-strip');
    const slotPreview = document.querySelector('.slot-preview');
    const isGirl = Math.random() > 0.5; // Randomly choose between boy and girl
    const targetWord = isGirl ? ['G', 'I', 'R'] : ['B', 'O', 'Y'];
    const allLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    
    // Add spinning effect to the whole machine
    if (slotPreview) {
        slotPreview.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.5)';
        slotPreview.style.transition = 'box-shadow 0.3s ease';
    }
    
    let reelsSpinning = 0;
    const totalReels = reelStrips.length;
    
    reelStrips.forEach((strip, reelIndex) => {
        // Clear existing animation
        strip.style.transition = 'none';
        strip.style.transform = 'translateY(0)';
        
        // Create spinning letters for this reel
        const items = strip.children;
        
        // Fill with random letters first, then target letter
        for (let i = 0; i < items.length - 1; i++) {
            items[i].textContent = allLetters[Math.floor(Math.random() * allLetters.length)];
        }
        
        // Set the target letter for this reel position
        if (targetWord[reelIndex]) {
            items[items.length - 1].textContent = targetWord[reelIndex];
        }
        
        reelsSpinning++;
        
        // Start spinning animation with delay for each reel
        setTimeout(() => {
            // Fast spinning first
            let spinCount = 0;
            const maxSpins = 15 + (reelIndex * 5); // Different spin counts for each reel
            
            // Add spinning visual effect to this reel
            const reelContainer = strip.closest('.slot-reel-preview');
            if (reelContainer) {
                reelContainer.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
                reelContainer.style.transform = 'scale(1.05)';
            }
            
            const spinInterval = setInterval(() => {
                // Rotate through random letters quickly
                for (let i = 0; i < items.length - 1; i++) {
                    items[i].textContent = allLetters[Math.floor(Math.random() * allLetters.length)];
                }
                
                spinCount++;
                
                if (spinCount >= maxSpins) {
                    clearInterval(spinInterval);
                    
                    // Stop at target position after a brief moment
                    setTimeout(() => {
                        // Calculate final position to show target letter
                        const targetPosition = -(items.length - 1) * 80; // 80px per item
                        strip.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        strip.style.transform = `translateY(${targetPosition}px)`;
                        
                        // Remove spinning effect from this reel
                        if (reelContainer) {
                            reelContainer.style.boxShadow = '';
                            reelContainer.style.transform = '';
                            reelContainer.style.transition = 'all 0.3s ease';
                        }
                        
                        // Add winning glow effect
                        setTimeout(() => {
                            const targetItem = items[items.length - 1];
                            targetItem.style.color = isGirl ? '#ec4899' : '#3b82f6';
                            targetItem.style.textShadow = `0 0 10px ${isGirl ? '#ec4899' : '#3b82f6'}`;
                            targetItem.style.transform = 'scale(1.1)';
                            targetItem.style.transition = 'all 0.3s ease';
                        }, 800);
                        
                        reelsSpinning--;
                        if (reelsSpinning === 0) {
                            // All reels stopped, show final celebration
                            setTimeout(() => {
                                showPreviewCelebration(isGirl);
                            }, 1000);
                        }
                    }, 200);
                }
            }, 100);
        }, reelIndex * 300); // Stagger the start of each reel
    });
    
    // Reset everything after showing the result
    setTimeout(() => {
        resetPreviewAnimation();
    }, 7000);
}

function resetPreviewAnimation() {
    const reelStrips = document.querySelectorAll('.preview-reel-strip');
    const slotPreview = document.querySelector('.slot-preview');
    
    // Reset slot machine styling
    if (slotPreview) {
        slotPreview.style.boxShadow = '';
        slotPreview.style.background = '';
        slotPreview.style.transform = '';
        slotPreview.style.transition = '';
        
        // Remove any sparkles
        const sparkles = slotPreview.querySelectorAll('div[style*="sparkleUp"]');
        sparkles.forEach(sparkle => sparkle.remove());
    }
    
    reelStrips.forEach(strip => {
        // Reset position and styling
        strip.style.transition = 'none';
        strip.style.transform = 'translateY(0)';
        
        // Reset reel container styling
        const reelContainer = strip.closest('.slot-reel-preview');
        if (reelContainer) {
            reelContainer.style.boxShadow = '';
            reelContainer.style.transform = '';
            reelContainer.style.transition = '';
        }
        
        // Reset all reel items
        const items = strip.children;
        for (let i = 0; i < items.length; i++) {
            items[i].textContent = '?';
            items[i].style.color = '';
            items[i].style.textShadow = '';
            items[i].style.transform = '';
            items[i].style.transition = '';
        }
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

function showPreviewCelebration(isGirl) {
    const slotPreview = document.querySelector('.slot-preview');
    if (slotPreview) {
        // Flash the machine with the gender color
        slotPreview.style.boxShadow = `0 0 40px ${isGirl ? '#ec4899' : '#3b82f6'}`;
        slotPreview.style.background = `linear-gradient(45deg, ${isGirl ? 'rgba(236, 72, 153, 0.1)' : 'rgba(59, 130, 246, 0.1)'}, transparent)`;
        
        // Add some sparkles
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createSparkle(slotPreview, isGirl);
            }, i * 200);
        }
        
        // Reset after celebration
        setTimeout(() => {
            slotPreview.style.boxShadow = '';
            slotPreview.style.background = '';
        }, 2000);
    }
}

function createSparkle(container, isGirl) {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.cssText = `
        position: absolute;
        font-size: 1.5rem;
        color: ${isGirl ? '#ec4899' : '#3b82f6'};
        pointer-events: none;
        z-index: 100;
        left: ${20 + Math.random() * 60}%;
        top: ${20 + Math.random() * 60}%;
        animation: sparkleUp 1s ease-out forwards;
    `;
    
    container.appendChild(sparkle);
    
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 1000);
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

// Add CSS for sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleUp {
        0% {
            transform: scale(0) translateY(0);
            opacity: 0;
        }
        50% {
            transform: scale(1) translateY(-20px);
            opacity: 1;
        }
        100% {
            transform: scale(0) translateY(-40px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);

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