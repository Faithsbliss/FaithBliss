module.exports = {
  // Base configuration for the entire project
  root: true,
  // We don't specify a top-level environment to avoid conflicts
  // All environment settings are inside 'overrides'

  // This is the array where we define different configurations
  overrides: [
    {
      // Configuration for all JavaScript files in the main directory
      files: ['src/**/*.{js,jsx}'],
      env: {
        browser: true,
        es2020: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:react-hooks/recommended-latest',
        'plugin:react-refresh/recommended',
      ],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      },
    },
    {
      // Configuration for Node.js files inside the 'server' directory
      files: ['server/**/*.{js,jsx}'],
      env: {
        node: true, // This is the key fix for the 'process' error
        es2021: true,
      },
      extends: ['eslint:recommended'],
      parserOptions: {
        sourceType: 'module',
      },
      rules: {
        'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
        'no-console': 'off', // Optional: allow console.log in the backend
      },
    },
  ],
};