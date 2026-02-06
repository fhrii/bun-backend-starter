import { sheriff, type SheriffSettings, tseslint } from 'eslint-config-sheriff';

const sheriffOptions: SheriffSettings = {
  react: false,
  next: false,
  astro: false,
  lodash: false,
  remeda: false,
  playwright: false,
  storybook: false,
  jest: false,
  vitest: false,
};

export default tseslint.config(
  {
    ignores: [
      '**/eslint.config.*',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      'prisma/**',
    ],
  },
  sheriff(sheriffOptions),
  {
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-misused-spread': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'no-restricted-syntax/noClasses': 'off',
      'no-restricted-syntax/noAccessModifiers': 'off',
      'fsecond/prefer-destructured-optionals': 'off',
      'import/no-anonymous-default-export': 'off',
      'import/no-default-export': 'off',
    },
  },
);
