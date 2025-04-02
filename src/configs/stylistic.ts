import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';
import type { OptionsOverrides, TypedFlatConfigItem } from '../types';

import pluginStylistic from '@stylistic/eslint-plugin';
import pluginAntfu from 'eslint-plugin-antfu';

const defaultOptions: StylisticCustomizeOptions = {
  indent: 2,
  semi: true,
  jsx: false,
  quotes: 'single',
  arrowParens: true,
  blockSpacing: true,
  braceStyle: '1tbs',
  commaDangle: 'always-multiline',
};

export function stylistic(options: StylisticCustomizeOptions & OptionsOverrides = {}): TypedFlatConfigItem {
  const {
    indent,
    semi,
    jsx,
    quotes,
    arrowParens,
    commaDangle,
    blockSpacing,
    braceStyle,
    overrides = {},
  } = {
    ...defaultOptions,
    ...options,
  };

  const config = pluginStylistic.configs.customize({
    pluginName: 'style',
    indent,
    semi,
    jsx,
    quotes,
    arrowParens,
    commaDangle,
    blockSpacing,
    braceStyle,
  });

  return {
    name: 'fledra/stylistic/rules',
    plugins: {
      antfu: pluginAntfu,
      style: pluginStylistic,
    },
    rules: {
      ...config.rules,
      'style/brace-style': ['error', braceStyle, { allowSingleLine: true }],
      'style/no-extra-semi': 'error',
      'style/lines-between-class-members': ['error', 'always'],
      'style/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
      'style/generator-star-spacing': ['error', { after: true, before: false }],
      'style/yield-star-spacing': ['error', { after: true, before: false }],
      'style/padded-blocks': ['error', 'never'],
      'style/object-curly-spacing': ['error', 'always'],

      'antfu/consistent-chaining': 'error',
      'antfu/consistent-list-newline': 'error',
      'antfu/curly': 'error',
      'antfu/if-newline': 'error',
      'antfu/top-level-function': 'error',

      ...overrides,
    },
  };
}
