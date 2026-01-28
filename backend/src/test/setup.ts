/**
 * Global test setup for Jest
 * Runs before all test files
 */

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.HOST = "0.0.0.0";
process.env.PORT = "1337";

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to suppress console output in tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Add custom matchers or global test utilities here
