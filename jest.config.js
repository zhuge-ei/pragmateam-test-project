export default {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.jest.json" }],
    "^.+\\.jsx?$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.jest.json" }],
  },
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
  },
  moduleDirectories: ["<rootDir>/node_modules"],
  extensionsToTreatAsEsm: [".ts"],
  setupFiles: ["<rootDir>/testSetup.js"],
};
