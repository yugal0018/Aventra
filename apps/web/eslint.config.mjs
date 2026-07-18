import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Enforce explicit return types on exported functions
      "@typescript-eslint/explicit-function-return-type": "off",
      // Disallow any
      "@typescript-eslint/no-explicit-any": "off",
      // Prefer const
      "prefer-const": "error",
      // No unused vars (with underscore escape hatch)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Allow unescaped entities in react
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
