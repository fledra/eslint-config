import type { OptionsOverrides, TypedFlatConfigItem } from '../types';

import pluginUnicorn from 'eslint-plugin-unicorn';

export interface UnicornOptions extends OptionsOverrides {
  /**
   * Instead of cherry-picked rules, include all rules recommended by `eslint-plugin-unicorn`
   *
   * @default false
   */
  recommended?: boolean;
}

export function unicorn(options: UnicornOptions = {}): TypedFlatConfigItem {
  const { recommended, overrides } = options;

  return {
    name: 'fledra/unicorn/rules',
    plugins: {
      unicorn: pluginUnicorn,
    },
    rules: {
      ...(recommended
        ? pluginUnicorn.configs.recommended.rules
        : {
            'unicorn/consistent-empty-array-spread': 'error',
            'unicorn/consistent-existence-index-check': 'error',
            'unicorn/consistent-function-scoping': 'error',
            'unicorn/empty-brace-spaces': 'error',
            'unicorn/error-message': 'error',
            'unicorn/escape-case': ['error', 'uppercase'],
            'unicorn/explicit-length-check': 'error',
            'unicorn/new-for-builtins': 'error',
            'unicorn/no-accessor-recursion': 'error',
            'unicorn/no-await-in-promise-methods': 'error',
            'unicorn/no-document-cookie': 'error',
            'unicorn/no-instanceof-builtins': 'error',
            'unicorn/no-new-array': 'error',
            'unicorn/no-new-buffer': 'error',
            'unicorn/number-literal-case': 'error',
            'unicorn/prefer-includes': 'error',
            'unicorn/prefer-node-protocol': 'error',
            'unicorn/prefer-number-properties': 'error',
            'unicorn/prefer-optional-catch-binding': 'error',
            'unicorn/prefer-string-starts-ends-with': 'error',
            'unicorn/prefer-type-error': 'error',
            'unicorn/throw-new-error': 'error',
          }),

      ...overrides,
    },
  };
}
