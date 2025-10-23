export default {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  collectCoverageFrom: [
    'dist/**/*.js',
    '!dist/**/*.d.ts'
  ],
  passWithNoTests: true,
  transform: {}
};
