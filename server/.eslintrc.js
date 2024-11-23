module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true
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
  ignorePatterns: ["node_modules/", "public/", "lib/", "dist/"],
  globals: {},
};
