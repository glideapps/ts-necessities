import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import importsPlugin from "eslint-plugin-import";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            import: importsPlugin,
        },
        rules: {
            "guard-for-in": "error",
            "no-empty": "error",
            "no-shadow": "error",
            "no-debugger": "error",
            "import/no-cycle": "error",
            "import/namespace": "error",
            "import/named": "error",
            "import/no-unresolved": "off",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/explicit-function-return-type": "error",
            "@typescript-eslint/no-empty-interface": "error",
            "@typescript-eslint/no-inferrable-types": "error",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/ban-ts-comment": "error",
            "@typescript-eslint/explicit-module-boundary-types": "error",
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-misused-promises": [
                "error",
                {
                    checksVoidReturn: false,
                },
            ],
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: ["./tsconfig.json", "./tsconfig.test.json"]
            },
        },
    },
    {
        files: ["*.ts"],
        rules: {
            "@typescript-eslint/strict-boolean-expressions": "error",
        },
    }
);
