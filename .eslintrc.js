module.exports = {
    root: true,
    env: {
        'browser': true,
        'es6': true
    },
    parser: '@babel/eslint-parser',
    parserOptions: {
        'ecmaVersion': 2019,
        'requireConfigFile': false
    },
    extends: [
        'eslint:recommended',
        'plugin:jest/recommended'
    ],
    plugins: ['jest'],
    rules: {
        'no-console': ['warn', { allow: ['error', 'warn'] }],
        'no-undef': 'error',
        'no-var': 'error',
        'one-var': ['error', 'never'],
        'strict': ['error', 'global'],
        'no-prototype-builtins': 'off',
        'jest/no-commented-out-tests': 'off'
    },
    globals: {
        'window': true,
        'document': true,
        'module': true,
        'require': true,
        'global': true
    }
};
