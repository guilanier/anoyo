/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    printWidth: 100,
    tabWidth: 4,
    trailingComma: 'es5',
    singleQuote: true,
    semi: true,
    vueIndentScriptAndStyle: true,

    // Import order plugin
    // plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-packagejson'],
    importOrderCaseInsensitive: true,
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrder: [
        // Node modules
        '<THIRD_PARTY_MODULES>',

        // Resn libraries
        '^@resn/(.*)$',

        // Local imports
        '^.[.]{0,1}/(?!.*.(scss|css|sass)$).*$',

        // Stlyes
        '.(scss|sass|css)$',
    ],
    overrides: [
        {
            files: '*.yml',
            options: {
                tabWidth: 2,
            },
        },
    ],
};

export default config;
