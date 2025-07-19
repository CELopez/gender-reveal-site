/**
 * Jest Test Setup
 * Global configuration for testing environment
 */

// Fix TextEncoder/TextDecoder for Node.js environment
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock console methods to avoid noise in tests
global.console = {
    ...console,
    // Keep error and warn for debugging
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn()
};

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn();

// Mock URLSearchParams for older environments
if (!global.URLSearchParams) {
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
        
        set(key, value) {
            this.params[key] = value;
        }
        
        has(key) {
            return key in this.params;
        }
    };
}

// Mock Math.random for consistent test results
const originalRandom = Math.random;
beforeEach(() => {
    // Use a seeded random for predictable test results
    let seed = 42;
    Math.random = jest.fn(() => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    });
});

afterEach(() => {
    Math.random = originalRandom;
});

// Global test utilities
global.testUtils = {
    // Wait for async operations
    waitFor: (ms = 0) => new Promise(resolve => setTimeout(resolve, ms)),
    
    // Create mock event
    createMockEvent: (type, properties = {}) => {
        return {
            type,
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
            target: {},
            ...properties
        };
    },
    
    // Mock mobile viewport
    setMobileViewport: () => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 375
        });
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: 667
        });
    },
    
    // Mock desktop viewport
    setDesktopViewport: () => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1920
        });
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: 1080
        });
    }
};