// Reveal Page JavaScript - Handles pre-reveal screen and animation trigger

let revealData = null;

document.addEventListener('DOMContentLoaded', function() {
    initRevealPage();
});

function initRevealPage() {
    // Get reveal data from URL parameters or sessionStorage
    revealData = getRevealData();
    
    console.log('Reveal data:', revealData); // Debug log
    
    if (!revealData || !revealData.animation || !revealData.gender) {
        console.log('No valid reveal data found on first attempt, trying recovery...'); // Debug log
        
        // Try recovery with a delay to handle race conditions
        setTimeout(() => {
            console.log('Attempting data recovery after delay...');
            revealData = getRevealData();
            
            if (!revealData || !revealData.animation || !revealData.gender) {
                console.log('Recovery failed, showing redirect message...');
                showRedirectMessage();
                setTimeout(() => {
                    redirectToChoose();
                }, 3000);
                return;
            } else {
                console.log('Recovery successful, continuing with reveal setup');
                proceedWithRevealSetup();
            }
        }, 500); // Give more time for data to be available
        return;
    }
    
    proceedWithRevealSetup();
}

function proceedWithRevealSetup() {
    // Don't clear the URL hash immediately - wait for data to be processed
    setTimeout(() => {
        if (window.location.hash) {
            // Remove hash without triggering page reload
            const url = window.location.href.split('#')[0];
            window.history.replaceState(null, null, url);
        }
    }, 1000);
    
    // Setup pre-reveal screen
    setupPreRevealScreen();
    
    // Setup start button
    setupStartButton();
    
    // Track page view
    if (typeof trackEvent === 'function') {
        trackEvent('reveal_page_view', {
            animation: revealData.animation,
            gender: revealData.gender
        });
    }
}

function showRedirectMessage() {
    const preReveal = document.getElementById('preReveal');
    if (preReveal) {
        preReveal.innerHTML = `
            <div class="text-center max-w-2xl mx-auto px-4">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-8">
                    Setting Up Your Reveal...
                </h1>
                <div class="bg-white rounded-3xl shadow-2xl p-12 mb-8">
                    <div class="text-6xl mb-6">🎰</div>
                    <p class="text-xl text-gray-600 mb-8">Redirecting you to the setup page...</p>
                    <div class="flex justify-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                </div>
            </div>
        `;
    }
}

function getRevealData() {
    console.log('Getting reveal data...'); // Debug log
    console.log('Current URL:', window.location.href); // Debug log
    
    // First try URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const animation = urlParams.get('animation');
    const gender = urlParams.get('gender');
    
    console.log('URL params - animation:', animation, 'gender:', gender); // Debug log
    
    if (animation && gender) {
        console.log('Found valid URL parameters'); // Debug log
        // Save to sessionStorage for future use
        const data = { animation, gender };
        try {
            sessionStorage.setItem('genderRevealSelections', JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save URL params to sessionStorage:', e);
        }
        return data;
    }
    
    // Check if we're coming from the choose page with hash fragments (alternative method)
    const hash = window.location.hash;
    if (hash) {
        try {
            const hashData = JSON.parse(decodeURIComponent(hash.substring(1)));
            if (hashData && hashData.animation && hashData.gender) {
                console.log('Found valid hash data:', hashData);
                // Save to sessionStorage for future use
                const data = { animation: hashData.animation, gender: hashData.gender };
                try {
                    sessionStorage.setItem('genderRevealSelections', JSON.stringify(data));
                } catch (e) {
                    console.error('Failed to save hash data to sessionStorage:', e);
                }
                return data;
            }
        } catch (e) {
            console.log('Hash parsing failed:', e);
        }
    }
    
    // Fallback to sessionStorage with better format handling
    try {
        const stored = sessionStorage.getItem('genderRevealSelections');
        console.log('SessionStorage data:', stored); // Debug log
        if (stored) {
            const parsed = JSON.parse(stored);
            console.log('Parsed sessionStorage:', parsed); // Debug log
            
            // Handle both old and new data formats more robustly
            if (parsed && parsed.animation && parsed.gender) {
                // Normalize the data to simple format
                const data = {
                    animation: parsed.animation,
                    gender: parsed.gender
                };
                console.log('Valid sessionStorage data found:', data);
                return data;
            } else if (parsed && typeof parsed === 'object') {
                // Try to extract from nested structure
                console.log('Attempting to extract from nested data structure...');
                const extractedData = extractDataFromObject(parsed);
                if (extractedData && extractedData.animation && extractedData.gender) {
                    console.log('Successfully extracted data:', extractedData);
                    // Save normalized data back
                    sessionStorage.setItem('genderRevealSelections', JSON.stringify(extractedData));
                    return extractedData;
                }
            }
        }
    } catch (e) {
        console.error('Error reading stored selections:', e);
    }
    
    // Final fallback to localStorage backup with similar handling
    try {
        const backup = localStorage.getItem('genderRevealSelections_backup');
        console.log('Checking localStorage backup:', backup); // Debug log
        if (backup) {
            const parsed = JSON.parse(backup);
            console.log('Parsed localStorage backup:', parsed); // Debug log
            if (parsed && parsed.animation && parsed.gender) {
                console.log('Using localStorage backup data');
                // Save to sessionStorage for current session
                const data = {
                    animation: parsed.animation,
                    gender: parsed.gender
                };
                try {
                    sessionStorage.setItem('genderRevealSelections', JSON.stringify(data));
                } catch (e) {
                    console.error('Failed to save backup data to sessionStorage:', e);
                }
                return data;
            }
        }
    } catch (e) {
        console.error('Error reading localStorage backup:', e);
    }
    
    console.log('No valid reveal data found - will redirect to choose page'); // Keep this for troubleshooting
    return null;
}

function extractDataFromObject(obj) {
    // Recursively search for animation and gender properties
    if (!obj || typeof obj !== 'object') return null;
    
    // Direct properties
    if (obj.animation && obj.gender) {
        return { animation: obj.animation, gender: obj.gender };
    }
    
    // Search nested objects
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            const result = extractDataFromObject(obj[key]);
            if (result) return result;
        }
    }
    
    return null;
}

function setupPreRevealScreen() {
    const revealIcon = document.getElementById('revealIcon');
    const revealType = document.getElementById('revealType');
    
    if (revealData) {
        // Update icon based on animation type
        if (revealIcon) {
            const icons = {
                'slot': '🎰',
                'fireworks': '🎆'
            };
            revealIcon.textContent = icons[revealData.animation] || '🎰';
        }
        
        // Update reveal type text
        if (revealType) {
            const names = {
                'slot': 'Slot Machine Reveal',
                'fireworks': 'Fireworks Reveal'
            };
            revealType.textContent = names[revealData.animation] || 'Slot Machine Reveal';
        }
    }
}

function setupStartButton() {
    const startBtn = document.getElementById('startRevealBtn');
    
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            startCountdownAndReveal();
        });
    }
}

function startCountdownAndReveal() {
    const countdown = document.getElementById('countdown');
    const countdownNumber = document.getElementById('countdownNumber');
    const startBtn = document.getElementById('startRevealBtn');
    
    // Double-check reveal data before starting countdown
    if (!revealData || !revealData.animation || !revealData.gender) {
        console.error('Reveal data missing during countdown start - attempting recovery');
        
        // Show user-friendly message instead of immediately redirecting
        showRecoveryMessage();
        
        // Attempt multiple recovery strategies
        attemptDataRecovery().then((recovered) => {
            if (recovered) {
                console.log('Data recovery successful, continuing with countdown');
                hideRecoveryMessage();
                proceedWithCountdown();
            } else {
                console.error('All recovery attempts failed - redirecting to choose');
                setTimeout(() => {
                    redirectToChoose();
                }, 2000); // Give user time to read the message
            }
        });
        return;
    }
    
    proceedWithCountdown();
}

function showRecoveryMessage() {
    const preReveal = document.getElementById('preReveal');
    if (preReveal) {
        const recoveryDiv = document.createElement('div');
        recoveryDiv.id = 'recoveryMessage';
        recoveryDiv.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 text-center">
                    <div class="text-4xl mb-4">🔄</div>
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Preparing Your Reveal...</h3>
                    <p class="text-gray-600 mb-4">We're setting up your animation. This will just take a moment.</p>
                    <div class="flex justify-center">
                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(recoveryDiv);
    }
}

function hideRecoveryMessage() {
    const recoveryMessage = document.getElementById('recoveryMessage');
    if (recoveryMessage) {
        recoveryMessage.remove();
    }
}

function attemptDataRecovery() {
    return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 3;
        
        function tryRecovery() {
            attempts++;
            console.log(`Data recovery attempt ${attempts}/${maxAttempts}`);
            
            revealData = getRevealData();
            
            if (revealData && revealData.animation && revealData.gender) {
                console.log('Recovery successful on attempt', attempts);
                resolve(true);
                return;
            }
            
            if (attempts < maxAttempts) {
                // Wait longer between attempts
                setTimeout(tryRecovery, 1000 * attempts);
            } else {
                console.log('All recovery attempts failed');
                resolve(false);
            }
        }
        
        tryRecovery();
    });
}

function proceedWithCountdown() {
    const countdown = document.getElementById('countdown');
    const countdownNumber = document.getElementById('countdownNumber');
    const startBtn = document.getElementById('startRevealBtn');
    
    // Persist data one more time before animation
    try {
        sessionStorage.setItem('genderRevealSelections', JSON.stringify(revealData));
        localStorage.setItem('genderRevealSelections_backup', JSON.stringify(revealData));
        console.log('Reveal data persisted before countdown:', revealData);
    } catch (e) {
        console.error('Failed to persist reveal data:', e);
    }
    
    // Hide start button and show countdown
    if (startBtn) startBtn.style.display = 'none';
    if (countdown) countdown.classList.remove('hidden');
    
    let count = 3;
    
    const countdownInterval = setInterval(() => {
        if (countdownNumber) {
            countdownNumber.textContent = count;
        }
        
        count--;
        
        if (count < 0) {
            clearInterval(countdownInterval);
            startAnimation();
        }
    }, 1000);
    
    // Track countdown start
    if (typeof trackEvent === 'function') {
        trackEvent('countdown_started', {
            animation: revealData.animation,
            gender: revealData.gender
        });
    }
}

function startAnimation() {
    // Hide pre-reveal screen
    const preReveal = document.getElementById('preReveal');
    if (preReveal) {
        preReveal.style.display = 'none';
    }
    
    // Show animation container
    const animationContainer = document.getElementById('animationContainer');
    if (animationContainer) {
        animationContainer.classList.remove('hidden');
    }
    
    // Enter fullscreen
    enterFullscreen();
    
    // Start the appropriate animation
    switch (revealData.animation) {
        case 'slot':
            startSlotMachineAnimation();
            break;
        case 'wheel':
            startWheelAnimation();
            break;
        case 'fireworks':
            // Future implementation
            console.log('Fireworks animation not yet implemented');
            break;
        default:
            startSlotMachineAnimation();
            break;
    }
    
    // Track animation start
    if (typeof trackEvent === 'function') {
        trackEvent('animation_started', {
            animation: revealData.animation,
            gender: revealData.gender,
            fullscreen: document.fullscreenElement !== null
        });
    }
}

function enterFullscreen() {
    const element = document.documentElement;
    
    if (element.requestFullscreen) {
        element.requestFullscreen().catch(err => {
            console.log('Fullscreen request failed:', err);
        });
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
    
    // Add fullscreen class to body
    document.body.classList.add('fullscreen-active');
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    
    // Remove fullscreen class from body
    document.body.classList.remove('fullscreen-active');
}

function startSlotMachineAnimation() {
    const slotMachine = document.getElementById('slotMachine');
    
    if (slotMachine) {
        slotMachine.classList.remove('hidden');
        
        // Ensure reveal data is still available
        if (!revealData || !revealData.gender) {
            console.error('Reveal data lost during animation start - attempting to recover');
            revealData = getRevealData();
            if (!revealData) {
                console.error('Could not recover reveal data - using fallback');
                revealData = { animation: 'slot', gender: 'boy' }; // Default fallback
            }
        }
        
        // Initialize slot machine animation
        if (typeof initSlotMachine === 'function') {
            console.log('Starting slot machine animation for:', revealData.gender); // Debug log
            initSlotMachine(revealData.gender);
        } else {
            console.error('Slot machine animation not loaded - falling back to basic animation');
            // Fallback animation
            showBasicAnimation();
        }
    } else {
        console.error('Slot machine element not found');
    }
}

function startWheelAnimation() {
    const wheelContainer = document.getElementById('wheelContainer');
    
    if (wheelContainer) {
        wheelContainer.classList.remove('hidden');
        
        // Ensure reveal data is still available
        if (!revealData || !revealData.gender) {
            console.error('Reveal data lost during animation start - attempting to recover');
            revealData = getRevealData();
            if (!revealData) {
                console.error('Could not recover reveal data - using fallback');
                revealData = { animation: 'wheel', gender: 'boy' }; // Default fallback
            }
        }
        
        // Initialize wheel animation
        if (typeof initWheel === 'function') {
            console.log('Starting wheel animation for:', revealData.gender); // Debug log
            initWheel(revealData.gender);
        } else {
            console.error('Wheel animation not loaded - falling back to basic animation');
            // Fallback animation
            showBasicAnimation();
        }
    } else {
        console.error('Wheel container element not found');
    }
}

function showBasicAnimation() {
    // Simple fallback animation if the slot machine script fails to load
    const resultText = revealData.gender === 'boy' ? 'IT\'S A BOY!' : 'IT\'S A GIRL!';
    setTimeout(() => {
        if (typeof showResult === 'function') {
            showResult(resultText, true);
        }
    }, 2000);
}

function showResult(resultText, isSuccess = true) {
    const result = document.getElementById('result');
    const resultTextElement = document.getElementById('resultText');
    const replayBtn = document.getElementById('replayBtn');
    const exitBtn = document.getElementById('exitFullscreenBtn');
    
    if (result && resultTextElement) {
        resultTextElement.textContent = resultText;
        result.classList.remove('hidden');
        
        // Add color based on gender
        if (revealData.gender === 'boy') {
            resultTextElement.style.background = 'linear-gradient(45deg, #3b82f6, #1d4ed8)';
        } else {
            resultTextElement.style.background = 'linear-gradient(45deg, #ec4899, #be185d)';
        }
        resultTextElement.style.webkitBackgroundClip = 'text';
        resultTextElement.style.webkitTextFillColor = 'transparent';
        
        // Start confetti
        if (isSuccess) {
            startConfetti();
        }
    }
    
    // Setup replay button
    if (replayBtn) {
        replayBtn.addEventListener('click', function() {
            replayAnimation();
        });
    }
    
    // Setup exit fullscreen button
    if (exitBtn) {
        exitBtn.addEventListener('click', function() {
            exitFullscreen();
            setTimeout(() => {
                redirectToChoose();
            }, 500);
        });
    }
    
    // Track result shown
    if (typeof trackEvent === 'function') {
        trackEvent('result_shown', {
            animation: revealData.animation,
            gender: revealData.gender,
            result: resultText,
            success: isSuccess
        });
    }
}

function startConfetti() {
    const confettiContainer = document.getElementById('confetti');
    if (!confettiContainer) return;
    
    // Clear existing confetti
    confettiContainer.innerHTML = '';
    
    // Create confetti pieces
    const colors = ['#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confettiContainer.appendChild(confetti);
    }
    
    // Remove confetti after animation
    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, 6000);
}

function replayAnimation() {
    // Reset the slot machine first
    if (typeof resetSlotMachine === 'function') {
        resetSlotMachine();
    }
    
    // Hide result
    const result = document.getElementById('result');
    if (result) {
        result.classList.add('hidden');
    }
    
    // Reset slot machine opacity
    const slotMachine = document.getElementById('slotMachine');
    if (slotMachine) {
        slotMachine.style.opacity = '1';
    }
    
    // Restart the animation after a brief delay
    setTimeout(() => {
        startSlotMachineAnimation();
    }, 500);
    
    // Track replay
    if (typeof trackEvent === 'function') {
        trackEvent('animation_replayed', {
            animation: revealData.animation,
            gender: revealData.gender
        });
    }
}

function redirectToChoose() {
    // Clear any stored selections that might be invalid
    try {
        sessionStorage.removeItem('genderRevealSelections');
        localStorage.removeItem('genderRevealSelections_backup');
    } catch (e) {
        console.error('Error clearing storage:', e);
    }
    
    // Wait for SITE_CONFIG to be available if needed, but don't wait too long
    const maxWaitTime = 500; // Shorter wait for redirects
    const startTime = Date.now();
    
    function waitForConfigAndRedirect() {
        const baseUrl = window.SITE_CONFIG ? window.SITE_CONFIG.baseUrl : '';
        const isLocalhost = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1');
        
        // If we're on localhost or have waited long enough, proceed
        if (isLocalhost || window.SITE_CONFIG || (Date.now() - startTime) > maxWaitTime) {
            doRedirect(baseUrl);
        } else {
            // Wait a bit more for SITE_CONFIG to load
            setTimeout(waitForConfigAndRedirect, 50);
        }
    }
    
    waitForConfigAndRedirect();
}

function doRedirect(baseUrl) {
    let chooseUrl;
    
    if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')) {
        // Local development - use relative path
        chooseUrl = './choose.html';
    } else {
        // Production - use baseUrl with fallback
        const basePath = baseUrl || '.';
        chooseUrl = `${basePath}/choose.html`;
    }
    
    console.log('Using baseUrl for redirect:', baseUrl); // Debug log
    console.log('Environment:', window.location.origin); // Debug log
    console.log('Redirecting to choose page:', chooseUrl); // Debug log
    
    try {
        window.location.href = chooseUrl;
    } catch (e) {
        console.error('Primary redirect failed, trying fallback:', e);
        // Fallback to relative path
        try {
            window.location.href = './choose.html';
        } catch (e2) {
            console.error('Fallback redirect failed, trying replace:', e2);
            // Last resort - use replace
            window.location.replace('./choose.html');
        }
    }
}

// Handle fullscreen change events
document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement) {
        document.body.classList.remove('fullscreen-active');
    }
});

// Global functions
window.showResult = showResult;
window.exitFullscreen = exitFullscreen;
window.getRevealData = () => revealData;