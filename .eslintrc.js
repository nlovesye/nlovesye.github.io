module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],

  // // in antd-design-pro
  // globals: {
  //   ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
  //   page: true,
  // },

  rules: {
    // your rules
  },

  overrides: [
    {
      files: ['./vite.config.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.node.json'],
      },
    },
  ],
};
