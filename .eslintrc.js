module.exports = {
    extends: [
        // add more generic rulesets here, such as:
        "plugin:vue/recommended",
        'eslint:recommended',
    ],
    rules: {
        // override/add rules settings here, such as:
        "vue/multi-word-component-names": "off",
        "no-undef": "off",
        "no-unused-vars": "off",
    }
}
