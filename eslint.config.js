import globals from "globals";
import jsPlugin from "@eslint/js";
import tsPlugin from "typescript-eslint";
import prettierOverrides from "eslint-config-prettier";
import prettierRules from "eslint-plugin-prettier/recommended";

export default [
  {
    languageOptions: { globals: globals.node },
  },
  jsPlugin.configs.recommended,
  ...tsPlugin.configs.recommended,
  prettierOverrides,
  prettierRules,
  // Things to turn off globally
  { ignores: ["dist-core/", "dist-app/", "app/apiKeys.ts", "secrets.ts"] },
  {
    rules: {
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-empty-pattern": ["error", { allowObjectPatternsAsParameters: true }],
    },
  },
  // For generated code
  {
    files: ["app/client.ts"],
    rules: {
      "@typescript-eslint/no-namespace": "off",
    },
  },
];
