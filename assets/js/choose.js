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
            if (animation === 'slot' || animation === 'wheel') {
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
                'wheel': '🎡',
                'fireworks': '🎆'
            };
            confirmIcon.textContent = icons[selectedAnimation] || '🎰';
        }
        
        // Update animation name
        if (confirmAnimation) {
            const names = {
                'slot': 'Slot Machine',
                'wheel': 'Wheel of Fortune',
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
    
    // Save selections to sessionStorage with more robust data
    saveSelections();
    
    // Track reveal start
    if (typeof trackEvent === 'function') {
        trackEvent('reveal_started', {
            animation: selectedAnimation,
            gender: selectedGender
        });
    }
    
    // Wait for data persistence verification before navigation
    setTimeout(() => {
        verifyDataAndNavigate();
    }, 100);
}

function verifyDataAndNavigate() {
    // Verify data was saved correctly before navigation
    try {
        const verification = sessionStorage.getItem('genderRevealSelections');
        if (!verification) {
            console.error('Data not found in sessionStorage after save attempt');
            // Try saving again
            saveSelections();
            setTimeout(verifyDataAndNavigate, 200);
            return;
        }
        
        const parsed = JSON.parse(verification);
        if (!parsed.animation || !parsed.gender || 
            parsed.animation !== selectedAnimation || 
            parsed.gender !== selectedGender) {
            console.error('Data verification failed, retrying save...');
            saveSelections();
            setTimeout(verifyDataAndNavigate, 200);
            return;
        }
        
        console.log('Data verification successful, proceeding with navigation');
        proceedWithNavigation();
    } catch (e) {
        console.error('Error during data verification:', e);
        // Try one more time
        saveSelections();
        setTimeout(proceedWithNavigation, 300);
    }
}

function proceedWithNavigation() {
    // Wait for SITE_CONFIG to be available if needed
    const maxWaitTime = 1000; // Maximum wait time in ms
    const startTime = Date.now();
    
    function waitForConfigAndNavigate() {
        const baseUrl = window.SITE_CONFIG ? window.SITE_CONFIG.baseUrl : '';
        const isLocalhost = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1');
        
        // If we're on localhost or have waited long enough, proceed
        if (isLocalhost || window.SITE_CONFIG || (Date.now() - startTime) > maxWaitTime) {
            doNavigation(baseUrl);
        } else {
            // Wait a bit more for SITE_CONFIG to load
            setTimeout(waitForConfigAndNavigate, 50);
        }
    }
    
    waitForConfigAndNavigate();
}

function doNavigation(baseUrl) {
    // Method 1: URL parameters (primary) - handle both local dev and production
    let revealUrl;
    if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')) {
        // Local development - use relative path
        revealUrl = `./reveal.html?animation=${encodeURIComponent(selectedAnimation)}&gender=${encodeURIComponent(selectedGender)}`;
    } else {
        // Production - use baseUrl (fallback to relative path if baseUrl is empty)
        const basePath = baseUrl || '.';
        revealUrl = `${basePath}/reveal.html?animation=${encodeURIComponent(selectedAnimation)}&gender=${encodeURIComponent(selectedGender)}`;
    }
    
    // Method 2: Hash fragment (backup)
    const hashData = {animation: selectedAnimation, gender: selectedGender};
    const revealUrlHash = revealUrl.split('?')[0] + '#' + encodeURIComponent(JSON.stringify(hashData));
    
    console.log('Using baseUrl:', baseUrl); // Debug log
    console.log('Environment:', window.location.origin); // Debug log
    console.log('Primary navigation URL:', revealUrl); // Debug log
    console.log('Backup navigation URL:', revealUrlHash); // Debug log
    
    // Add fade transition with longer delay
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        // Try the primary method first
        try {
            console.log('Navigating to:', revealUrl);
            window.location.href = revealUrl;
        } catch (e) {
            console.log('Primary navigation failed, trying backup method:', e);
            // Fallback to hash method
            try {
                window.location.href = revealUrlHash;
            } catch (e2) {
                console.error('Both navigation methods failed:', e2);
                // Last resort - try simple relative navigation
                window.location.href = `./reveal.html?animation=${encodeURIComponent(selectedAnimation)}&gender=${encodeURIComponent(selectedGender)}`;
            }
        }
    }, 500); // Increased delay for better reliability
}

function saveSelections() {
    const selections = {
        animation: selectedAnimation,
        gender: selectedGender,
        timestamp: new Date().toISOString(),
        source: 'choose_page',
        version: '1.2' // Updated version for enhanced compatibility
    };
    
    console.log('Saving selections:', selections); // Debug log
    
    // Enhanced multi-strategy persistence
    return saveSelectionsRobustly(selections);
}

function saveSelectionsRobustly(selections) {
    // Multiple storage strategies for maximum reliability
    const storageStrategies = [
        {
            name: 'Primary sessionStorage',
            fn: () => sessionStorage.setItem('genderRevealSelections', JSON.stringify(selections))
        },
        {
            name: 'Primary localStorage backup',
            fn: () => localStorage.setItem('genderRevealSelections_backup', JSON.stringify(selections))
        },
        {
            name: 'Alternative sessionStorage',
            fn: () => sessionStorage.setItem('gender_reveal_data', JSON.stringify(selections))
        },
        {
            name: 'Alternative localStorage',
            fn: () => localStorage.setItem('reveal_data', JSON.stringify(selections))
        },
        {
            name: 'Fallback sessionStorage',
            fn: () => sessionStorage.setItem('reveal_selections', JSON.stringify(selections))
        }
    ];
    
    let successCount = 0;
    const results = [];
    
    storageStrategies.forEach((strategy, index) => {
        try {
            strategy.fn();
            successCount++;
            console.log(`${strategy.name} - SUCCESS`);
            results.push({ strategy: strategy.name, success: true });
        } catch (e) {
            console.log(`${strategy.name} - FAILED:`, e.message);
            results.push({ strategy: strategy.name, success: false, error: e.message });
        }
    });
    
    console.log(`Data saved to ${successCount}/${storageStrategies.length} storage locations`);
    
    // Verify at least one storage method worked
    if (successCount === 0) {
        console.error('CRITICAL: All storage methods failed!');
        throw new Error('All storage methods failed');
    }
    
    // Additional verification
    setTimeout(() => {
        verifyDataPersistence(selections);
    }, 100);
    
    return selections;
}

function verifyDataPersistence(originalSelections) {
    const verificationKeys = [
        'genderRevealSelections',
        'genderRevealSelections_backup',
        'gender_reveal_data',
        'reveal_data',
        'reveal_selections'
    ];
    
    let verificationCount = 0;
    
    for (const key of verificationKeys) {
        try {
            // Check both storage types
            for (const storage of [sessionStorage, localStorage]) {
                const data = storage.getItem(key);
                if (data) {
                    const parsed = JSON.parse(data);
                    if (parsed && parsed.animation === originalSelections.animation && parsed.gender === originalSelections.gender) {
                        verificationCount++;
                        console.log(`Verification successful for ${key} in ${storage === sessionStorage ? 'sessionStorage' : 'localStorage'}`);
                    }
                }
            }
        } catch (e) {
            console.log(`Verification failed for ${key}:`, e);
        }
    }
    
    console.log(`Data verification: ${verificationCount} successful verifications`);
    
    if (verificationCount === 0) {
        console.error('CRITICAL: Data verification failed - no data could be retrieved after save');
    }
    
    return verificationCount > 0;
}

// Global functions
window.nextStep = nextStep;
window.previousStep = previousStep;
window.goToStep = goToStep;
window.startReveal = startReveal;