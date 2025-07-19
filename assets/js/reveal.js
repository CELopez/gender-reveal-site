// Reveal Page JavaScript - Handles pre-reveal screen and animation trigger

let revealData = null;

document.addEventListener('DOMContentLoaded', function() {
    initRevealPage();
});

function initRevealPage() {
    // Get reveal data from URL parameters or sessionStorage
    revealData = getRevealData();
    
    if (!revealData || !revealData.animation || !revealData.gender) {
        // Redirect back to choose page if no valid data
        redirectToChoose();
        return;
    }
    
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

function getRevealData() {
    // First try URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const animation = urlParams.get('animation');
    const gender = urlParams.get('gender');
    
    if (animation && gender) {
        return { animation, gender };
    }
    
    // Fallback to sessionStorage
    try {
        const stored = sessionStorage.getItem('genderRevealSelections');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error reading stored selections:', e);
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
        
        // Initialize slot machine animation
        if (typeof initSlotMachine === 'function') {
            initSlotMachine(revealData.gender);
        } else {
            console.error('Slot machine animation not loaded');
        }
    }
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
    // Hide result
    const result = document.getElementById('result');
    if (result) {
        result.classList.add('hidden');
    }
    
    // Restart the animation
    startSlotMachineAnimation();
    
    // Track replay
    if (typeof trackEvent === 'function') {
        trackEvent('animation_replayed', {
            animation: revealData.animation,
            gender: revealData.gender
        });
    }
}

function redirectToChoose() {
    const baseUrl = window.location.origin + window.location.pathname.replace('/reveal.html', '');
    window.location.href = baseUrl + '/choose.html';
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