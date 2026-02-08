const eslint = require('@eslint/js');
const {defineConfig, globalIgnores} = require('eslint/config');
const tseslint = require('typescript-eslint');

module.exports = defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  globalIgnores(['lib/', 'dist/', 'eslint.config.js'])
);
