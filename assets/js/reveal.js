// Reveal Page JavaScript - Handles pre-reveal screen and animation trigger

let revealData = null;
let dataRecoveryAttempts = 0;
const MAX_RECOVERY_ATTEMPTS = 3;

document.addEventListener('DOMContentLoaded', function() {
    initRevealPage();
});

function initRevealPage() {
    // Get reveal data from URL parameters or sessionStorage
    revealData = getRevealData();
    
    console.log('Reveal data:', revealData); // Debug log
    
    if (!revealData || !revealData.animation || !revealData.gender) {
        console.log('No valid reveal data found on first attempt, trying recovery...'); // Debug log
        
        // Enhanced recovery with multiple strategies
        attemptEnhancedDataRecovery().then((recoveredData) => {
            if (recoveredData && recoveredData.animation && recoveredData.gender) {
                console.log('Enhanced recovery successful, continuing with reveal setup');
                revealData = recoveredData;
                proceedWithRevealSetup();
            } else {
                console.log('All recovery attempts failed');
                handleDataRecoveryFailure();
            }
        });
        return;
    }
    
    proceedWithRevealSetup();
}

function attemptEnhancedDataRecovery() {
    return new Promise((resolve) => {
        let attempts = 0;
        const recoveryStrategies = [
            () => getRevealDataFromURL(),
            () => getRevealDataFromStorage(),
            () => getRevealDataFromBackup(),
            () => getRevealDataFromURLHash(),
            () => getRevealDataFromReferrer(),
            () => getRevealDataFromSession()
        ];
        
        function tryNextStrategy() {
            if (attempts >= recoveryStrategies.length) {
                console.log('All recovery strategies exhausted');
                resolve(null);
                return;
            }
            
            console.log(`Trying recovery strategy ${attempts + 1}/${recoveryStrategies.length}`);
            
            try {
                const data = recoveryStrategies[attempts]();
                if (data && data.animation && data.gender) {
                    console.log(`Recovery strategy ${attempts + 1} successful:`, data);
                    resolve(data);
                    return;
                }
            } catch (e) {
                console.log(`Recovery strategy ${attempts + 1} failed:`, e);
            }
            
            attempts++;
            // Use exponential backoff for retries
            setTimeout(tryNextStrategy, Math.min(1000 * Math.pow(2, attempts), 5000));
        }
        
        tryNextStrategy();
    });
}

function getRevealDataFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const animation = urlParams.get('animation');
    const gender = urlParams.get('gender');
    
    if (animation && gender && isValidAnimationGender(animation, gender)) {
        return { animation, gender };
    }
    return null;
}

function getRevealDataFromStorage() {
    try {
        const stored = sessionStorage.getItem('genderRevealSelections');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.animation && parsed.gender && isValidAnimationGender(parsed.animation, parsed.gender)) {
                return { animation: parsed.animation, gender: parsed.gender };
            }
        }
    } catch (e) {
        console.error('Error reading sessionStorage:', e);
    }
    return null;
}

function getRevealDataFromBackup() {
    try {
        const backup = localStorage.getItem('genderRevealSelections_backup');
        if (backup) {
            const parsed = JSON.parse(backup);
            if (parsed && parsed.animation && parsed.gender && isValidAnimationGender(parsed.animation, parsed.gender)) {
                return { animation: parsed.animation, gender: parsed.gender };
            }
        }
    } catch (e) {
        console.error('Error reading localStorage backup:', e);
    }
    return null;
}

function getRevealDataFromURLHash() {
    try {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#')) {
            const hashData = JSON.parse(decodeURIComponent(hash.substring(1)));
            if (hashData && hashData.animation && hashData.gender && isValidAnimationGender(hashData.animation, hashData.gender)) {
                return { animation: hashData.animation, gender: hashData.gender };
            }
        }
    } catch (e) {
        console.log('Hash parsing failed:', e);
    }
    return null;
}

function getRevealDataFromReferrer() {
    // Check if coming from choose page - could extract from referrer
    try {
        const referrer = document.referrer;
        if (referrer && referrer.includes('choose.html')) {
            // Try to find any stored data that's recent (within last 5 minutes)
            const recentData = getRecentStoredData();
            if (recentData) {
                return recentData;
            }
        }
    } catch (e) {
        console.log('Referrer check failed:', e);
    }
    return null;
}

function getRevealDataFromSession() {
    // Try alternative storage keys that might exist
    const alternativeKeys = [
        'reveal_data',
        'gender_reveal_data',
        'genderReveal',
        'reveal_selections'
    ];
    
    for (const key of alternativeKeys) {
        try {
            const data = sessionStorage.getItem(key) || localStorage.getItem(key);
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed && parsed.animation && parsed.gender) {
                    return { animation: parsed.animation, gender: parsed.gender };
                }
            }
        } catch (e) {
            // Continue to next key
        }
    }
    return null;
}

function getRecentStoredData() {
    try {
        const keys = ['genderRevealSelections', 'genderRevealSelections_backup'];
        for (const storageType of [sessionStorage, localStorage]) {
            for (const key of keys) {
                const data = storageType.getItem(key);
                if (data) {
                    const parsed = JSON.parse(data);
                    if (parsed && parsed.animation && parsed.gender) {
                        // Check if data is recent (within 5 minutes)
                        if (parsed.timestamp) {
                            const dataTime = new Date(parsed.timestamp);
                            const now = new Date();
                            const diffMinutes = (now - dataTime) / (1000 * 60);
                            if (diffMinutes <= 5) {
                                return { animation: parsed.animation, gender: parsed.gender };
                            }
                        } else {
                            // If no timestamp, assume it's recent enough
                            return { animation: parsed.animation, gender: parsed.gender };
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.error('Error getting recent stored data:', e);
    }
    return null;
}

function isValidAnimationGender(animation, gender) {
    const validAnimations = ['slot', 'wheel', 'fireworks'];
    const validGenders = ['boy', 'girl'];
    return validAnimations.includes(animation) && validGenders.includes(gender);
}

function handleDataRecoveryFailure() {
    // Instead of immediately redirecting, provide user with options
    showDataRecoveryOptions();
}

function showDataRecoveryOptions() {
    const preReveal = document.getElementById('preReveal');
    if (preReveal) {
        preReveal.innerHTML = `
            <div class="text-center max-w-2xl mx-auto px-4">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-8">
                    Oops! Let's Get You Back on Track
                </h1>
                
                <div class="bg-white rounded-3xl shadow-2xl p-8 mb-8">
                    <div class="text-6xl mb-6">🔄</div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">We lost your reveal settings</h2>
                    <p class="text-gray-600 mb-8">Don't worry! This sometimes happens on mobile devices. Let's get your reveal ready again.</p>
                    
                    <div class="space-y-4">
                        <button onclick="retryDataRecovery()" 
                                class="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                            🔍 Try to Recover Settings
                        </button>
                        
                        <button onclick="quickSetup()" 
                                class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                            ⚡ Quick Setup (30 seconds)
                        </button>
                        
                        <button onclick="goBackToChoose()" 
                                class="w-full bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-400 transition-all duration-300">
                            ← Go Back to Setup
                        </button>
                    </div>
                </div>
                
                <p class="text-gray-500 text-sm">
                    💡 Tip: For best results, try using the same browser and avoid private/incognito mode
                </p>
            </div>
        `;
    }
}

function retryDataRecovery() {
    showLoadingMessage('Searching for your settings...');
    
    // Try one more comprehensive recovery
    setTimeout(async () => {
        const data = await attemptEnhancedDataRecovery();
        if (data && data.animation && data.gender) {
            hideLoadingMessage();
            revealData = data;
            proceedWithRevealSetup();
        } else {
            hideLoadingMessage();
            showNoDataFoundMessage();
        }
    }, 2000);
}

function quickSetup() {
    showQuickSetupModal();
}

function showQuickSetupModal() {
    const modal = document.createElement('div');
    modal.id = 'quickSetupModal';
    modal.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
                <h3 class="text-2xl font-bold text-gray-800 mb-6 text-center">Quick Setup</h3>
                
                <div class="space-y-6">
                    <div>
                        <label class="block text-lg font-semibold text-gray-700 mb-3">Choose Animation:</label>
                        <div class="grid grid-cols-2 gap-3">
                            <button class="quick-animation-btn bg-gradient-to-br from-yellow-400 to-red-500 text-white p-4 rounded-xl font-bold hover:scale-105 transition-all" data-animation="slot">
                                🎰 Slot Machine
                            </button>
                            <button class="quick-animation-btn bg-gradient-to-br from-purple-400 to-pink-500 text-white p-4 rounded-xl font-bold hover:scale-105 transition-all" data-animation="wheel">
                                🎡 Wheel
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-lg font-semibold text-gray-700 mb-3">Select Gender:</label>
                        <div class="grid grid-cols-2 gap-3">
                            <button class="quick-gender-btn bg-gradient-to-br from-blue-400 to-blue-600 text-white p-4 rounded-xl font-bold hover:scale-105 transition-all" data-gender="boy">
                                👶 Boy
                            </button>
                            <button class="quick-gender-btn bg-gradient-to-br from-pink-400 to-pink-600 text-white p-4 rounded-xl font-bold hover:scale-105 transition-all" data-gender="girl">
                                👶 Girl
                            </button>
                        </div>
                    </div>
                    
                    <div class="flex space-x-3 pt-4">
                        <button onclick="startQuickReveal()" 
                                class="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                                id="quickStartBtn" disabled>
                            Start Reveal! 🎉
                        </button>
                        <button onclick="closeQuickSetup()" 
                                class="bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-full hover:bg-gray-400 transition-all duration-300">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for quick setup
    setupQuickSetupListeners();
}

function setupQuickSetupListeners() {
    let selectedAnimation = null;
    let selectedGender = null;
    
    const animationBtns = document.querySelectorAll('.quick-animation-btn');
    const genderBtns = document.querySelectorAll('.quick-gender-btn');
    const startBtn = document.getElementById('quickStartBtn');
    
    animationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            animationBtns.forEach(b => b.classList.remove('ring-4', 'ring-white'));
            this.classList.add('ring-4', 'ring-white');
            selectedAnimation = this.getAttribute('data-animation');
            updateQuickStartBtn();
        });
    });
    
    genderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            genderBtns.forEach(b => b.classList.remove('ring-4', 'ring-white'));
            this.classList.add('ring-4', 'ring-white');
            selectedGender = this.getAttribute('data-gender');
            updateQuickStartBtn();
        });
    });
    
    function updateQuickStartBtn() {
        if (selectedAnimation && selectedGender) {
            startBtn.disabled = false;
            startBtn.onclick = () => startQuickReveal(selectedAnimation, selectedGender);
        } else {
            startBtn.disabled = true;
        }
    }
    
    // Make functions globally available
    window.startQuickReveal = (animation, gender) => startQuickReveal(animation || selectedAnimation, gender || selectedGender);
    window.closeQuickSetup = closeQuickSetup;
}

function startQuickReveal(animation, gender) {
    if (!animation || !gender) {
        alert('Please select both animation and gender');
        return;
    }
    
    revealData = { animation, gender };
    
    // Save the data for future use
    saveRevealDataRobustly(revealData);
    
    closeQuickSetup();
    proceedWithRevealSetup();
}

function closeQuickSetup() {
    const modal = document.getElementById('quickSetupModal');
    if (modal) {
        modal.remove();
    }
}

function saveRevealDataRobustly(data) {
    const dataToSave = {
        ...data,
        timestamp: new Date().toISOString(),
        source: 'quick_setup',
        version: '1.2'
    };
    
    // Try multiple storage methods
    const storageStrategies = [
        () => sessionStorage.setItem('genderRevealSelections', JSON.stringify(dataToSave)),
        () => localStorage.setItem('genderRevealSelections_backup', JSON.stringify(dataToSave)),
        () => localStorage.setItem('reveal_data', JSON.stringify(dataToSave)),
        () => sessionStorage.setItem('gender_reveal_data', JSON.stringify(dataToSave))
    ];
    
    let savedCount = 0;
    storageStrategies.forEach((strategy, index) => {
        try {
            strategy();
            savedCount++;
            console.log(`Storage strategy ${index + 1} successful`);
        } catch (e) {
            console.log(`Storage strategy ${index + 1} failed:`, e);
        }
    });
    
    console.log(`Data saved to ${savedCount}/${storageStrategies.length} storage locations`);
}

function showLoadingMessage(message) {
    const preReveal = document.getElementById('preReveal');
    if (preReveal) {
        preReveal.innerHTML = `
            <div class="text-center max-w-2xl mx-auto px-4">
                <div class="bg-white rounded-3xl shadow-2xl p-12">
                    <div class="text-6xl mb-6">🔍</div>
                    <h3 class="text-xl font-bold text-gray-800 mb-4">${message}</h3>
                    <div class="flex justify-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                </div>
            </div>
        `;
    }
}

function hideLoadingMessage() {
    // Will be replaced by next action
}

function showNoDataFoundMessage() {
    const preReveal = document.getElementById('preReveal');
    if (preReveal) {
        preReveal.innerHTML = `
            <div class="text-center max-w-2xl mx-auto px-4">
                <div class="bg-white rounded-3xl shadow-2xl p-8">
                    <div class="text-6xl mb-6">😔</div>
                    <h3 class="text-xl font-bold text-gray-800 mb-4">No Settings Found</h3>
                    <p class="text-gray-600 mb-6">We couldn't find your reveal settings. Let's set them up again!</p>
                    <button onclick="quickSetup()" 
                            class="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        ⚡ Quick Setup
                    </button>
                </div>
            </div>
        `;
    }
}

function goBackToChoose() {
    // Clear any invalid data before going back
    clearAllStoredData();
    redirectToChoose();
}

function clearAllStoredData() {
    const keysToRemove = [
        'genderRevealSelections',
        'genderRevealSelections_backup',
        'reveal_data',
        'gender_reveal_data',
        'genderReveal',
        'reveal_selections'
    ];
    
    keysToRemove.forEach(key => {
        try {
            sessionStorage.removeItem(key);
            localStorage.removeItem(key);
        } catch (e) {
            // Ignore errors
        }
    });
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
    
    // Use the enhanced recovery system
    return getRevealDataFromURL() || 
           getRevealDataFromStorage() || 
           getRevealDataFromBackup() || 
           getRevealDataFromURLHash() || 
           null;
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
window.retryDataRecovery = retryDataRecovery;
window.quickSetup = quickSetup;
window.goBackToChoose = goBackToChoose;