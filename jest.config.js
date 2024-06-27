module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg\\?url|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tests/testStub.js',
  },
  // collectCoverage: true,
  // collectCoverageFrom: ['./'],
  verbose: true,
};