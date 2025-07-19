// Choose Page JavaScript - Step-by-step gender reveal setup

let currentStep = 1;
let selectedAnimation = null;
let selectedGender = null;

document.addEventListener('DOMContentLoaded', function() {
    initChoosePage();
});

function initChoosePage() {
    // Initialize step navigation
    setupStepNavigation();
    
    // Setup animation selection
    setupAnimationSelection();
    
    // Setup gender selection
    setupGenderSelection();
    
    // Update UI based on current step
    updateStepDisplay();
    
    // Track page view
    if (typeof trackEvent === 'function') {
        trackEvent('page_view', {
            page: 'choose',
            step: currentStep
        });
    }
}

function setupStepNavigation() {
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextStep);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', previousStep);
    }
}

function setupAnimationSelection() {
    const animationOptions = document.querySelectorAll('.animation-option');
    
    animationOptions.forEach(option => {
        option.addEventListener('click', function() {
            const animation = this.getAttribute('data-animation');
            
            // Only allow selection of available animations
            if (animation === 'slot') {
                selectAnimation(animation, this);
            }
        });
    });
}

function selectAnimation(animation, element) {
    // Remove previous selection
    document.querySelectorAll('.animation-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection to clicked element
    element.classList.add('selected');
    selectedAnimation = animation;
    
    // Enable next button
    updateNextButton();
    
    // Track selection
    if (typeof trackEvent === 'function') {
        trackEvent('animation_selected', {
            animation: animation,
            step: currentStep
        });
    }
    
    // Auto-advance after a short delay
    setTimeout(() => {
        if (currentStep === 1) {
            nextStep();
        }
    }, 1000);
}

function setupGenderSelection() {
    const genderOptions = document.querySelectorAll('.gender-option');
    
    genderOptions.forEach(option => {
        option.addEventListener('click', function() {
            const gender = this.getAttribute('data-gender');
            selectGender(gender, this);
        });
    });
}

function selectGender(gender, element) {
    // Remove previous selection
    document.querySelectorAll('.gender-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection to clicked element
    element.classList.add('selected');
    selectedGender = gender;
    
    // Enable next button
    updateNextButton();
    
    // Track selection
    if (typeof trackEvent === 'function') {
        trackEvent('gender_selected', {
            gender: gender,
            step: currentStep
        });
    }
    
    // Auto-advance after a short delay
    setTimeout(() => {
        if (currentStep === 2) {
            nextStep();
        }
    }, 1000);
}

function nextStep() {
    if (currentStep < 3) {
        // Validate current step
        if (!validateCurrentStep()) {
            return;
        }
        
        currentStep++;
        updateStepDisplay();
        
        // Update confirmation content if we're on step 3
        if (currentStep === 3) {
            updateConfirmationContent();
        }
        
        // Track step progression
        if (typeof trackEvent === 'function') {
            trackEvent('step_advanced', {
                from_step: currentStep - 1,
                to_step: currentStep
            });
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
        
        // Track step regression
        if (typeof trackEvent === 'function') {
            trackEvent('step_back', {
                from_step: currentStep + 1,
                to_step: currentStep
            });
        }
    }
}

function goToStep(step) {
    if (step >= 1 && step <= 3) {
        currentStep = step;
        updateStepDisplay();
    }
}

function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            return selectedAnimation !== null;
        case 2:
            return selectedGender !== null;
        case 3:
            return true;
        default:
            return false;
    }
}

function updateStepDisplay() {
    // Update step indicators
    for (let i = 1; i <= 3; i++) {
        const indicator = document.getElementById(`step${i}-indicator`);
        const content = document.getElementById(`step${i}`);
        
        if (indicator && content) {
            if (i === currentStep) {
                indicator.classList.add('active');
                indicator.classList.remove('completed');
                content.classList.add('active');
            } else if (i < currentStep) {
                indicator.classList.remove('active');
                indicator.classList.add('completed');
                content.classList.remove('active');
            } else {
                indicator.classList.remove('active', 'completed');
                content.classList.remove('active');
            }
        }
    }
    
    // Update navigation buttons
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    if (prevBtn) {
        if (currentStep > 1) {
            prevBtn.classList.remove('hidden');
        } else {
            prevBtn.classList.add('hidden');
        }
    }
    
    if (nextBtn) {
        if (currentStep === 3) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'block';
            updateNextButton();
        }
    }
}

function updateNextButton() {
    const nextBtn = document.getElementById('nextBtn');
    
    if (nextBtn && validateCurrentStep()) {
        nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        nextBtn.disabled = false;
    } else if (nextBtn) {
        nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
        nextBtn.disabled = true;
    }
}

function updateConfirmationContent() {
    const confirmIcon = document.getElementById('confirm-icon');
    const confirmAnimation = document.getElementById('confirm-animation');
    const confirmGender = document.getElementById('confirm-gender');
    
    if (selectedAnimation && selectedGender) {
        // Update icon based on animation
        if (confirmIcon) {
            const icons = {
                'slot': '🎰',
                'fireworks': '🎆'
            };
            confirmIcon.textContent = icons[selectedAnimation] || '🎰';
        }
        
        // Update animation name
        if (confirmAnimation) {
            const names = {
                'slot': 'Slot Machine',
                'fireworks': 'Fireworks'
            };
            confirmAnimation.textContent = names[selectedAnimation] || 'Slot Machine';
        }
        
        // Update gender display
        if (confirmGender) {
            const genderText = selectedGender === 'boy' ? 'It\'s a Boy! 👶💙' : 'It\'s a Girl! 👶💗';
            confirmGender.textContent = genderText;
        }
    }
}

function startReveal() {
    // Validate selections before proceeding
    if (!selectedAnimation || !selectedGender) {
        alert('Please complete all steps before starting the reveal!');
        return;
    }
    
    // Save selections to sessionStorage
    saveSelections();
    
    // Track reveal start
    if (typeof trackEvent === 'function') {
        trackEvent('reveal_started', {
            animation: selectedAnimation,
            gender: selectedGender
        });
    }
    
    // Navigate to reveal page with parameters
    // Use the Jekyll baseurl configuration
    const baseUrl = window.SITE_CONFIG ? window.SITE_CONFIG.baseUrl : '';
    const revealUrl = `${baseUrl}/reveal.html?animation=${encodeURIComponent(selectedAnimation)}&gender=${encodeURIComponent(selectedGender)}`;
    
    // console.log('Using baseUrl:', baseUrl); // Debug log
    // console.log('Navigating to:', revealUrl); // Debug log
    
    // Add fade transition
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        window.location.href = revealUrl;
    }, 300);
}

function saveSelections() {
    const selections = {
        animation: selectedAnimation,
        gender: selectedGender,
        timestamp: new Date().toISOString()
    };
    
    // console.log('Saving selections:', selections); // Debug log
    sessionStorage.setItem('genderRevealSelections', JSON.stringify(selections));
    // console.log('Selections saved to sessionStorage'); // Debug log
}

// Global functions
window.nextStep = nextStep;
window.previousStep = previousStep;
window.goToStep = goToStep;
window.startReveal = startReveal;