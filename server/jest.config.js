module.exports = {
  testEnvironment: 'node',
  coverageReporters: [
    'text-summary',
    'html',
  ],
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/*.test.{js,jsx}',
    '!**/node_modules/**',
    '!**/spec/**',
    '!**/coverage/**',
    '!jest.config.js',
  ],
  testRunner: 'jest-circus/runner',
};
