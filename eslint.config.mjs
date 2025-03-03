import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";
import prettierConfig from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      react,
      prettier,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // Accessiblity rules
      ...jsxA11y.configs.recommended.rules,
      "jsx-a11y/anchor-is-valid": [
        "warn",
        {
          aspects: ["invalidHref", "preferButton"],
        },
      ],

      // React rules
      ...react.configs.recommended.rules, // React recommended rules
      ...reactHooks.configs.recommended.rules, // React Hooks recommended rules
      'react/prop-types': 'off',

      ...prettierConfig.rules,

      // Prettier integration
      "prettier/prettier": [
        "error",
        { singleQuote: true, trailingComma: "all", semi: true },
      ],

      // Custom react rules
      "react/jsx-key": "error",
      "react/no-unescaped-entities": "off",
      "react/jsx-no-useless-fragment": "warn",
      "react/no-unstable-nested-components": "warn",

      // Custom React Refresh rule
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // Import rules
      "import/no-unresolved": "error",
      "import/no-duplicates": "error",
      "import/order": [
        "error",
        {
          groups: [["builtin", "external", "internal"]],
          "newlines-between": "always",
        },
      ],

      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],

      // Additional custom rules
      "no-var": "error",
      "no-console": "warn",
      "no-debugger": "error",
      "no-return-await": "error",
      "prefer-template": "error",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "no-magic-numbers": [
        "error",
        { ignoreArrayIndexes: true, ignoreDefaultValues: true },
      ],
    },
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
      "import/resolver": {
        alias: {
          map: [
            ["", "./public"], // <-- this line
            ["@", "./src"],
          ],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  }
);
