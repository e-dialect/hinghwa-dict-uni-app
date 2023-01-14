module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    'plugin:vue/recommended',
    'eslint:recommended',
    'airbnb-base',
  ],
  rules: {
    // override/add rules settings here, such as:
    'vue/multi-word-component-names': 'off',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-continue': 'off',
    'no-restricted-syntax': 'off',

    // ignore for vue-cli-service
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never',
    }],
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'node_modules/@vue/cli-service/webpack.config.js',
      },
    },
  },
};
