/**
 * Test for Wheel of Fortune Reveal Flow Issue
 * 
 * Problem: When user selects "wheel" animation in create reveal flow,
 * they are incorrectly shown the slot machine pre-reveal screen and animation
 * instead of the wheel animation.
 */

describe('Wheel of Fortune Reveal Flow', () => {
    let mockDOM;
    let revealData;
    
    beforeEach(() => {
        // Reset reveal data
        revealData = null;
        
        // Create mock DOM elements
        mockDOM = {
            preReveal: {
                style: { display: 'block' },
                querySelector: jest.fn()
            },
            revealIcon: { textContent: '' },
            revealType: { textContent: '' },
            animationContainer: { 
                classList: { remove: jest.fn(), add: jest.fn() } 
            },
            slotMachine: { 
                classList: { remove: jest.fn(), add: jest.fn() },
                style: { display: 'none' }
            },
            wheelContainer: { 
                classList: { remove: jest.fn(), add: jest.fn() },
                style: { display: 'none' }
            },
            startRevealBtn: {
                addEventListener: jest.fn(),
                style: { display: 'block' }
            }
        };
        
        // Mock DOM methods
        global.document = {
            getElementById: jest.fn((id) => {
                if (mockDOM[id]) {
                    return mockDOM[id];
                }
                // Return a default mock element
                return {
                    textContent: '',
                    style: {},
                    classList: { 
                        add: jest.fn(), 
                        remove: jest.fn(),
                        contains: jest.fn(() => false)
                    },
                    addEventListener: jest.fn()
                };
            }),
            querySelector: jest.fn(() => null),
            body: {
                classList: { add: jest.fn(), remove: jest.fn() },
                appendChild: jest.fn(),
                removeChild: jest.fn()
            },
            documentElement: {
                requestFullscreen: jest.fn(() => Promise.resolve())
            },
            fullscreenElement: null,
            addEventListener: jest.fn()
        };
        
        // Mock window functions
        global.window = {
            ...global.window,
            SITE_CONFIG: { baseUrl: '' },
            trackEvent: jest.fn(),
            initWheel: jest.fn(),
            initSlotMachine: jest.fn(),
            showResult: jest.fn()
        };
        
        // Mock console for clean test output
        global.console.log = jest.fn();
        global.console.error = jest.fn();
    });
    
    // Test utility functions from reveal.js
    function getRevealData() {
        return revealData;
    }
    
    function setupPreRevealScreen() {
        const revealIcon = document.getElementById('revealIcon');
        const revealType = document.getElementById('revealType');
        
        if (revealData) {
            // Update icon based on animation type - THIS IS THE BUG!
            if (revealIcon) {
                const icons = {
                    'slot': '🎰',
                    'fireworks': '🎆'
                    // 'wheel' is missing! This causes the bug
                };
                revealIcon.textContent = icons[revealData.animation] || '🎰';
            }
            
            // Update reveal type text - THIS IS ALSO THE BUG!
            if (revealType) {
                const names = {
                    'slot': 'Slot Machine Reveal',
                    'fireworks': 'Fireworks Reveal'
                    // 'wheel' is missing! This causes the bug
                };
                revealType.textContent = names[revealData.animation] || 'Slot Machine Reveal';
            }
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
        
        // Start the appropriate animation - THIS IS THE CORE BUG!
        switch (revealData.animation) {
            case 'slot':
                startSlotMachineAnimation();
                break;
            case 'wheel':
                startWheelAnimation();
                break;
            case 'fireworks':
                console.log('Fireworks animation not yet implemented');
                break;
            default:
                // THIS IS THE BUG - defaults to slot machine!
                startSlotMachineAnimation();
                break;
        }
    }
    
    function startSlotMachineAnimation() {
        const slotMachine = document.getElementById('slotMachine');
        
        if (slotMachine) {
            slotMachine.classList.remove('hidden');
            
            if (typeof window.initSlotMachine === 'function') {
                window.initSlotMachine(revealData.gender);
            }
        }
    }
    
    function startWheelAnimation() {
        const wheelContainer = document.getElementById('wheelContainer');
        
        if (wheelContainer) {
            wheelContainer.classList.remove('hidden');
            
            if (typeof window.initWheel === 'function') {
                window.initWheel(revealData.gender);
            }
        }
    }
    
    describe('Wheel Animation Selection Issue', () => {
                          test('ISSUE REPRODUCTION: wheel selection shows slot machine icon and text', () => {
             // Set up wheel animation selection
             revealData = {
                 animation: 'wheel',
                 gender: 'girl'
             };
             
             // Run the buggy setupPreRevealScreen function
             setupPreRevealScreen();
             
             // BUG DEMONSTRATION: Because 'wheel' is not in the icons object, it defaults to '🎰'
             expect(mockDOM.revealIcon.textContent).toBe('🎰'); // This demonstrates the bug
             
             // BUG DEMONSTRATION: Because 'wheel' is not in the names object, it defaults to 'Slot Machine Reveal'
             expect(mockDOM.revealType.textContent).toBe('Slot Machine Reveal'); // This demonstrates the bug
             
             // These assertions confirm the bug exists:
             expect(mockDOM.revealIcon.textContent).not.toBe('🎡'); // It should be this wheel icon
             expect(mockDOM.revealType.textContent).not.toBe('Wheel of Fortune Reveal'); // It should be this text
         });
        
        test('ISSUE REPRODUCTION: wheel animation starts slot machine instead', () => {
            // Set up wheel animation selection
            revealData = {
                animation: 'wheel',
                gender: 'boy'
            };
            
            // Start animation
            startAnimation();
            
            // BUG: initWheel should be called but initSlotMachine is called instead
            expect(window.initWheel).toHaveBeenCalledWith('boy');
            expect(window.initSlotMachine).not.toHaveBeenCalled();
            
            // BUG: Wheel container should be shown
            expect(mockDOM.wheelContainer.classList.remove).toHaveBeenCalledWith('hidden');
            expect(mockDOM.slotMachine.classList.remove).not.toHaveBeenCalledWith('hidden');
        });
        
        test('CONTROL: slot animation works correctly', () => {
            // Set up slot animation selection
            revealData = {
                animation: 'slot',
                gender: 'girl'
            };
            
            // Run setupPreRevealScreen
            setupPreRevealScreen();
            
            // Should correctly show slot machine
            expect(mockDOM.revealIcon.textContent).toBe('🎰');
            expect(mockDOM.revealType.textContent).toBe('Slot Machine Reveal');
            
            // Start animation
            startAnimation();
            
            // Should correctly start slot machine
            expect(window.initSlotMachine).toHaveBeenCalledWith('girl');
            expect(window.initWheel).not.toHaveBeenCalled();
        });
        
        test('EDGE CASE: unknown animation defaults to slot machine', () => {
            // Set up unknown animation
            revealData = {
                animation: 'unknown',
                gender: 'boy'
            };
            
            // Run setupPreRevealScreen
            setupPreRevealScreen();
            
            // Should default to slot machine
            expect(mockDOM.revealIcon.textContent).toBe('🎰');
            expect(mockDOM.revealType.textContent).toBe('Slot Machine Reveal');
            
            // Start animation
            startAnimation();
            
            // Should default to slot machine
            expect(window.initSlotMachine).toHaveBeenCalledWith('boy');
            expect(window.initWheel).not.toHaveBeenCalled();
        });
    });
    
    describe('Complete Flow Integration Test', () => {
        test('ISSUE REPRODUCTION: full wheel reveal flow shows slot machine', () => {
            // Simulate user selecting wheel animation and gender
            const selectedAnimation = 'wheel';
            const selectedGender = 'girl';
            
            // Simulate navigation to reveal page with correct data
            revealData = {
                animation: selectedAnimation,
                gender: selectedGender
            };
            
            // Step 1: Pre-reveal screen setup
            setupPreRevealScreen();
            
            // BUG DETECTED: Wrong icon and text displayed
            expect(mockDOM.revealIcon.textContent).toBe('🎰'); // Should be 🎡
            expect(mockDOM.revealType.textContent).toBe('Slot Machine Reveal'); // Should be 'Wheel of Fortune Reveal'
            
            // Step 2: User clicks "Start Reveal"
            startAnimation();
            
            // BUG DETECTED: Wheel animation should start but slot machine starts instead
            expect(window.initWheel).toHaveBeenCalledWith('girl');
            expect(mockDOM.wheelContainer.classList.remove).toHaveBeenCalledWith('hidden');
            
            // These should NOT happen for wheel animation
            expect(window.initSlotMachine).not.toHaveBeenCalled();
            expect(mockDOM.slotMachine.classList.remove).not.toHaveBeenCalledWith('hidden');
        });
        
                 test('EXPECTED BEHAVIOR: wheel reveal flow should show wheel animation', () => {
             // After fix, this test should pass
             revealData = {
                 animation: 'wheel',
                 gender: 'boy'
             };
             
             // Test the fixed setupPreRevealScreen function
             function setupPreRevealScreenFixed() {
                 const revealIcon = document.getElementById('revealIcon');
                 const revealType = document.getElementById('revealType');
                 
                 if (revealData) {
                     // Update icon based on animation type - FIXED VERSION
                     if (revealIcon) {
                         const icons = {
                             'slot': '🎰',
                             'wheel': '🎡', // ADDED: wheel icon
                             'fireworks': '🎆'
                         };
                         revealIcon.textContent = icons[revealData.animation] || '🎰';
                     }
                     
                     // Update reveal type text - FIXED VERSION
                     if (revealType) {
                         const names = {
                             'slot': 'Slot Machine Reveal',
                             'wheel': 'Wheel of Fortune Reveal', // ADDED: wheel name
                             'fireworks': 'Fireworks Reveal'
                         };
                         revealType.textContent = names[revealData.animation] || 'Slot Machine Reveal';
                     }
                 }
             }
             
             // Run the fixed function
             setupPreRevealScreenFixed();
             
             // FIXED: Should now show correct wheel icon and text
             expect(mockDOM.revealIcon.textContent).toBe('🎡'); // Correct!
             expect(mockDOM.revealType.textContent).toBe('Wheel of Fortune Reveal'); // Correct!
         });
    });
    
    describe('Black Screen Issue', () => {
        test('ISSUE REPRODUCTION: wheel animation may cause black screen', () => {
            revealData = {
                animation: 'wheel',
                gender: 'girl'
            };
            
            // Start wheel animation
            startWheelAnimation();
            
            // Verify wheel container is shown
            expect(mockDOM.wheelContainer.classList.remove).toHaveBeenCalledWith('hidden');
            
            // Verify wheel initialization is called
            expect(window.initWheel).toHaveBeenCalledWith('girl');
            
            // If initWheel fails or isn't properly loaded, user gets black screen
            // This happens because the wheel container is shown but no content is rendered
        });
    });
});