module.exports = {
  automock: true,
  clearMocks: true,
  collectCoverageFrom: [
    '**/*.test.js',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  modulePaths: ['./'],
  testPathIgnorePatterns: ['server'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  unmockedModulePathPatterns: [
    'node_modules',
  ],
  verbose: true,
};
