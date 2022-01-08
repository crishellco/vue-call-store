module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,vue}', '!src/index.js', '!src/constants.js'],
  coverageReporters: ['json-summary', 'text', 'lcov'],
  moduleFileExtensions: [
    'js',
    'json',
    // tell Jest to handle `*.vue` files
    'vue',
  ],
  testEnvironment: 'jsdom',
  transform: {
    // process `*.vue` files with `vue-jest`
    '.*\\.(vue)$': 'vue-jest',
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
  },
};
