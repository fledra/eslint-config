import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';

import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types';

import pluginToml from 'eslint-plugin-toml';
import parserToml from 'toml-eslint-parser';

import { GLOB_TOML } from '../globs';
import { defaultStylisticOptions } from './stylistic';

export interface TOMLOptions extends OptionsOverrides, OptionsFiles {
  stylistic?: boolean | StylisticCustomizeOptions;
}

export function toml(options: TOMLOptions = {}): TypedFlatConfigItem[] {
  const {
    files = [GLOB_TOML],
    overrides = {},
    stylistic = true,
  } = options;

  const {
    indent,
  } = {
    ...defaultStylisticOptions,
    ...(typeof stylistic === 'boolean' ? {} : stylistic),
  };

  return [
    {
      name: 'fledra/toml/setup',
      plugins: {
        toml: pluginToml,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserToml,
      },
      name: 'fledra/toml/rules',
      rules: {
        'style/spaced-comment': 'off', // clashes with toml plugin rule

        'toml/comma-style': 'error',
        'toml/keys-order': 'error',
        'toml/no-space-dots': 'error',
        'toml/no-unreadable-number-separator': 'error',
        'toml/precision-of-fractional-seconds': 'error',
        'toml/precision-of-integer': 'error',
        'toml/tables-order': 'error',

        'toml/vue-custom-block/no-parsing-error': 'error',

        ...(stylistic && {
          'toml/array-bracket-newline': 'error',
          'toml/array-bracket-spacing': ['error', 'never'],
          'toml/array-element-newline': 'error',
          'toml/indent': ['error', indent === 'tab' ? 2 : indent],
          'toml/inline-table-curly-spacing': 'error',
          'toml/key-spacing': 'error',
          'toml/padding-line-between-pairs': 'error',
          'toml/padding-line-between-tables': 'error',
          'toml/quoted-keys': 'error',
          'toml/spaced-comment': 'error',
          'toml/table-bracket-spacing': 'error',
        }),

        ...overrides,
      },
    },
  ];
}
