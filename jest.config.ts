import type { Config } from 'jest';

enum TestType {
  UNIT = 'unit',
  INTEGRATION = 'integration',
  E2E = 'e2e',
}

const MAX_WORKERS = Number(process.env.MAX_WORKERS) || 2;

const baseConfig: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '@src/(.*)$': '<rootDir>/src/$1',
    '@test/(.*)$': '<rootDir>/test/$1',
  },
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: false, // sin errores de tipo en runtime
      },
    ],
  },
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/config/**',
    '!src/main.ts',
    '!src/app.module.ts',
    '!src/bootstrap.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', '<rootDir>'],
  modulePathIgnorePatterns: ['<rootDir>/dist'],
};

function getConfigProjectBy(testType: TestType): Config {
  const projectConfig: Config = {
    ...baseConfig,
    displayName: testType,
    testRegex: `test/${testType}/.*\\.spec\\.ts`,
  };

  if (testType !== TestType.UNIT) {
    // globalSetup / globalTeardown removed — no integration/e2e tests
  }

  return projectConfig;
}

const config: Config = {
  maxWorkers: MAX_WORKERS,
  projects: [
    getConfigProjectBy(TestType.UNIT),
    getConfigProjectBy(TestType.INTEGRATION),
    getConfigProjectBy(TestType.E2E),
  ],
  verbose: false,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
};

export default config;
