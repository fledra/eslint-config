import type { TypedFlatConfigItem } from '../types';

import pluginJsdoc from 'eslint-plugin-jsdoc';

import { GLOB_SRC } from '../globs';

export interface JSDocOptions {
  /**
   * @default true
   */
  stylistic?: boolean;
}

export function jsdoc(options: JSDocOptions = {}): TypedFlatConfigItem[] {
  const {
    stylistic = true,
  } = options;

  return [
    {
      name: 'fledra/jsdoc/setup',
      plugins: {
        jsdoc: pluginJsdoc,
      },
    },
    {
      name: 'fledra/jsdoc/rules',
      files: [GLOB_SRC],
      rules: {
        'jsdoc/check-access': 'warn',
        'jsdoc/check-param-names': 'warn',
        'jsdoc/check-property-names': 'warn',
        'jsdoc/check-types': 'warn',
        'jsdoc/empty-tags': 'warn',
        'jsdoc/implements-on-classes': 'warn',
        'jsdoc/no-defaults': 'warn',
        'jsdoc/no-multi-asterisks': 'warn',
        'jsdoc/require-param-name': 'warn',
        'jsdoc/require-property': 'warn',
        'jsdoc/require-property-description': 'warn',
        'jsdoc/require-property-name': 'warn',
        'jsdoc/require-returns-check': 'warn',
        'jsdoc/require-returns-description': 'warn',
        'jsdoc/require-yields-check': 'warn',

        ...(stylistic && {
          'jsdoc/check-alignment': 'warn',
          'jsdoc/multiline-blocks': 'warn',
        }),
      },
    },
  ];
}
