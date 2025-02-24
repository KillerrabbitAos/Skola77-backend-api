import globals from "globals";
import pluginJs from "@eslint/js";
import securityPlugin from "eslint-plugin-security";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      security: securityPlugin,
    },
    rules: {
      "max-depth": ["error", 3],
      "max-lines-per-function": [
        "error",
        { max: 50, skipBlankLines: true, skipComments: true },
      ],
      "security/detect-object-injection": "off",
      "max-lines": [
        "warn",
        { max: 300, skipBlankLines: true, skipComments: true },
      ],
    },
  },

  {
    files: ["**/*.test.js"],
    languageOptions: {
      globals: {
        ...globals.jest, // Jest-globals
      },
      rules: {
        "max-lines-per-function": "off",
      },
    },
  },
  {
    files: ["models/**/*.js", "models/**/**/*.js"],
    rules: {
      "max-lines-per-function": "off",
    },
  },
  pluginJs.configs.recommended,
];
