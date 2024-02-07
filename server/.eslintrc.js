module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2020,
  },
  extends: [
    "eslint:recommended",
  ],
  rules: {
    "no-unused-vars": "off",
    "no-useless-escape": "off",
  },
  globals: {},
};
