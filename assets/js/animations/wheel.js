// Wheel of Fortune Animation for Gender Reveal

let wheelActive = false;
let targetGender = 'boy';
let wheelSpinSound = null;

function initWheel(gender) {
    console.log('initWheel called with gender:', gender); // Debug log
    
    // Validate gender parameter
    if (!gender || (gender !== 'boy' && gender !== 'girl')) {
        console.error('Invalid gender provided to initWheel:', gender);
        console.log('Defaulting to boy');
        gender = 'boy';
    }
    
    targetGender = gender;
    wheelActive = true;
    
    console.log('Wheel initialized with target gender:', targetGender); // Debug log
    
    // Initialize sounds
    initWheelSounds();
    
    // Start the wheel animation sequence
    setTimeout(() => {
        startWheelSequence();
    }, 500);
}

function initWheelSounds() {
    // Create wheel spinning sound
    wheelSpinSound = new Audio();
    wheelSpinSound.volume = 0.4;
    // Using a simple spinning sound as fallback
    wheelSpinSound.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGEbBjaN1vLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGEbBjaN1vLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGEbBjaN1vLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGEbBjaN1vLNeSsF';
}

function playWheelSpinSound() {
    if (wheelSpinSound && wheelSpinSound.paused) {
        wheelSpinSound.currentTime = 0;
        wheelSpinSound.play().catch(e => console.log('Audio play failed:', e));
    }
}

function startWheelSequence() {
    console.log('Starting wheel sequence'); // Debug log
    
    // Create the wheel animation display
    createWheelDisplay();
    
    // Start countdown
    setTimeout(() => {
        startCountdown();
    }, 1000);
}

function createWheelDisplay() {
    console.log('Creating wheel display'); // Debug log
    
    const container = document.querySelector('.reveal-container');
    if (!container) {
        console.error('Reveal container not found');
        return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create wheel container
    const wheelContainer = document.createElement('div');
    wheelContainer.className = 'wheel-container text-center';
    wheelContainer.innerHTML = `
        <div class="mb-8">
            <h1 class="text-4xl md:text-6xl font-bold text-white mb-4 animate-pulse">
                🎡 Wheel of Fortune
            </h1>
            <p class="text-xl md:text-2xl text-white/90">
                Spin the wheel to reveal your special news!
            </p>
        </div>
        
        <!-- Wheel Structure -->
        <div class="wheel-game-container mx-auto mb-8" style="width: 300px; height: 300px; position: relative;">
            <!-- Wheel Background -->
            <div class="wheel-background absolute inset-0 rounded-full bg-gradient-to-br from-purple-800 via-pink-700 to-purple-800 border-8 border-yellow-400 shadow-2xl">
                                 <!-- Wheel Sections -->
                 <div id="wheel-spinner" class="wheel-spinner absolute inset-2 rounded-full overflow-hidden">
                     <!-- Boy Section 1 (0-60deg) -->
                     <div class="wheel-section absolute inset-0" style="clip-path: polygon(50% 50%, 100% 50%, 87% 13%);">
                         <div class="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                             <div class="transform rotate-30 text-white font-bold text-sm">👶 BOY</div>
                         </div>
                     </div>
                     
                     <!-- Girl Section 1 (60-120deg) -->
                     <div class="wheel-section absolute inset-0" style="clip-path: polygon(50% 50%, 87% 13%, 87% 87%);">
                         <div class="absolute inset-0 bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                             <div class="transform rotate-90 text-white font-bold text-sm">👶 GIRL</div>
                         </div>
                     </div>
                     
                     <!-- Boy Section 2 (120-180deg) -->
                     <div class="wheel-section absolute inset-0" style="clip-path: polygon(50% 50%, 87% 87%, 50% 100%);">
                         <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                             <div class="transform rotate-150 text-white font-bold text-sm">👶 BOY</div>
                         </div>
                     </div>
                     
                     <!-- Girl Section 2 (180-240deg) -->
                     <div class="wheel-section absolute inset-0" style="clip-path: polygon(50% 50%, 50% 100%, 13% 87%);">
                         <div class="absolute inset-0 bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center">
                             <div class="transform rotate-210 text-white font-bold text-sm">👶 GIRL</div>
                         </div>
                     </div>
                     
                     <!-- Boy Section 3 (240-300deg) -->
                     <div class="wheel-section absolute inset-0" style="clip-path: polygon(50% 50%, 13% 87%, 13% 13%);">
                         <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                             <div class="transform rotate-270 text-white font-bold text-sm">👶 BOY</div>
                         </div>
                     </div>
                     
                     <!-- Girl Section 3 (300-360deg) -->
                     <div class="wheel-section absolute inset-0" style="clip-path: polygon(50% 50%, 13% 13%, 100% 50%);">
                         <div class="absolute inset-0 bg-gradient-to-br from-pink-600 to-pink-800 flex items-center justify-center">
                             <div class="transform rotate-330 text-white font-bold text-sm">👶 GIRL</div>
                         </div>
                     </div>
                 </div>
                
                <!-- Center Hub -->
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <div class="w-4 h-4 bg-yellow-600 rounded-full"></div>
                </div>
            </div>
            
            <!-- Pointer -->
            <div class="wheel-pointer absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div class="w-0 h-0 border-l-6 border-r-6 border-b-12 border-transparent border-b-white shadow-lg"></div>
            </div>
        </div>
        
        <!-- Spin Button -->
        <div class="spin-controls">
            <button id="spin-wheel-btn" class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse">
                🎲 SPIN THE WHEEL! 🎲
            </button>
        </div>
        
        <!-- Result Display (hidden initially) -->
        <div id="wheel-result" class="wheel-result mt-8 hidden">
            <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md mx-auto">
                <h2 class="text-3xl font-bold text-white mb-4" id="wheel-result-text"></h2>
                <div class="text-6xl mb-4" id="wheel-result-emoji"></div>
                <p class="text-xl text-white/90" id="wheel-result-message"></p>
            </div>
        </div>
    `;
    
    container.appendChild(wheelContainer);
    
    // Add event listener to spin button
    document.getElementById('spin-wheel-btn').addEventListener('click', spinWheel);
}

function startCountdown() {
    console.log('Starting countdown'); // Debug log
    
    const countdownOverlay = document.createElement('div');
    countdownOverlay.className = 'countdown-overlay fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';
    countdownOverlay.innerHTML = `
        <div class="text-center">
            <div id="countdown-number" class="text-8xl md:text-9xl font-bold text-white mb-4">3</div>
            <div class="text-2xl text-white/90">Get ready to spin!</div>
        </div>
    `;
    
    document.body.appendChild(countdownOverlay);
    
    let count = 3;
    const countdownNumber = document.getElementById('countdown-number');
    
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownNumber.textContent = count;
            countdownNumber.style.transform = 'scale(1.2)';
            setTimeout(() => {
                countdownNumber.style.transform = 'scale(1)';
            }, 200);
        } else {
            countdownNumber.textContent = 'SPIN!';
            countdownNumber.style.color = '#fbbf24';
            setTimeout(() => {
                document.body.removeChild(countdownOverlay);
                // Auto-spin after countdown
                document.getElementById('spin-wheel-btn').click();
            }, 1000);
            clearInterval(countdownInterval);
        }
    }, 1000);
}

function spinWheel() {
    console.log('Spinning wheel for gender:', targetGender); // Debug log
    
    const spinner = document.getElementById('wheel-spinner');
    const spinBtn = document.getElementById('spin-wheel-btn');
    
    if (!spinner || !spinBtn) {
        console.error('Wheel elements not found');
        return;
    }
    
    // Disable the spin button
    spinBtn.disabled = true;
    spinBtn.textContent = 'SPINNING...';
    spinBtn.classList.remove('animate-pulse');
    
    // Play spin sound
    playWheelSpinSound();
    
    // Calculate target rotation
    const baseRotation = 1800; // 5 full rotations
    let targetRotation;
    
    // Define gender section ranges (in degrees) - 6 equal sections of 60 degrees each
    // Boy sections: 0-60, 120-180, 240-300 (total: 180 degrees)
    // Girl sections: 60-120, 180-240, 300-360 (total: 180 degrees)
    
    if (targetGender === 'boy') {
        // Land in boy sections (centers at 30°, 150°, 270°)
        const boyOptions = [30, 150, 270];
        targetRotation = baseRotation + boyOptions[Math.floor(Math.random() * boyOptions.length)];
    } else {
        // Land in girl sections (centers at 90°, 210°, 330°)
        const girlOptions = [90, 210, 330];
        targetRotation = baseRotation + girlOptions[Math.floor(Math.random() * girlOptions.length)];
    }
    
    // Add some randomness within the section
    targetRotation += (Math.random() - 0.5) * 25;
    
    console.log('Target rotation:', targetRotation); // Debug log
    
    // Apply the spin animation
    spinner.style.setProperty('--spin-degrees', `${targetRotation}deg`);
    spinner.style.setProperty('--spin-duration', '4s');
    spinner.classList.add('wheel-spinning');
    
    // Show result after animation
    setTimeout(() => {
        showWheelResult();
    }, 4500);
}

function showWheelResult() {
    console.log('Showing wheel result for:', targetGender); // Debug log
    
    const resultDiv = document.getElementById('wheel-result');
    const resultText = document.getElementById('wheel-result-text');
    const resultEmoji = document.getElementById('wheel-result-emoji');
    const resultMessage = document.getElementById('wheel-result-message');
    
    if (!resultDiv || !resultText || !resultEmoji || !resultMessage) {
        console.error('Result elements not found');
        return;
    }
    
    // Configure result based on gender
    if (targetGender === 'boy') {
        resultText.textContent = "It's a Boy!";
        resultEmoji.textContent = "👶💙";
        resultMessage.textContent = "Congratulations on your little prince!";
        resultDiv.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))';
    } else {
        resultText.textContent = "It's a Girl!";
        resultEmoji.textContent = "👶💗";
        resultMessage.textContent = "Congratulations on your little princess!";
        resultDiv.style.background = 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(219, 39, 119, 0.2))';
    }
    
    // Show result with animation
    resultDiv.classList.remove('hidden');
    resultDiv.style.opacity = '0';
    resultDiv.style.transform = 'translateY(50px)';
    
    setTimeout(() => {
        resultDiv.style.transition = 'all 0.6s ease';
        resultDiv.style.opacity = '1';
        resultDiv.style.transform = 'translateY(0)';
    }, 100);
    
    // Add confetti effect
    createConfetti();
    
    // Track completion
    if (typeof trackEvent === 'function') {
        trackEvent('wheel_completed', {
            gender: targetGender,
            animation: 'wheel'
        });
    }
    
    // Show celebration and next steps after a delay
    setTimeout(() => {
        showCelebrationOptions();
    }, 3000);
}

function createConfetti() {
    console.log('Creating confetti effect'); // Debug log
    
    const colors = targetGender === 'boy' 
        ? ['#3b82f6', '#1d4ed8', '#60a5fa', '#93c5fd'] 
        : ['#ec4899', '#db2777', '#f472b6', '#fbb6ce'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.animation = `fall ${Math.random() * 2 + 3}s linear forwards`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 5000);
    }
}

function showCelebrationOptions() {
    console.log('Showing celebration options'); // Debug log
    
    const container = document.querySelector('.wheel-container');
    if (!container) {
        console.error('Wheel container not found');
        return;
    }
    
    const celebrationDiv = document.createElement('div');
    celebrationDiv.className = 'celebration-options mt-8 text-center';
    celebrationDiv.innerHTML = `
        <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 max-w-md mx-auto">
            <h3 class="text-2xl font-bold text-white mb-4">🎉 Celebrate! 🎉</h3>
            <div class="space-y-3">
                <button onclick="location.reload()" 
                        class="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-3 px-6 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                    🔄 Spin Again
                </button>
                <button onclick="shareResult()" 
                        class="w-full bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold py-3 px-6 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                    📱 Share the News
                </button>
                <button onclick="window.history.back()" 
                        class="w-full bg-gradient-to-r from-gray-400 to-gray-600 text-white font-bold py-3 px-6 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                    ← Choose Different Animation
                </button>
            </div>
        </div>
    `;
    
    container.appendChild(celebrationDiv);
}

function shareResult() {
    const text = targetGender === 'boy' 
        ? "🎉 It's a Boy! 👶💙 We revealed it with a Wheel of Fortune! #GenderReveal #ItsABoy"
        : "🎉 It's a Girl! 👶💗 We revealed it with a Wheel of Fortune! #GenderReveal #ItsAGirl";
    
    if (navigator.share) {
        navigator.share({
            title: 'Gender Reveal Results!',
            text: text,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            alert('Result copied to clipboard! You can now paste it to share.');
        }).catch(() => {
            alert('Share text: ' + text);
        });
    }
}

// Add CSS for confetti animation
if (!document.getElementById('confetti-styles')) {
    const style = document.createElement('style');
    style.id = 'confetti-styles';
    style.textContent = `
        @keyframes fall {
            0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Global functions
window.initWheel = initWheel;
window.shareResult = shareResult;