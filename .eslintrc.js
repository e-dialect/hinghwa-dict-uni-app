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
	// 禁止不必要的转义字符
	'no-useless-escape': 0,
    // ignore for vue-cli-service
    'import/extensions': ['error', 'always', {
      js: 'never',
    }],
  },
  settings: {
    'import/resolver': {
      alias: [
        ['@', './src'],
      ],
    },
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
};
