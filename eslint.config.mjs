import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginJSX from "eslint-plugin-jsx-a11y";
import eslintPluginImport from "eslint-plugin-import";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      react: eslintPluginReact,
      "react-hooks": eslintPluginReactHooks,
      "jsx-a11y": eslintPluginJSX,
      import: eslintPluginImport,
      prettier: prettierPlugin,
    },
    rules: {
      "react/jsx-uses-react": "off", // React 17+ JSX
      "react/react-in-jsx-scope": "off", // React 17+ JSX
      "react/prop-types": "off", // Using TypeScript types instead of prop-types
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "import/order": ["error", { groups: [["builtin", "external", "internal"]], "newlines-between": "always" }],
      "jsx-a11y/anchor-is-valid": "off", // Adjust for Next.js Link component
      "prettier/prettier": "error",
      "max-len": [
        "warn",
        {
          "code": 80,
          "tabWidth": 2,
          "ignoreUrls": true,
          "ignoreStrings": true,
          "ignoreTemplateLiterals": true,
          "ignoreComments": true
        }
      ],
      "max-lines-per-function": ["error", { "max": 120, "skipBlankLines": true, "skipComments": true }]
    },
    settings: {
      react: {
        version: "detect", // Automatically detects the React version
      },
    },
  },
];
