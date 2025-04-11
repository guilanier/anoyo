import config from '@resn/eslint-plugin/flat';

export default [
    {
        ignores: [
            '**/node_modules/*',
            '**/dist/*',
            '**/.nuxt/*',
            '**/.output/*',
            '**/.cache/*',
            'apps/frontend/src/public/*',
        ],
    },
    ...config,
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
];
