import type { OptionsOverrides, TypedFlatConfigItem } from '../types';

import pluginAntfu from 'eslint-plugin-antfu';
import pluginImport from 'eslint-plugin-import-lite';

export interface ImportsOptions extends OptionsOverrides {
  stylistic?: boolean;
}

export function imports(options: ImportsOptions = {}): TypedFlatConfigItem {
  const { overrides, stylistic } = options;

  return {
    name: 'fledra/imports/rules',
    plugins: {
      antfu: pluginAntfu,
      import: pluginImport,
    },
    rules: {
      'antfu/import-dedupe': 'error',
      'antfu/no-import-dist': 'error',
      'antfu/no-import-node-modules-by-path': 'error',

      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import/no-duplicates': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-named-default': 'error',

      ...(stylistic && {
        'import/newline-after-import': ['error', { count: 1 }],
      }),

      ...overrides,
    },
  };
}
