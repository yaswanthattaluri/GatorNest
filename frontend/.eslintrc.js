module.exports = {
    env: {
      browser: true,
      es2021: true,
      jest: true,  // Add this line
      "cypress/globals": true
    },
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:testing-library/react", // If using React Testing Library
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: "module",
    },
    plugins: ["react", "jest", "cypress"],
    rules: {
      "no-undef": "off", // Optional: Disables `no-undef` for Jest globals
    },
  };
  