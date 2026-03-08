import type { OptionsOverrides, TypedFlatConfigItem } from '../types';

import pluginPerfectionist from 'eslint-plugin-perfectionist';

export function perfectionist(options: OptionsOverrides = {}): TypedFlatConfigItem[] {
  const { overrides } = options;

  return [
    {
      name: 'fledra/perfectionist/setup',
      plugins: {
        perfectionist: pluginPerfectionist,
      },
    },
    {
      name: 'fledra/perfectionist/rules',
      rules: {
        'perfectionist/sort-exports': ['error', { order: 'asc', type: 'natural' }],
        'perfectionist/sort-imports': ['error', {
          groups: [
            'type-import',
            ['type-parent', 'type-sibling', 'type-index', 'type-internal'],
            'value-builtin',
            'value-external',
            'value-internal',
            ['value-parent', 'value-sibling', 'value-index'],
            'side-effect',
            'ts-equals-import',
            'unknown',
          ],
          type: 'natural',
          order: 'asc',
          newlinesBetween: 1,
          newlinesInside: 0,
          internalPattern: ['^~/.*', '^~~/.*', '^@/.*', '^@@/.*'],
        }],
        'perfectionist/sort-named-exports': ['error', { order: 'asc', type: 'natural' }],
        'perfectionist/sort-named-imports': ['error', { order: 'asc', type: 'natural' }],

        ...overrides,
      },
    },
  ];
}
