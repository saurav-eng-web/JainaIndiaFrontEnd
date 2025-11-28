import path from "path";
import { fileURLToPath } from "url";

// Plugins (MUST be imported for flat config)
import prettierPlugin from "eslint-plugin-prettier";
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
    ignores: ["**/.next/**", "node_modules/**"],
  },
  // 1) Load Next.js rules first
  // ...compat.extends("next/core-web-vitals"),
  ...compat.extends("eslint-config-next/core-web-vitals"),

  // 2) Your custom rules
  {
    plugins: {
      prettier: prettierPlugin,

      "react-hooks": reactHooksPlugin,
      import: importPlugin,
    },

    rules: {
      // Prettier
      "prettier/prettier": [
        "warn",
        {
          endOfLine: "auto",
        },
      ],

      // Core JS rules
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // "no-console": "warn",
      "prefer-const": "warn",
      "no-duplicate-imports": "warn",

      // React hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Import sorting
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
        },
      ],
    },
  },
];

export default conf;
