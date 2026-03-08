import type { OptionsOverrides, TypedFlatConfigItem } from '../types';

import pluginNode from 'eslint-plugin-n';

import { GLOB_SRC } from '../globs';

export function node(options: OptionsOverrides = {}): TypedFlatConfigItem[] {
  const { overrides } = options;

  return [
    {
      name: 'fledra/node/rules',
      plugins: {
        node: pluginNode,
      },
    },
    {
      name: 'fledra/node/rules',
      files: [GLOB_SRC],
      rules: {
        'node/handle-callback-err': ['error', '^(err|error)$'],
        'node/no-deprecated-api': 'error',
        'node/no-exports-assign': 'error',
        'node/no-new-require': 'error',
        'node/no-path-concat': 'error',
        'node/prefer-global/buffer': ['error', 'never'],
        'node/prefer-global/process': ['error', 'never'],
        'node/process-exit-as-throw': 'error',

        ...overrides,
      },
    },
  ];
}
