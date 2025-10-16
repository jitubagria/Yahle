module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  setupFiles: ['<rootDir>/test/jest.setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/jest.afterenv.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json'
    }
  }
};
