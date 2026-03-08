import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types';
import type { StylisticConfigOptions } from './stylistic';

import { GLOB_TOML } from '../globs';
import { interopDefault } from '../utils';
import { defaultStylisticOptions } from './stylistic';

export interface TOMLOptions extends OptionsOverrides, OptionsFiles {
  stylistic?: boolean | Pick<StylisticConfigOptions, 'indent'>;
}

export async function toml(options: TOMLOptions = {}): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_TOML],
    overrides = {},
    stylistic = true,
  } = options;

  const { indent } = {
    ...defaultStylisticOptions,
    ...(typeof stylistic === 'object' && stylistic),
  };

  const [
    pluginToml,
    parserToml,
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-toml')),
    interopDefault(import('toml-eslint-parser')),
  ]);

  return [
    {
      name: 'fledra/toml/setup',
      plugins: {
        toml: pluginToml,
      },
    },
    {
      name: 'fledra/toml/rules',
      languageOptions: {
        parser: parserToml,
      },
      files,
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
          'toml/indent': ['error', typeof indent === 'number' ? indent : 'tab'],
          'toml/inline-table-curly-spacing': 'error',
          'toml/key-spacing': 'error',
          // 'toml/padding-line-between-pairs': 'error',
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
