import simpleImportSort from "eslint-plugin-simple-import-sort";
import _import from "eslint-plugin-import";
import { fixupPluginRules } from "@eslint/compat";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/dist", "**/.eslintrc.cjs", "**/drizzle.config.ts"],
}, ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"), {
    plugins: {
        "simple-import-sort": simpleImportSort,
        import: fixupPluginRules(_import),
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            project: ["./tsconfig.json"],
        },
    },

    rules: {
        "@typescript-eslint/no-misused-promises": "off",
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "import/first": "error",
        "import/newline-after-import": "error",
        "import/no-duplicates": "error",
        "@typescript-eslint/no-explicit-any": "off",
    },
}];