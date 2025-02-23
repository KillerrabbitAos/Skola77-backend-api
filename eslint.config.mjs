import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Basinställningar för alla .js-filer med Node-miljö
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node, // Inkludera Node-globals som t.ex. process, __dirname, etc.
      }
    }
  },

  // Lägg till browser-globals
  {
    languageOptions: { globals: globals.browser }
  },

  // Jest override för testfiler
  {
    files: ["**/*.test.js"],
    languageOptions: { globals: globals.jest }
  },

  // Rekommenderade ESLint-regler
  pluginJs.configs.recommended,
];
