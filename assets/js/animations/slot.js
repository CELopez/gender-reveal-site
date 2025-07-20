// Enhanced Slot Machine Animation with GSAP, Pixi.js, and Howler.js
// High-quality casino-style slot machine for gender reveal

class SlotMachine {
    constructor() {
        this.targetGender = 'boy';
        this.isActive = false;
        this.pixiApp = null;
        this.reels = [];
        this.sounds = {};
        this.particles = null;
        
        // Animation settings
        this.REEL_WIDTH = 180;
        this.REEL_HEIGHT = 400;
        this.SYMBOL_HEIGHT = 120;
        this.NUM_SYMBOLS = 8;
        this.SPIN_DURATION = { min: 2000, max: 5000 };
        
        // Symbol configurations
        this.SYMBOLS = {
            boy: ['B', 'O', 'Y'],
            girl: ['G', 'I', 'R', 'L'],
            random: ['★', '♦', '♠', '♣', '♥', '✨', '💫', '🎯', '🎪', '🎭', '🎨', '🎲']
        };
        
        this.init();
    }
    
    async init() {
        await this.initSounds();
        this.initPixi();
        this.setupEventListeners();
    }
    
    async initSounds() {
        // Generate high-quality procedural audio
        const soundGenerator = new SoundGenerator();
        const soundUrls = soundGenerator.generateAllSounds();
        
        // Initialize Howler.js sounds with procedurally generated audio
        this.sounds = {
            anticipation: new Howl({
                src: [soundUrls.anticipation],
                volume: 0.4,
                rate: 0.8,
                loop: false
            }),
            
            handlePull: new Howl({
                src: [soundUrls.handlePull],
                volume: 0.6,
                rate: 1.0,
                loop: false
            }),
            
            reelSpin: new Howl({
                src: [soundUrls.reelSpin],
                volume: 0.3,
                rate: 1.2,
                loop: true
            }),
            
            reelStop: new Howl({
                src: [soundUrls.reelStop],
                volume: 0.5,
                rate: 0.9,
                loop: false
            }),
            
            jackpot: new Howl({
                src: [soundUrls.jackpot],
                volume: 0.8,
                rate: 1.0,
                loop: false
            }),
            
            celebration: new Howl({
                src: [soundUrls.celebration],
                volume: 0.7,
                rate: 1.0,
                loop: false
            })
        };
        
        console.log('High-quality procedural sounds initialized');
    }
    
    initPixi() {
        const canvas = document.getElementById('slotCanvas');
        if (!canvas) return;
        
        // Initialize Pixi Application
        this.pixiApp = new PIXI.Application({
            view: canvas,
            width: 800,
            height: 600,
            backgroundColor: 0x0a0a0a,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true
        });
        
        // Create reels container
        this.reelsContainer = new PIXI.Container();
        this.pixiApp.stage.addChild(this.reelsContainer);
        
        // Initialize individual reels
        this.initReels();
        
        // Add visual effects
        this.initParticleSystem();
        this.initLightingEffects();
    }
    
    initReels() {
        const numReels = this.targetGender === 'boy' ? 3 : 4;
        const startX = (800 - (numReels * this.REEL_WIDTH + (numReels - 1) * 20)) / 2;
        
        for (let i = 0; i < numReels; i++) {
            const reel = this.createReel(i, startX + i * (this.REEL_WIDTH + 20));
            this.reels.push(reel);
            this.reelsContainer.addChild(reel.container);
        }
    }
    
    createReel(index, x) {
        const container = new PIXI.Container();
        container.x = x;
        container.y = 100;
        
        // Create reel background
        const background = new PIXI.Graphics();
        background.beginFill(0x1a1a1a);
        background.drawRoundedRect(0, 0, this.REEL_WIDTH, this.REEL_HEIGHT, 10);
        background.endFill();
        
        // Add metallic border
        background.lineStyle(4, 0x888888);
        background.drawRoundedRect(2, 2, this.REEL_WIDTH - 4, this.REEL_HEIGHT - 4, 8);
        
        container.addChild(background);
        
        // Create mask for reel symbols
        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRoundedRect(10, 10, this.REEL_WIDTH - 20, this.REEL_HEIGHT - 20, 5);
        mask.endFill();
        container.addChild(mask);
        
        // Create symbol container
        const symbolContainer = new PIXI.Container();
        symbolContainer.mask = mask;
        container.addChild(symbolContainer);
        
        // Generate symbols for this reel
        const symbols = this.generateSymbolsForReel(index);
        const symbolSprites = [];
        
        symbols.forEach((symbol, i) => {
            const text = new PIXI.Text(symbol, {
                fontFamily: 'Arial Black',
                fontSize: 80,
                fill: this.getSymbolColor(symbol),
                align: 'center',
                stroke: '#000000',
                strokeThickness: 3,
                dropShadow: true,
                dropShadowColor: '#000000',
                dropShadowBlur: 4,
                dropShadowDistance: 2
            });
            
            text.anchor.set(0.5);
            text.x = this.REEL_WIDTH / 2;
            text.y = i * this.SYMBOL_HEIGHT + this.SYMBOL_HEIGHT / 2;
            
            symbolSprites.push(text);
            symbolContainer.addChild(text);
        });
        
        return {
            container,
            symbolContainer,
            symbols: symbolSprites,
            mask,
            isSpinning: false,
            spinSpeed: 0,
            targetPosition: 0
        };
    }
    
    generateSymbolsForReel(reelIndex) {
        const symbols = [];
        const targetSymbols = this.targetGender === 'boy' ? this.SYMBOLS.boy : this.SYMBOLS.girl;
        const targetSymbol = targetSymbols[reelIndex];
        
        // Add random symbols for spinning effect
        for (let i = 0; i < 20; i++) {
            const randomSymbol = this.SYMBOLS.random[Math.floor(Math.random() * this.SYMBOLS.random.length)];
            symbols.push(randomSymbol);
        }
        
        // Add some teaser symbols
        [...this.SYMBOLS.boy, ...this.SYMBOLS.girl].forEach(symbol => {
            if (Math.random() < 0.3) {
                symbols.push(symbol);
            }
        });
        
        // Add more random symbols
        for (let i = 0; i < 15; i++) {
            const randomSymbol = this.SYMBOLS.random[Math.floor(Math.random() * this.SYMBOLS.random.length)];
            symbols.push(randomSymbol);
        }
        
        // Add target symbol at the end
        symbols.push(targetSymbol);
        
        return symbols;
    }
    
    getSymbolColor(symbol) {
        if (this.SYMBOLS.boy.includes(symbol)) return '#3b82f6';
        if (this.SYMBOLS.girl.includes(symbol)) return '#ec4899';
        return '#ffd700';
    }
    
    initParticleSystem() {
        // Create particle container for special effects
        this.particles = new PIXI.ParticleContainer(1000, {
            scale: true,
            position: true,
            rotation: true,
            alpha: true
        });
        this.pixiApp.stage.addChild(this.particles);
    }
    
    initLightingEffects() {
        // Add dynamic lighting effects around the reels
        const lightingContainer = new PIXI.Container();
        
        for (let i = 0; i < 5; i++) {
            const light = new PIXI.Graphics();
            light.beginFill(0xffd700, 0.3);
            light.drawCircle(0, 0, 20);
            light.endFill();
            
            light.x = Math.random() * 800;
            light.y = Math.random() * 600;
            
            lightingContainer.addChild(light);
            
            // Animate lights
            gsap.to(light, {
                alpha: 0.1,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut",
                delay: i * 0.3
            });
        }
        
        this.pixiApp.stage.addChild(lightingContainer);
    }
    
    setupEventListeners() {
        const handle = document.getElementById('handleGrip');
        if (handle) {
            handle.addEventListener('click', () => this.pullHandle());
        }
    }
    
    pullHandle() {
        if (this.isActive) return;
        
        // Animate handle with GSAP
        const handle = document.getElementById('slotHandle');
        gsap.to(handle, {
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
                gsap.to(handle, {
                    duration: 0.4,
                    ease: "bounce.out"
                });
            }
        });
        
        // Add handle-pulled class for CSS animation
        handle.classList.add('handle-pulled');
        setTimeout(() => handle.classList.remove('handle-pulled'), 700);
        
        // Play handle sound
        this.sounds.handlePull.play();
        
        // Start the slot sequence
        this.startSlotSequence();
    }
    
    async startSlotSequence() {
        this.isActive = true;
        
        // Play anticipation sound
        this.sounds.anticipation.play();
        
        // Add anticipation effects with GSAP
        this.addAnticipationEffects();
        
        await this.delay(1000);
        
        // Start spinning reels with staggered timing
        this.sounds.reelSpin.play();
        
        const spinPromises = this.reels.map((reel, index) => {
            return this.delay(index * 300).then(() => this.spinReel(reel, index));
        });
        
        await Promise.all(spinPromises);
        
        // Stop reel sound
        this.sounds.reelSpin.stop();
        
        // Show final result
        await this.delay(500);
        await this.showFinalResult();
    }
    
    addAnticipationEffects() {
        const container = document.querySelector('.slot-machine-container');
        container.classList.add('anticipation-glow');
        
        // Camera shake effect
        gsap.to(this.pixiApp.stage, {
            x: "+=5",
            duration: 0.1,
            repeat: 10,
            yoyo: true,
            ease: "power2.inOut"
        });
        
        // Title animation
        const title = document.getElementById('slotTitle');
        gsap.fromTo(title, 
            { scale: 1 },
            { 
                scale: 1.1,
                duration: 1,
                repeat: 3,
                yoyo: true,
                ease: "power2.inOut"
            }
        );
    }
    
    async spinReel(reel, index) {
        reel.isSpinning = true;
        reel.spinSpeed = 20 + Math.random() * 30;
        
        const duration = this.SPIN_DURATION.min + index * 500 + Math.random() * 1000;
        const startTime = Date.now();
        
        return new Promise((resolve) => {
            const animate = () => {
                if (!reel.isSpinning) {
                    resolve();
                    return;
                }
                
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress >= 1) {
                    this.stopReel(reel, index);
                    resolve();
                    return;
                }
                
                // Gradually slow down
                const slowdownFactor = Math.max(0.1, 1 - progress * 0.8);
                reel.spinSpeed *= slowdownFactor;
                
                // Move symbols
                reel.symbols.forEach((symbol, i) => {
                    symbol.y -= reel.spinSpeed;
                    
                    // Wrap around when symbol goes off screen
                    if (symbol.y < -this.SYMBOL_HEIGHT) {
                        symbol.y += reel.symbols.length * this.SYMBOL_HEIGHT;
                    }
                });
                
                // Add visual effects during spinning
                if (Math.random() < 0.1) {
                    this.addSparkleEffect(reel.container.x + this.REEL_WIDTH / 2, reel.container.y + this.REEL_HEIGHT / 2);
                }
                
                requestAnimationFrame(animate);
            };
            
            animate();
        });
    }
    
    stopReel(reel, index) {
        reel.isSpinning = false;
        
        // Play stop sound
        this.sounds.reelStop.play();
        
        // Position the target symbol in the center
        const targetSymbolIndex = reel.symbols.length - 1; // Last symbol is our target
        const targetY = this.REEL_HEIGHT / 2;
        const currentY = reel.symbols[targetSymbolIndex].y;
        const deltaY = targetY - currentY;
        
        // Animate smooth stop with GSAP
        gsap.to(reel.symbolContainer, {
            y: deltaY,
            duration: 0.5,
            ease: "back.out(1.7)",
            onComplete: () => {
                // Add winning glow effect
                this.addWinningEffect(reel, index);
            }
        });
    }
    
    addWinningEffect(reel, index) {
        const targetSymbol = reel.symbols[reel.symbols.length - 1];
        
        // Create glow filter
        const glowFilter = new PIXI.filters.GlowFilter(15, 2, 1, this.targetGender === 'boy' ? 0x3b82f6 : 0xec4899, 0.5);
        targetSymbol.filters = [glowFilter];
        
        // Animate glow intensity
        gsap.to(glowFilter, {
            outerStrength: 4,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });
        
        // Scale animation
        gsap.to(targetSymbol.scale, {
            x: 1.2,
            y: 1.2,
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });
        
        // Add particle burst
        this.addParticleBurst(reel.container.x + this.REEL_WIDTH / 2, reel.container.y + this.REEL_HEIGHT / 2);
    }
    
    addSparkleEffect(x, y) {
        const sparkle = new PIXI.Graphics();
        sparkle.beginFill(0xffd700);
        sparkle.drawStar(0, 0, 4, 8, 4);
        sparkle.endFill();
        sparkle.x = x + (Math.random() - 0.5) * 100;
        sparkle.y = y + (Math.random() - 0.5) * 100;
        
        this.particles.addChild(sparkle);
        
        gsap.to(sparkle, {
            alpha: 0,
            scale: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
                this.particles.removeChild(sparkle);
            }
        });
    }
    
    addParticleBurst(x, y) {
        for (let i = 0; i < 20; i++) {
            const particle = new PIXI.Graphics();
            particle.beginFill(Math.random() > 0.5 ? 0xffd700 : (this.targetGender === 'boy' ? 0x3b82f6 : 0xec4899));
            particle.drawCircle(0, 0, 3 + Math.random() * 3);
            particle.endFill();
            
            particle.x = x;
            particle.y = y;
            
            this.particles.addChild(particle);
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            
            gsap.to(particle, {
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                alpha: 0,
                duration: 1 + Math.random(),
                ease: "power2.out",
                onComplete: () => {
                    this.particles.removeChild(particle);
                }
            });
        }
    }
    
    async showFinalResult() {
        // Play jackpot sound
        this.sounds.jackpot.play();
        
        // Screen flash effect
        this.createScreenFlash();
        
        await this.delay(1000);
        
        // Hide slot machine with smooth animation
        gsap.to(this.pixiApp.view, {
            alpha: 0.3,
            scale: 0.8,
            duration: 1,
            ease: "power2.inOut"
        });
        
        // Create massive particle explosion
        this.createVictoryExplosion();
        
        // Play celebration sound
        setTimeout(() => this.sounds.celebration.play(), 500);
        
        // Show result text
        const resultText = this.targetGender === 'boy' ? "IT'S A BOY!" : "IT'S A GIRL!";
        
        if (typeof showResult === 'function') {
            showResult(resultText, true);
        } else {
            this.showFallbackResult(resultText);
        }
        
        await this.delay(2000);
        this.isActive = false;
    }
    
    createScreenFlash() {
        const flash = document.createElement('div');
        flash.className = 'screen-flash';
        flash.style.background = this.targetGender === 'boy' ? 
            'linear-gradient(45deg, #3b82f6, #1d4ed8)' : 
            'linear-gradient(45deg, #ec4899, #be185d)';
        
        document.body.appendChild(flash);
        
        gsap.fromTo(flash, 
            { opacity: 0 },
            { 
                opacity: 0.8,
                duration: 0.3,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(flash, {
                        opacity: 0,
                        duration: 0.7,
                        ease: "power2.inOut",
                        onComplete: () => {
                            document.body.removeChild(flash);
                        }
                    });
                }
            }
        );
    }
    
    createVictoryExplosion() {
        const centerX = 400;
        const centerY = 300;
        
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                this.addParticleBurst(
                    centerX + (Math.random() - 0.5) * 600,
                    centerY + (Math.random() - 0.5) * 400
                );
            }, i * 50);
        }
    }
    
    showFallbackResult(resultText) {
        const result = document.getElementById('result');
        const resultTextElement = document.getElementById('resultText');
        
        if (result && resultTextElement) {
            resultTextElement.textContent = resultText;
            result.classList.remove('hidden');
            
            gsap.fromTo(resultTextElement,
                { scale: 0, rotation: -180 },
                { 
                    scale: 1,
                    rotation: 0,
                    duration: 1,
                    ease: "back.out(1.7)"
                }
            );
        }
    }
    
    reset() {
        this.isActive = false;
        
        // Stop all sounds
        Object.values(this.sounds).forEach(sound => sound.stop());
        
        // Reset Pixi app
        if (this.pixiApp) {
            gsap.killTweensOf(this.pixiApp.stage);
            gsap.killTweensOf(this.pixiApp.view);
            gsap.set(this.pixiApp.view, { alpha: 1, scale: 1 });
            gsap.set(this.pixiApp.stage, { x: 0 });
        }
        
        // Clear particles
        if (this.particles) {
            this.particles.removeChildren();
        }
        
        // Reset reels
        this.reels.forEach(reel => {
            reel.isSpinning = false;
            gsap.killTweensOf(reel.symbolContainer);
            gsap.set(reel.symbolContainer, { y: 0 });
            
            reel.symbols.forEach(symbol => {
                symbol.filters = [];
                gsap.killTweensOf(symbol);
                gsap.killTweensOf(symbol.scale);
                gsap.set(symbol.scale, { x: 1, y: 1 });
            });
        });
        
        // Reset UI elements
        const container = document.querySelector('.slot-machine-container');
        container.classList.remove('anticipation-glow');
        
        const result = document.getElementById('result');
        if (result) {
            result.classList.add('hidden');
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global slot machine instance
let slotMachine = null;

// Initialize slot machine
function initSlotMachine(gender) {
    console.log('initSlotMachine called with gender:', gender);
    
    if (!gender || (gender !== 'boy' && gender !== 'girl')) {
        console.error('Invalid gender provided to initSlotMachine:', gender);
        gender = 'boy';
    }
    
    // Create new slot machine instance
    slotMachine = new SlotMachine();
    slotMachine.targetGender = gender;
    
    console.log('Enhanced slot machine initialized with target gender:', gender);
    
    // Start the sequence after initialization
    setTimeout(() => {
        if (slotMachine) {
            slotMachine.startSlotSequence();
        }
    }, 1000);
}

// Reset function
function resetSlotMachine() {
    if (slotMachine) {
        slotMachine.reset();
    }
}

// Export functions
window.initSlotMachine = initSlotMachine;
window.resetSlotMachine = resetSlotMachine;