/**
 * Unit Tests for Gender Reveal Flow Issue
 * Focus: "Start Reveal" to Animation Flow Issues (especially on mobile)
 * 
 * These tests replicate the issue where users are redirected to step 1
 * of animation selection instead of starting the reveal animation.
 */

describe('Gender Reveal Flow Issue Tests', () => {
    let mockSessionStorage, mockLocalStorage, mockLocation;
    
    beforeEach(() => {
        // Mock storage objects with mobile-like behavior
        mockSessionStorage = {
            _storage: {},
            getItem: jest.fn((key) => mockSessionStorage._storage[key] || null),
            setItem: jest.fn((key, value) => {
                // Simulate mobile storage failures
                if (Math.random() < 0.1) { // 10% failure rate
                    throw new Error('Storage quota exceeded');
                }
                mockSessionStorage._storage[key] = value;
            }),
            removeItem: jest.fn((key) => delete mockSessionStorage._storage[key]),
            clear: jest.fn(() => { mockSessionStorage._storage = {}; })
        };
        
        mockLocalStorage = {
            _storage: {},
            getItem: jest.fn((key) => mockLocalStorage._storage[key] || null),
            setItem: jest.fn((key, value) => {
                if (Math.random() < 0.05) { // 5% failure rate
                    throw new Error('Storage quota exceeded');
                }
                mockLocalStorage._storage[key] = value;
            }),
            removeItem: jest.fn((key) => delete mockLocalStorage._storage[key]),
            clear: jest.fn(() => { mockLocalStorage._storage = {}; })
        };
        
        mockLocation = {
            href: 'https://localhost:4000/gender-reveal-site/choose.html',
            origin: 'https://localhost:4000',
            search: '',
            hash: ''
        };
        
        // Create mock URLSearchParams
        global.URLSearchParams = class URLSearchParams {
            constructor(search) {
                this.params = {};
                if (search && search.startsWith('?')) {
                    search = search.substring(1);
                }
                if (search) {
                    search.split('&').forEach(param => {
                        const [key, value] = param.split('=');
                        this.params[decodeURIComponent(key)] = decodeURIComponent(value || '');
                    });
                }
            }
            
            get(key) {
                return this.params[key] || null;
            }
        };
        
        // Reset random to be deterministic
        Math.random = jest.fn(() => 0); // Always return 0 for consistent tests
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    // Simulate the choose.js saveSelections function
    function saveSelections(selectedAnimation, selectedGender, sessionStorage, localStorage) {
        const selections = {
            animation: selectedAnimation,
            gender: selectedGender,
            timestamp: new Date().toISOString(),
            source: 'choose_page',
            version: '1.1'
        };
        
        try {
            sessionStorage.setItem('genderRevealSelections', JSON.stringify(selections));
        } catch (e) {
            console.error('SessionStorage failed:', e);
        }
        
        try {
            localStorage.setItem('genderRevealSelections_backup', JSON.stringify(selections));
        } catch (e) {
            console.error('LocalStorage backup failed:', e);
        }
        
        return selections;
    }
    
    // Simulate the reveal.js getRevealData function
    function getRevealData(location, sessionStorage, localStorage) {
        // First try URL parameters
        const urlParams = new URLSearchParams(location.search);
        const animation = urlParams.get('animation');
        const gender = urlParams.get('gender');
        
        if (animation && gender) {
            return { animation, gender };
        }
        
        // Fallback to sessionStorage
        try {
            const stored = sessionStorage.getItem('genderRevealSelections');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed && parsed.animation && parsed.gender) {
                    return { animation: parsed.animation, gender: parsed.gender };
                }
            }
        } catch (e) {
            console.error('Error reading stored selections:', e);
        }
        
        // Final fallback to localStorage backup
        try {
            const backup = localStorage.getItem('genderRevealSelections_backup');
            if (backup) {
                const parsed = JSON.parse(backup);
                if (parsed && parsed.animation && parsed.gender) {
                    return { animation: parsed.animation, gender: parsed.gender };
                }
            }
        } catch (e) {
            console.error('Error reading localStorage backup:', e);
        }
        
        return null;
    }
    
    describe('Data Persistence - Core Issue Tests', () => {
        test('should save reveal selections successfully under normal conditions', () => {
            const saved = saveSelections('slot', 'boy', mockSessionStorage, mockLocalStorage);
            
            expect(saved.animation).toBe('slot');
            expect(saved.gender).toBe('boy');
            expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
                'genderRevealSelections',
                expect.stringContaining('"animation":"slot"')
            );
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'genderRevealSelections_backup',
                expect.stringContaining('"animation":"slot"')
            );
        });
        
        test('should handle sessionStorage failure gracefully and still save to localStorage', () => {
            // Force sessionStorage to fail
            mockSessionStorage.setItem = jest.fn(() => {
                throw new Error('Storage quota exceeded');
            });
            
            const saved = saveSelections('wheel', 'girl', mockSessionStorage, mockLocalStorage);
            
            expect(saved.animation).toBe('wheel');
            expect(saved.gender).toBe('girl');
            expect(mockSessionStorage.setItem).toHaveBeenCalled();
            expect(mockLocalStorage.setItem).toHaveBeenCalled();
        });
        
        test('ISSUE REPLICATION: should fail when both storage methods fail', () => {
            // Force both storage methods to fail (mobile scenario)
            mockSessionStorage.setItem = jest.fn(() => {
                throw new Error('Storage quota exceeded');
            });
            mockLocalStorage.setItem = jest.fn(() => {
                throw new Error('Storage quota exceeded');
            });
            
            const saved = saveSelections('slot', 'boy', mockSessionStorage, mockLocalStorage);
            
            // Data is prepared but not persisted
            expect(saved.animation).toBe('slot');
            expect(saved.gender).toBe('boy');
            
            // Both storage attempts should have been made
            expect(mockSessionStorage.setItem).toHaveBeenCalled();
            expect(mockLocalStorage.setItem).toHaveBeenCalled();
            
            // But storage should be empty
            expect(mockSessionStorage._storage).toEqual({});
            expect(mockLocalStorage._storage).toEqual({});
        });
    });
    
    describe('Data Retrieval - Core Issue Tests', () => {
        test('should retrieve data from URL parameters correctly', () => {
            mockLocation.search = '?animation=slot&gender=boy';
            
            const revealData = getRevealData(mockLocation, mockSessionStorage, mockLocalStorage);
            
            expect(revealData).toEqual({
                animation: 'slot',
                gender: 'boy'
            });
        });
        
        test('should fallback to sessionStorage when URL parameters are missing', () => {
            mockLocation.search = '';
            
            // Set up sessionStorage with valid data
            const testData = { animation: 'wheel', gender: 'girl' };
            mockSessionStorage._storage['genderRevealSelections'] = JSON.stringify(testData);
            
            const revealData = getRevealData(mockLocation, mockSessionStorage, mockLocalStorage);
            
            expect(revealData).toEqual({
                animation: 'wheel',
                gender: 'girl'
            });
        });
        
        test('should fallback to localStorage backup when sessionStorage is empty', () => {
            mockLocation.search = '';
            
            // sessionStorage is empty
            mockSessionStorage._storage = {};
            
            // Set up localStorage backup
            const testData = { animation: 'slot', gender: 'boy' };
            mockLocalStorage._storage['genderRevealSelections_backup'] = JSON.stringify(testData);
            
            const revealData = getRevealData(mockLocation, mockSessionStorage, mockLocalStorage);
            
            expect(revealData).toEqual({
                animation: 'slot',
                gender: 'boy'
            });
        });
        
        test('ISSUE REPLICATION: should return null when no data is available (causes redirect)', () => {
            mockLocation.search = '';
            mockSessionStorage._storage = {};
            mockLocalStorage._storage = {};
            
            const revealData = getRevealData(mockLocation, mockSessionStorage, mockLocalStorage);
            
            expect(revealData).toBeNull();
            // This null result is what triggers the redirect to choose page!
        });
        
        test('ISSUE REPLICATION: should return null when data is corrupted', () => {
            mockLocation.search = '';
            
            // Set corrupted data in storage
            mockSessionStorage._storage['genderRevealSelections'] = 'invalid json {';
            mockLocalStorage._storage['genderRevealSelections_backup'] = 'also invalid';
            
            const revealData = getRevealData(mockLocation, mockSessionStorage, mockLocalStorage);
            
            expect(revealData).toBeNull();
            // Corrupted data also triggers redirect!
        });
        
        test('ISSUE REPLICATION: should return null when data has missing properties', () => {
            mockLocation.search = '';
            
            // Set incomplete data (missing gender)
            const incompleteData = { animation: 'slot' };
            mockSessionStorage._storage['genderRevealSelections'] = JSON.stringify(incompleteData);
            
            const revealData = getRevealData(mockLocation, mockSessionStorage, mockLocalStorage);
            
            expect(revealData).toBeNull();
            // Incomplete data triggers redirect!
        });
    });
    
    describe('Integration Flow - Issue Reproduction', () => {
        test('HAPPY PATH: complete flow should work correctly', () => {
            // Step 1: User selects animation and gender
            const selectedAnimation = 'slot';
            const selectedGender = 'boy';
            
            // Step 2: Data is saved
            const savedData = saveSelections(selectedAnimation, selectedGender, mockSessionStorage, mockLocalStorage);
            expect(savedData.animation).toBe('slot');
            expect(savedData.gender).toBe('boy');
            
            // Step 3: Navigation with URL parameters
            mockLocation.search = '?animation=slot&gender=boy';
            
            // Step 4: Reveal page retrieves data
            const retrievedData = getRevealData(mockLocation, mockSessionStorage, mockLocalStorage);
            expect(retrievedData).toEqual({
                animation: 'slot',
                gender: 'boy'
            });
            
            // Should NOT redirect (this is the expected behavior)
            expect(retrievedData).not.toBeNull();
        });
        
        test('ISSUE SCENARIO 1: Storage fails, URL parameters missing (mobile)', () => {
            // Step 1: User makes selections
            const selectedAnimation = 'wheel';
            const selectedGender = 'girl';
            
            // Step 2: Storage fails (common on mobile with low storage)
            mockSessionStorage.setItem = jest.fn(() => {
                throw new Error('Storage quota exceeded');
            });
            mockLocalStorage.setItem = jest.fn(() => {
                throw new Error('Storage quota exceeded');
            });
            
            saveSelections(selectedAnimation, selectedGender, mockSessionStorage, mockLocalStorage);
            
            // Step 3: Navigation fails to include URL parameters (mobile browser bug?)
            mockLocation.search = '';
            
            // Step 4: Reveal page has no data to work with
            const retrievedData = getRevealData(mockLocation, mockSessionStorage, mockLocalStorage);
            expect(retrievedData).toBeNull();
            
            // This causes redirect to choose page (THE ISSUE!)
        });
        
        test('ISSUE SCENARIO 2: Race condition - navigation happens before save completes', () => {
            const selectedAnimation = 'slot';
            const selectedGender = 'boy';
            
            // Simulate slow storage (mobile can be slow)
            let storageComplete = false;
            mockSessionStorage.setItem = jest.fn((key, value) => {
                setTimeout(() => {
                    mockSessionStorage._storage[key] = value;
                    storageComplete = true;
                }, 100); // 100ms delay
            });
            
            // Save starts but doesn't complete immediately
            saveSelections(selectedAnimation, selectedGender, mockSessionStorage, mockLocalStorage);
            
            // Navigation happens immediately (before storage completes)
            mockLocation.search = '';
            
            // Reveal page tries to get data before storage is complete
            const retrievedData = getRevealData(mockLocation, mockSessionStorage, mockLocalStorage);
            
            // Since sessionStorage save didn't complete yet, only localStorage might work
            // But if localStorage also has timing issues, we get null
            if (!storageComplete && !mockLocalStorage._storage['genderRevealSelections_backup']) {
                expect(retrievedData).toBeNull();
                // This causes the redirect issue!
            }
        });
        
        test('ISSUE SCENARIO 3: Mobile browser clears sessionStorage between pages', () => {
            // Step 1: Data is saved successfully
            saveSelections('wheel', 'girl', mockSessionStorage, mockLocalStorage);
            expect(mockSessionStorage._storage['genderRevealSelections']).toBeTruthy();
            
            // Step 2: Mobile browser clears sessionStorage during navigation (iOS Safari)
            mockSessionStorage._storage = {};
            
            // Step 3: URL parameters are missing (maybe due to redirect)
            mockLocation.search = '';
            
            // Step 4: Only localStorage backup should work
            const retrievedData = getRevealData(mockLocation, mockSessionStorage, mockLocalStorage);
            
            // If localStorage backup exists, should recover
            if (mockLocalStorage._storage['genderRevealSelections_backup']) {
                expect(retrievedData).toEqual({
                    animation: 'wheel',
                    gender: 'girl'
                });
            } else {
                // But if localStorage also failed, we get the redirect issue
                expect(retrievedData).toBeNull();
            }
        });
    });
    
    describe('Mobile-Specific Edge Cases', () => {
        test('should handle iOS Safari private mode storage limitations', () => {
            // iOS Safari private mode has 0 storage quota
            mockSessionStorage.setItem = jest.fn(() => {
                throw new Error('QuotaExceededError: DOM Exception 22');
            });
            mockLocalStorage.setItem = jest.fn(() => {
                throw new Error('QuotaExceededError: DOM Exception 22');
            });
            
            saveSelections('slot', 'boy', mockSessionStorage, mockLocalStorage);
            
            // Without URL parameters, data retrieval fails
            mockLocation.search = '';
            const revealData = getRevealData(mockLocation, mockSessionStorage, mockLocalStorage);
            
            expect(revealData).toBeNull();
            // User gets redirected back to choose page!
        });
        
        test('should handle Android Chrome aggressive memory management', () => {
            // Save data successfully
            saveSelections('wheel', 'girl', mockSessionStorage, mockLocalStorage);
            
            // Simulate Chrome clearing storage due to memory pressure
            mockSessionStorage._storage = {};
            mockLocalStorage._storage = {};
            
            // URL parameters missing due to redirect
            mockLocation.search = '';
            
            const revealData = getRevealData(mockLocation, mockSessionStorage, mockLocalStorage);
            
            expect(revealData).toBeNull();
            // Results in redirect to choose page
        });
    });
});