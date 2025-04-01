module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    './frontend/jest.polyfills.js',
    '@testing-library/jest-dom'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/frontend/unittests/mocks/styleMock.js'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  }
};