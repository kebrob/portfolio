import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),
    {
        rules: {
            // The core rule is not TS-aware: it flags parameter names in type
            // positions (interface methods, function-typed properties) where a
            // name is documentation, not a binding. The @typescript-eslint one
            // understands declarations and is already enabled by nextTs above.
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "react/jsx-key": "error",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },
]);

export default eslintConfig;
