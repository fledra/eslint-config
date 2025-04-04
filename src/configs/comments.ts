import type { TypedFlatConfigItem } from '../types';

// @ts-expect-error no types
import pluginComments from '@eslint-community/eslint-plugin-eslint-comments';

export function comments(): TypedFlatConfigItem {
  return {
    name: 'fledra/eslint-comments/rules',
    plugins: {
      'eslint-comments': pluginComments,
    },
    rules: {
      'eslint-comments/disable-enable-pair': 'error',
      'eslint-comments/no-aggregating-enable': 'error',
      'eslint-comments/no-duplicate-disable': 'error',
      'eslint-comments/no-unlimited-disable': 'error',
      'eslint-comments/no-unused-enable': 'error',
      'eslint-comments/require-description': 'error',
    },
  };
}
