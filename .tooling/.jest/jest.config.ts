// From https://kulshekhar.github.io/ts-jest/docs/getting-started/presets
import type { JestConfigWithTsJest } from 'ts-jest';

process.env.TZ = 'UTC';

const jestConfig: JestConfigWithTsJest = {
  rootDir: './../../src',
  preset: 'ts-jest',
  testEnvironment: 'node',
  //
  transform: {
    // This is the default transform regex
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './.tsconfig/tsconfig.test.json'
      }
    ]
  }
};

export default jestConfig;
