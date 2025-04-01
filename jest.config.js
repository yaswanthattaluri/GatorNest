module.exports = {
  setupFiles: ["<rootDir>/frontend/jest.polyfills.js"], // for TextEncoder
  setupFilesAfterEnv: ["<rootDir>/frontend/jest.matchers.js"], // for jest-dom
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/frontend/unittests/mocks/styleMock.js"
  }
};
