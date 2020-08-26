module.exports = {
    preset: 'ts-jest',
    verbose: true,
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: './coverage',
    coverageReporters: [
        /*'json', 'text', */
        'text',
        'lcov',
        'cobertura',
    ],
    collectCoverageFrom: ['./src/**/*.ts'],
    coveragePathIgnorePatterns: ['./node_modules/', './@types/', './dist'],
    testRegex: '.*\\.spec|.test\\.tsx?$',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    globals: {
        'ts-jest': {
            tsConfig: './tsconfig.json',
            diagnostics: false,
            // diagnostics: {
            // 	warnOnly: true
            // }
        },
    },
};
