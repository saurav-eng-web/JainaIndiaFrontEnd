import path from "path";
import { fileURLToPath } from "url";
import js from "@eslint/js";

// Plugins (MUST be imported for flat config)
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Needed to load Next.js preset under flat config
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const conf = [
  {
    ignores: [
      "**/.next/**",
      "node_modules/**",
      "*.config.mjs",
      "*.config.js",
      "dist/**",
      "build/**",
      ".vercel/**",
    ],
  },
  js.configs.recommended,
  // 1) Load Next.js rules
  ...compat.extends("next/core-web-vitals"),

  // 2) Your custom rules
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: "readonly",
        JSX: "readonly",
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },

    rules: {
      // Don't run prettier through ESLint - use prettier separately
      // "prettier/prettier": "warn",

      // Core JS rules
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      // "no-console": "warn",
      "prefer-const": "warn",
      "no-duplicate-imports": "warn",

      // React rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "warn",

      // React hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Import sorting
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];

export default conf;
