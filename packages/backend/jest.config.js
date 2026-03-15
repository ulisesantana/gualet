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
    'src/db/clean.ts',
    'src/db/seed.ts',
    'src/db/verify.ts',
    'src/db/database-seeder.service.ts',
    'src/db/seeders/.*',
    'test/builders/.*'
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95
    }
  }
};
