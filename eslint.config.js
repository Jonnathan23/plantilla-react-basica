import js from "@eslint/js";
import globals from "globals";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import typescriptEslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import prettierPluginRecommended from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import tanstackQueryPlugin from "@tanstack/eslint-plugin-query";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default defineConfig([
    prettierPluginRecommended,
    globalIgnores([
        "node_modules",
        "dist",
        "build",
        "android",
        ".agents",
        "**/*.config.js",
        "**/*.config.mjs",
        "**/*.config.ts",
        "**/*.json",
    ]),
    js.configs.recommended,
    ...typescriptEslint.configs.recommended,
    reactHooksPlugin.configs.flat.recommended,
    reactRefreshPlugin.configs.vite,

    ...tanstackQueryPlugin.configs["flat/recommended"],

    {
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            "@tanstack/query": tanstackQueryPlugin,
            "simple-import-sort": simpleImportSort,
        },
        files: ["**/*.{ts,tsx}"],
        linterOptions: {
            noInlineConfig: true,
        },
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            curly: ["error", "all"],

            "no-warning-comments": [
                "error",
                {
                    terms: ["eslint-disable", "eslint-ignore", "eslint ignore"],
                    location: "start",
                },
            ],

            "@typescript-eslint/prefer-optional-chain": "error",

            "@typescript-eslint/prefer-nullish-coalescing": "error",

            "@typescript-eslint/prefer-for-of": "error",

            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["../*", "./*", "..", "."],
                            message: 'Las rutas relativas estan prohibidas. Utiliza rutas absolutas comenzando con "@/".',
                        },
                    ],
                },
            ],

            "@typescript-eslint/explicit-member-accessibility": [
                "error",
                {
                    accessibility: "explicit",
                },
            ],

            "no-restricted-syntax": [
                "error",
                {
                    selector: "TSEnumDeclaration",
                    message: "No utilices el enum nativo. Usa un objeto (POJO) con 'as const' en su lugar.",
                },
                {
                    selector:
                        "TSAsExpression[expression.type='TSAsExpression'][expression.typeAnnotation.type='TSUnknownKeyword']",
                    message:
                        "No utilices doble casteo 'as unknown as <Tipo>'. Rompe el tipado estricto; usa type guards o validación en runtime.",
                },
            ],

            "@typescript-eslint/no-explicit-any": "error",

            "@typescript-eslint/no-magic-numbers": [
                "error",
                {
                    ignoreEnums: true,
                    ignoreReadonlyClassProperties: true,
                    ignore: [-1, 0, 1],
                },
            ],

            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: ["class", "interface", "typeAlias", "typeParameter"],
                    format: ["PascalCase"],
                },
                {
                    selector: "import",
                    format: null,
                },
                {
                    selector: "variable",
                    types: ["boolean"],
                    format: ["PascalCase"],
                    prefix: ["is", "should", "has", "can", "did", "will"],
                },
                {
                    selector: "variable",
                    modifiers: ["global"],
                    format: ["camelCase", "PascalCase", "UPPER_CASE"],
                },
                {
                    selector: "function",
                    modifiers: ["global"],
                    format: ["camelCase", "PascalCase"],
                },
                {
                    selector: "variable",
                    format: ["camelCase"],
                },
                {
                    selector: "function",
                    format: ["camelCase"],
                },
                {
                    selector: ["classProperty", "classMethod"],
                    format: ["camelCase"],
                },
            ],

            "react/jsx-handler-names": [
                "error",
                {
                    eventHandlerPrefix: "handle",
                    eventHandlerPropPrefix: "on",
                    checkLocalVariables: true,
                    checkInlineFunction: true,
                },
            ],

            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "error",

            "@tanstack/query/exhaustive-deps": "error",
            "@tanstack/query/stable-query-client": "error",

            "simple-import-sort/exports": "error",
            "simple-import-sort/imports": [
                "error",
                {
                    groups: [
                        ["^react", "^@?\\w"],

                        ["^@/core/domain/"],

                        ["^@/core/presentation/"],

                        ["^@/core/"],

                        ["^@/shared/"],

                        ["^@/features/"],

                        ["^@/"],

                        ["^.+\\.css$"],
                    ],
                },
            ],

            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },
    },
    {
        files: ["**/*.ts"],
        rules: {
            "@typescript-eslint/explicit-function-return-type": [
                "error",
                {
                    allowTypedFunctionExpressions: true,
                },
            ],
        },
    },
    {
        files: ["src/core/domain/**/*.{ts,tsx}"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["@/core/presentation/**", "@/features/**"],
                            message: "core/domain no debe depender de core/presentation ni de features.",
                        },
                        {
                            group: ["../*", "./*", "..", "."],
                            message: 'Las rutas relativas estan prohibidas. Utiliza rutas absolutas comenzando con "@/".',
                        },
                    ],
                },
            ],
        },
    },
    {
        files: ["src/core/presentation/**/*.{ts,tsx}"],
        ignores: ["src/core/presentation/routers/**"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["@/features/**"],
                            message: "core/presentation no debe depender de features (excepto en routers).",
                        },
                        {
                            group: ["../*", "./*", "..", "."],
                            message: 'Las rutas relativas estan prohibidas. Utiliza rutas absolutas comenzando con "@/".',
                        },
                    ],
                },
            ],
        },
    },
    {
        files: ["src/shared/**/*.{ts,tsx}"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["@/features/**"],
                            message: "shared no debe depender de features.",
                        },
                        {
                            group: ["../*", "./*", "..", "."],
                            message: 'Las rutas relativas estan prohibidas. Utiliza rutas absolutas comenzando con "@/".',
                        },
                    ],
                },
            ],
        },
    },
    {
        files: ["**/*.enum.ts"],
        rules: {
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: "variable",
                    modifiers: ["exported"],
                    format: ["UPPER_CASE"],
                },
                {
                    selector: ["typeAlias", "interface"],
                    format: ["PascalCase"],
                },
            ],
        },
    },

    prettierPluginRecommended,
]);
