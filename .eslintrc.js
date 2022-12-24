module.exports = {
  root: true,
  env: { node: true },
  extends: [
    'plugin:jest/recommended',
    'plugin:jest-formatting/recommended',
    'plugin:vue/recommended',
    'prettier',
  ],
  plugins: ['jest-formatting', 'import'],
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      babelrc: false,
      configFile: false,
      presets: ['babel-eslint'],
    },
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'object-curly-newline': ['error', { multiline: true }],
    'import/newline-after-import': ['error', { count: 1 }],
    'import/order': [
      'error',
      {
        alphabetize: {order: 'asc',},
        groups: [['builtin', 'external', 'unknown'], ['internal'], ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
        pathGroups: [
          {
            group: 'internal',
            pattern: '{@,~}/*/**',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    'vue/multi-word-component-names': 'off',
  },
  overrides: [
    {
      files: ['**/*.spec.{j,t}s?(x)'],
      env: { jest: true },
    },
  ],
};
