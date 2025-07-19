// Slot Machine Animation for Gender Reveal

let slotMachineActive = false;
let targetGender = 'boy';
let spinSounds = [];

function initSlotMachine(gender) {
    console.log('initSlotMachine called with gender:', gender); // Debug log
    
    // Validate gender parameter
    if (!gender || (gender !== 'boy' && gender !== 'girl')) {
        console.error('Invalid gender provided to initSlotMachine:', gender);
        console.log('Defaulting to boy');
        gender = 'boy';
    }
    
    targetGender = gender;
    slotMachineActive = true;
    
    console.log('Slot machine initialized with target gender:', targetGender); // Debug log
    
    // Initialize sounds
    initSounds();
    
    // Start the slot machine animation sequence
    setTimeout(() => {
        startSlotSequence();
    }, 500);
}

function initSounds() {
    // Create multiple spin sound instances for overlapping
    for (let i = 0; i < 3; i++) {
        const sound = new Audio();
        sound.volume = 0.3;
        // Using a simple beep sound as fallback since we don't have audio files
        sound.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGEbBjaN1vLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGEbBjaN1vLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGEbBjaN1vLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGEbBjaN1vLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGEbBjaN1vLNeSsF';
        spinSounds.push(sound);
    }
}

function playSpinSound() {
    // Find an available sound instance
    const availableSound = spinSounds.find(sound => sound.paused || sound.ended);
    if (availableSound) {
        availableSound.currentTime = 0;
        availableSound.play().catch(e => console.log('Audio play failed:', e));
    }
}

function startSlotSequence() {
    // Reset any previous state
    resetSlotMachine();
    
    // Add anticipation effect
    addAnticipationEffect();
    
    // Animate the handle being pulled
    setTimeout(() => {
        animateHandle();
        
        // Start spinning reels with staggered timing
        setTimeout(() => spinReel('reel1', 3000), 300);
        setTimeout(() => spinReel('reel2', 4000), 700);
        setTimeout(() => spinReel('reel3', 5000), 1100);
        
        // Show result after all reels stop
        setTimeout(() => {
            showFinalResult();
        }, 6500);
    }, 1000);
}

function animateHandle() {
    const handle = document.querySelector('.handle');
    if (handle) {
        handle.classList.add('pulled');
        
        setTimeout(() => {
            handle.classList.remove('pulled');
        }, 500);
    }
}

function spinReel(reelId, duration) {
    const reel = document.getElementById(reelId);
    if (!reel) return;
    
    const reelItems = reel.querySelector('.reel-items');
    if (!reelItems) return;
    
    // Play spin sound
    playSpinSound();
    
    // Set up the reel items based on target gender
    setupReelItems(reelItems, reelId);
    
    let startTime = Date.now();
    let spinSpeed = 50; // Initial speed
    let currentPosition = 0;
    
    function animateReel() {
        if (!slotMachineActive) return;
        
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        if (progress < 1) {
            // Gradually slow down the spinning
            const slowdownFactor = Math.max(0.1, 1 - progress);
            spinSpeed = 50 * slowdownFactor;
            
            currentPosition -= spinSpeed;
            reelItems.style.transform = `translateY(${currentPosition}px)`;
            
            requestAnimationFrame(animateReel);
        } else {
            // Stop at the target position
            stopReelAtTarget(reelItems, reelId);
        }
    }
    
    animateReel();
}

function setupReelItems(reelItems, reelId) {
    // Clear existing items
    reelItems.innerHTML = '';
    
    // Create items for spinning
    const boyItems = ['B', 'O', 'Y'];
    const girlItems = ['G', 'I', 'R', 'L'];
    const randomItems = ['X', '?', '★', '♦', '♠', '♣', '♥', '#', '@', '%', '&', '!'];
    
    // Get the target letter for this reel
    let targetLetter;
    if (targetGender === 'boy') {
        targetLetter = boyItems[getReelIndex(reelId)];
    } else {
        targetLetter = girlItems[getReelIndex(reelId)];
    }
    
    // Create a long list of items for spinning effect
    const items = [];
    
    // Add many random items with some variety
    for (let i = 0; i < 30; i++) {
        const randomItem = randomItems[Math.floor(Math.random() * randomItems.length)];
        items.push(randomItem);
    }
    
    // Add some teaser letters (mix of boy/girl letters)
    const allLetters = [...boyItems, ...girlItems];
    for (let i = 0; i < 15; i++) {
        const randomLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
        items.push(randomLetter);
    }
    
    // Add more random items
    for (let i = 0; i < 10; i++) {
        const randomItem = randomItems[Math.floor(Math.random() * randomItems.length)];
        items.push(randomItem);
    }
    
    // Add the target letter at the end
    items.push(targetLetter);
    
    // Create DOM elements
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'reel-item';
        div.textContent = item;
        reelItems.appendChild(div);
    });
}

function getReelIndex(reelId) {
    switch (reelId) {
        case 'reel1': return 0;
        case 'reel2': return 1;
        case 'reel3': return 2;
        default: return 0;
    }
}

function stopReelAtTarget(reelItems, reelId) {
    // Calculate position to show the last item (target letter)
    const items = reelItems.children;
    const itemHeight = 160; // Height from CSS
    const targetPosition = -(items.length - 1) * itemHeight;
    
    reelItems.style.transform = `translateY(${targetPosition}px)`;
    reelItems.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    // Add winning effect to the target item
    const targetItem = items[items.length - 1];
    if (targetItem) {
        setTimeout(() => {
            targetItem.style.background = 'linear-gradient(45deg, #ffd700, #ffed4e)';
            targetItem.style.boxShadow = `0 0 30px ${targetGender === 'boy' ? '#3b82f6' : '#ec4899'}`;
            targetItem.style.transform = 'scale(1.1)';
            targetItem.style.transition = 'all 0.5s ease';
            targetItem.style.borderRadius = '8px';
            
            // Add pulsing glow effect
            targetItem.style.animation = 'winnerPulse 1s infinite';
        }, 500);
    }
}

function showFinalResult() {
    // Determine result text
    const resultText = targetGender === 'boy' ? 'IT\'S A BOY!' : 'IT\'S A GIRL!';
    
    console.log('Showing final result for:', targetGender); // Debug log
    console.log('Result text:', resultText); // Debug log
    
    // Add dramatic build-up effect
    addDramaticBuildUp();
    
    // Play celebration sound (if available)
    const winSound = document.getElementById('winSound');
    if (winSound) {
        winSound.play().catch(e => console.log('Win sound failed:', e));
    }
    
    // Add dramatic pause before showing result
    setTimeout(() => {
        // Add screen flash effect
        flashScreen();
        
        // Add sparkles effect
        addSparkles();
        
        // Hide slot machine with fade
        const slotMachine = document.getElementById('slotMachine');
        if (slotMachine) {
            slotMachine.style.opacity = '0.2';
            slotMachine.style.transition = 'opacity 1s ease';
        }
        
        // Show result using the global function from reveal.js
        if (typeof showResult === 'function') {
            console.log('Calling showResult function'); // Debug log
            showResult(resultText, true);
        } else {
            console.error('showResult function not found - animation may have lost connection to reveal page');
            // Fallback: show result directly
            showFallbackResult(resultText);
        }
        
    }, 2000);
}

function showFallbackResult(resultText) {
    console.log('Using fallback result display'); // Debug log
    const result = document.getElementById('result');
    const resultTextElement = document.getElementById('resultText');
    
    if (result && resultTextElement) {
        resultTextElement.textContent = resultText;
        resultTextElement.style.background = targetGender === 'boy' ? 
            'linear-gradient(45deg, #3b82f6, #1d4ed8)' : 
            'linear-gradient(45deg, #ec4899, #be185d)';
        resultTextElement.style.webkitBackgroundClip = 'text';
        resultTextElement.style.webkitTextFillColor = 'transparent';
        
        result.classList.remove('hidden');
        console.log('Fallback result displayed'); // Debug log
    } else {
        console.error('Result elements not found even in fallback'); // Debug log
    }
}

function addDramaticBuildUp() {
    // Add pulsing effect to all winning letters
    const allReels = document.querySelectorAll('.slot-reel');
    allReels.forEach((reel, index) => {
        setTimeout(() => {
            reel.style.transform = 'scale(1.1)';
            reel.style.boxShadow = `0 0 30px ${targetGender === 'boy' ? '#3b82f6' : '#ec4899'}`;
            reel.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                reel.style.transform = 'scale(1)';
            }, 500);
        }, index * 300);
    });
}

function flashScreen() {
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${targetGender === 'boy' ? '#3b82f6' : '#ec4899'};
        opacity: 0;
        pointer-events: none;
        z-index: 9999;
        animation: flashEffect 1s ease-out;
    `;
    
    document.body.appendChild(flash);
    
    // Add flash animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes flashEffect {
            0% { opacity: 0; }
            30% { opacity: 0.8; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        document.body.removeChild(flash);
        document.head.removeChild(style);
    }, 1000);
}

// Additional visual effects
function addSparkles() {
    const sparkleContainer = document.createElement('div');
    sparkleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1000;
    `;
    
    document.body.appendChild(sparkleContainer);
    
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.cssText = `
            position: absolute;
            font-size: 2rem;
            animation: sparkleFloat 3s ease-out forwards;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        sparkleContainer.appendChild(sparkle);
    }
    
    // Add sparkle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkleFloat {
            0% {
                transform: translateY(0) scale(0);
                opacity: 0;
            }
            50% {
                transform: translateY(-50px) scale(1);
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        document.body.removeChild(sparkleContainer);
        document.head.removeChild(style);
    }, 5000);
}

// Add anticipation effect before starting
function addAnticipationEffect() {
    const slotMachine = document.getElementById('slotMachine');
    if (slotMachine) {
        slotMachine.style.transform = 'scale(1.02)';
        slotMachine.style.transition = 'transform 0.8s ease-in-out';
        
        setTimeout(() => {
            slotMachine.style.transform = 'scale(1)';
        }, 800);
    }
}

// Reset function for replay
function resetSlotMachine() {
    slotMachineActive = false;
    
    // Reset all reels
    ['reel1', 'reel2', 'reel3'].forEach(reelId => {
        const reel = document.getElementById(reelId);
        if (reel) {
            const reelItems = reel.querySelector('.reel-items');
            if (reelItems) {
                // Clear all styles and animations
                reelItems.style.cssText = '';
                reelItems.style.transform = 'translateY(0)';
                reelItems.style.transition = 'none';
                
                // Reset to initial state with question marks
                reelItems.innerHTML = `
                    <div class="reel-item">?</div>
                    <div class="reel-item">?</div>
                    <div class="reel-item">?</div>
                `;
            }
            
            // Reset reel styling
            reel.style.cssText = '';
        }
    });
    
    // Reset slot machine opacity and transform
    const slotMachine = document.getElementById('slotMachine');
    if (slotMachine) {
        slotMachine.style.opacity = '1';
        slotMachine.style.transform = 'scale(1)';
        slotMachine.style.transition = '';
    }
    
    // Hide result if visible
    const result = document.getElementById('result');
    if (result) {
        result.classList.add('hidden');
    }
    
    // Clear any lingering animations or effects
    const flashElements = document.querySelectorAll('.flash-effect');
    flashElements.forEach(el => el.remove());
    
    const sparkleElements = document.querySelectorAll('.sparkle-effect');
    sparkleElements.forEach(el => el.remove());
}

// Export functions
window.initSlotMachine = initSlotMachine;
window.resetSlotMachine = resetSlotMachine;