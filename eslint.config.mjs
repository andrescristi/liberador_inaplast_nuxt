// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt([
  {
    rules: {
      "vue/max-attributes-per-line": ["error", {
        singleline: {
          max: 2,
        },
        multiline: {
          max: 1,
        },
      }],
      "no-console": ["warn"],
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }],
    },
  },
  {
    // Allow console statements in test files
    files: ["tests/**/*.{js,ts,vue}", "**/*.test.{js,ts}", "**/*.spec.{js,ts}"],
    rules: {
      "no-console": "off",
    },
  },
  {
    // Allow console statements in logger plugin (console references are intentional)
    files: ["**/plugins/logger*.{js,ts}"],
    rules: {
      "no-console": "off",
    },
  },
]);