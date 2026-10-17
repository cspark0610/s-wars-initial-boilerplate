import type { Config } from 'jest';

const config: Config = {
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.module.ts',
    '!src/main.ts',
    '!src/bootstrap.ts',
    '!src/config/**',
    '!src/infrastructure/adapters/persistence/data-source.ts',
    '!src/infrastructure/adapters/persistence/migrations/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
  },
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/test/unit/**/*.spec.ts'],
      rootDir: '.',
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
      testEnvironment: 'node',
      modulePathIgnorePatterns: ['<rootDir>/dist'],
      moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1',
        '^@test/(.*)$': '<rootDir>/test/$1',
      },
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/test/integration/**/*.spec.ts'],
      rootDir: '.',
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
      testEnvironment: 'node',
      modulePathIgnorePatterns: ['<rootDir>/dist'],
      moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1',
        '^@test/(.*)$': '<rootDir>/test/$1',
      },
    },
    {
      displayName: 'e2e',
      testMatch: ['<rootDir>/test/e2e/**/*.spec.ts'],
      rootDir: '.',
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
      testEnvironment: 'node',
      modulePathIgnorePatterns: ['<rootDir>/dist'],
      moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1',
        '^@test/(.*)$': '<rootDir>/test/$1',
      },
    },
  ],
};

export default config;
