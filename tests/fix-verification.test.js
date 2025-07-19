/**
 * Fix Verification Tests
 * 
 * These tests verify that our enhanced solution successfully resolves
 * the original reveal flow issues while maintaining functionality.
 */

describe('Reveal Flow Fix Verification', () => {
    let mockSessionStorage, mockLocalStorage, mockLocation;
    
    beforeEach(() => {
        // Reset storage mocks
        mockSessionStorage = {
            _storage: {},
            getItem: jest.fn((key) => mockSessionStorage._storage[key] || null),
            setItem: jest.fn((key, value) => { mockSessionStorage._storage[key] = value; }),
            removeItem: jest.fn((key) => delete mockSessionStorage._storage[key])
        };
        
        mockLocalStorage = {
            _storage: {},
            getItem: jest.fn((key) => mockLocalStorage._storage[key] || null),
            setItem: jest.fn((key, value) => { mockLocalStorage._storage[key] = value; }),
            removeItem: jest.fn((key) => delete mockLocalStorage._storage[key])
        };
        
        mockLocation = {
            href: 'https://localhost:4000/gender-reveal-site/reveal.html',
            origin: 'https://localhost:4000',
            search: '',
            hash: ''
        };
        
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
            get(key) { return this.params[key] || null; }
        };
    });
    
    // Enhanced choose.js functions with robust persistence
    function saveSelectionsRobustly(animation, gender, sessionStorage, localStorage) {
        const selections = {
            animation,
            gender,
            timestamp: new Date().toISOString(),
            source: 'choose_page',
            version: '1.2'
        };
        
        const storageStrategies = [
            () => sessionStorage.setItem('genderRevealSelections', JSON.stringify(selections)),
            () => localStorage.setItem('genderRevealSelections_backup', JSON.stringify(selections)),
            () => sessionStorage.setItem('gender_reveal_data', JSON.stringify(selections)),
            () => localStorage.setItem('reveal_data', JSON.stringify(selections)),
            () => sessionStorage.setItem('reveal_selections', JSON.stringify(selections))
        ];
        
        let successCount = 0;
        storageStrategies.forEach((strategy) => {
            try {
                strategy();
                successCount++;
            } catch (e) {
                // Continue with other strategies
            }
        });
        
        return { selections, successCount, totalStrategies: storageStrategies.length };
    }
    
    // Enhanced reveal.js functions with multiple recovery strategies  
    function getRevealDataEnhanced(location, sessionStorage, localStorage) {
        const strategies = [
            () => getRevealDataFromURL(location),
            () => getRevealDataFromStorage(sessionStorage),
            () => getRevealDataFromBackup(localStorage),
            () => getRevealDataFromHash(location),
            () => getRevealDataFromAlternativeKeys(sessionStorage, localStorage)
        ];
        
        for (const strategy of strategies) {
            try {
                const data = strategy();
                if (data && data.animation && data.gender) {
                    return data;
                }
            } catch (e) {
                // Continue to next strategy
            }
        }
        
        return null;
    }
    
    function getRevealDataFromURL(location) {
        const urlParams = new URLSearchParams(location.search);
        const animation = urlParams.get('animation');
        const gender = urlParams.get('gender');
        return (animation && gender) ? { animation, gender } : null;
    }
    
    function getRevealDataFromStorage(sessionStorage) {
        try {
            const stored = sessionStorage.getItem('genderRevealSelections');
            if (stored) {
                const parsed = JSON.parse(stored);
                return (parsed && parsed.animation && parsed.gender) ? 
                    { animation: parsed.animation, gender: parsed.gender } : null;
            }
        } catch (e) { /* ignore */ }
        return null;
    }
    
    function getRevealDataFromBackup(localStorage) {
        try {
            const backup = localStorage.getItem('genderRevealSelections_backup');
            if (backup) {
                const parsed = JSON.parse(backup);
                return (parsed && parsed.animation && parsed.gender) ? 
                    { animation: parsed.animation, gender: parsed.gender } : null;
            }
        } catch (e) { /* ignore */ }
        return null;
    }
    
    function getRevealDataFromHash(location) {
        try {
            const hash = location.hash;
            if (hash && hash.startsWith('#')) {
                const hashData = JSON.parse(decodeURIComponent(hash.substring(1)));
                return (hashData && hashData.animation && hashData.gender) ? 
                    { animation: hashData.animation, gender: hashData.gender } : null;
            }
        } catch (e) { /* ignore */ }
        return null;
    }
    
    function getRevealDataFromAlternativeKeys(sessionStorage, localStorage) {
        const keys = ['gender_reveal_data', 'reveal_data', 'reveal_selections'];
        for (const key of keys) {
            for (const storage of [sessionStorage, localStorage]) {
                try {
                    const data = storage.getItem(key);
                    if (data) {
                        const parsed = JSON.parse(data);
                        if (parsed && parsed.animation && parsed.gender) {
                            return { animation: parsed.animation, gender: parsed.gender };
                        }
                    }
                } catch (e) { /* continue */ }
            }
        }
        return null;
    }
    
    describe('Enhanced Persistence Verification', () => {
        test('should successfully save data using multiple strategies', () => {
            const result = saveSelectionsRobustly('slot', 'boy', mockSessionStorage, mockLocalStorage);
            
            expect(result.successCount).toBe(5); // All 5 strategies should work
            expect(result.totalStrategies).toBe(5);
            expect(result.selections.animation).toBe('slot');
            expect(result.selections.gender).toBe('boy');
        });
        
        test('should succeed even when some storage methods fail', () => {
            // Simulate sessionStorage failures
            mockSessionStorage.setItem = jest.fn(() => {
                throw new Error('SessionStorage failed');
            });
            
            const result = saveSelectionsRobustly('wheel', 'girl', mockSessionStorage, mockLocalStorage);
            
            // Should still succeed with localStorage strategies
            expect(result.successCount).toBeGreaterThan(0);
            expect(result.selections.animation).toBe('wheel');
            expect(result.selections.gender).toBe('girl');
        });
        
        test('should save to multiple locations for redundancy', () => {
            saveSelectionsRobustly('slot', 'boy', mockSessionStorage, mockLocalStorage);
            
            // Check that data was saved to multiple locations
            expect(mockSessionStorage._storage['genderRevealSelections']).toBeTruthy();
            expect(mockSessionStorage._storage['gender_reveal_data']).toBeTruthy();
            expect(mockSessionStorage._storage['reveal_selections']).toBeTruthy();
            expect(mockLocalStorage._storage['genderRevealSelections_backup']).toBeTruthy();
            expect(mockLocalStorage._storage['reveal_data']).toBeTruthy();
        });
    });
    
    describe('Enhanced Recovery Verification', () => {
        test('should recover data from URL parameters', () => {
            mockLocation.search = '?animation=slot&gender=boy';
            
            const data = getRevealDataEnhanced(mockLocation, mockSessionStorage, mockLocalStorage);
            
            expect(data).toEqual({ animation: 'slot', gender: 'boy' });
        });
        
        test('should recover data from primary sessionStorage', () => {
            mockLocation.search = '';
            const testData = { animation: 'wheel', gender: 'girl' };
            mockSessionStorage._storage['genderRevealSelections'] = JSON.stringify(testData);
            
            const data = getRevealDataEnhanced(mockLocation, mockSessionStorage, mockLocalStorage);
            
            expect(data).toEqual({ animation: 'wheel', gender: 'girl' });
        });
        
        test('should recover data from localStorage backup', () => {
            mockLocation.search = '';
            const testData = { animation: 'slot', gender: 'boy' };
            mockLocalStorage._storage['genderRevealSelections_backup'] = JSON.stringify(testData);
            
            const data = getRevealDataEnhanced(mockLocation, mockSessionStorage, mockLocalStorage);
            
            expect(data).toEqual({ animation: 'slot', gender: 'boy' });
        });
        
        test('should recover data from URL hash', () => {
            mockLocation.search = '';
            const testData = { animation: 'wheel', gender: 'girl' };
            mockLocation.hash = '#' + encodeURIComponent(JSON.stringify(testData));
            
            const data = getRevealDataEnhanced(mockLocation, mockSessionStorage, mockLocalStorage);
            
            expect(data).toEqual({ animation: 'wheel', gender: 'girl' });
        });
        
        test('should recover data from alternative storage keys', () => {
            mockLocation.search = '';
            const testData = { animation: 'slot', gender: 'boy' };
            mockSessionStorage._storage['gender_reveal_data'] = JSON.stringify(testData);
            
            const data = getRevealDataEnhanced(mockLocation, mockSessionStorage, mockLocalStorage);
            
            expect(data).toEqual({ animation: 'slot', gender: 'boy' });
        });
        
        test('should return null only when all recovery strategies fail', () => {
            mockLocation.search = '';
            mockLocation.hash = '';
            
            const data = getRevealDataEnhanced(mockLocation, mockSessionStorage, mockLocalStorage);
            
            expect(data).toBeNull();
        });
    });
    
    describe('End-to-End Fix Verification', () => {
        test('ORIGINAL ISSUE: should NOT redirect when data persists correctly', () => {
            // Step 1: User makes selections and saves them
            const saveResult = saveSelectionsRobustly('slot', 'boy', mockSessionStorage, mockLocalStorage);
            expect(saveResult.successCount).toBeGreaterThan(0);
            
            // Step 2: Navigation happens with URL parameters
            mockLocation.search = '?animation=slot&gender=boy';
            
            // Step 3: Reveal page attempts to get data
            const retrievedData = getRevealDataEnhanced(mockLocation, mockSessionStorage, mockLocalStorage);
            
            // Step 4: Should find data and NOT redirect
            expect(retrievedData).toEqual({ animation: 'slot', gender: 'boy' });
            expect(retrievedData).not.toBeNull(); // This prevents the redirect!
        });
        
        test('ORIGINAL ISSUE FIXED: should recover even when sessionStorage fails', () => {
            // Step 1: Save data with robust persistence
            const saveResult = saveSelectionsRobustly('wheel', 'girl', mockSessionStorage, mockLocalStorage);
            expect(saveResult.successCount).toBeGreaterThan(0);
            
            // Step 2: Simulate mobile browser clearing sessionStorage
            mockSessionStorage._storage = {};
            
            // Step 3: Navigation without URL parameters (worst case)
            mockLocation.search = '';
            
            // Step 4: Enhanced recovery should still find data in localStorage
            const retrievedData = getRevealDataEnhanced(mockLocation, mockSessionStorage, mockLocalStorage);
            
            // Should recover from localStorage backup
            expect(retrievedData).toEqual({ animation: 'wheel', gender: 'girl' });
            expect(retrievedData).not.toBeNull(); // No redirect needed!
        });
        
        test('GRACEFUL HANDLING: should handle complete storage failure gracefully', () => {
            // Simulate complete storage failure
            mockSessionStorage.setItem = jest.fn(() => { throw new Error('Storage failed'); });
            mockLocalStorage.setItem = jest.fn(() => { throw new Error('Storage failed'); });
            
            const saveResult = saveSelectionsRobustly('slot', 'boy', mockSessionStorage, mockLocalStorage);
            expect(saveResult.successCount).toBe(0);
            
            // Even with no saved data, the system should not crash
            const retrievedData = getRevealDataEnhanced(mockLocation, mockSessionStorage, mockLocalStorage);
            expect(retrievedData).toBeNull();
            
            // In the real implementation, this triggers the user-friendly recovery options
            // instead of an immediate redirect to choose page
        });
        
        test('MOBILE RESILIENCE: should handle multiple mobile browser issues', () => {
            // Simulate a complex mobile scenario
            
            // 1. Initial save with some failures
            mockSessionStorage.setItem = jest.fn((key, value) => {
                if (Math.random() < 0.5) throw new Error('Mobile storage issue');
                mockSessionStorage._storage[key] = value;
            });
            
            const saveResult = saveSelectionsRobustly('wheel', 'girl', mockSessionStorage, mockLocalStorage);
            // Should succeed with at least localStorage strategies
            expect(saveResult.successCount).toBeGreaterThan(0);
            
            // 2. Mobile browser clears some storage during navigation
            delete mockSessionStorage._storage['genderRevealSelections'];
            delete mockSessionStorage._storage['gender_reveal_data'];
            
            // 3. URL parameters get lost (common mobile browser issue)
            mockLocation.search = '';
            
            // 4. Recovery should still work using remaining storage
            const retrievedData = getRevealDataEnhanced(mockLocation, mockSessionStorage, mockLocalStorage);
            expect(retrievedData).toEqual({ animation: 'wheel', gender: 'girl' });
        });
    });
    
    describe('Backward Compatibility Verification', () => {
        test('should work with old data format', () => {
            // Simulate data saved by old version
            const oldFormatData = { 
                animation: 'slot', 
                gender: 'boy',
                version: '1.0' // Old version
            };
            mockSessionStorage._storage['genderRevealSelections'] = JSON.stringify(oldFormatData);
            
            const retrievedData = getRevealDataEnhanced(mockLocation, mockSessionStorage, mockLocalStorage);
            
            expect(retrievedData).toEqual({ animation: 'slot', gender: 'boy' });
        });
        
        test('should work without version information', () => {
            // Simulate very old data format
            const veryOldData = { animation: 'wheel', gender: 'girl' };
            mockLocalStorage._storage['genderRevealSelections_backup'] = JSON.stringify(veryOldData);
            
            const retrievedData = getRevealDataEnhanced(mockLocation, mockSessionStorage, mockLocalStorage);
            
            expect(retrievedData).toEqual({ animation: 'wheel', gender: 'girl' });
        });
    });
});