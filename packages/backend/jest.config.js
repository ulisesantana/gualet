module.exports = {
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1'
  },
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  rootDir: '.',
  roots: [
    '<rootDir>/src',
  ],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  collectCoverageFrom: [
    '**/*.(t|j)s'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/main.ts',
    'src/.*index.ts',
    'src/.*entity.ts',
    'src/.*\\.module\\.ts',
    'src/migrations/.*',
    'test/builders/.*'
  ],
  coverageDirectory: './coverage',
  setupFilesAfterEnv: ['./test/setup.ts'],
  testEnvironment: 'node'
};
