import type { TypedFlatConfigItem } from '../types';

import { GLOB_SRC, GLOB_SRC_EXT } from '../globs';

export function disables(): TypedFlatConfigItem[] {
  return [
    {
      name: 'fledra/disables/scripts',
      files: [`**/scripts/${GLOB_SRC}`],
      rules: {
        'no-console': 'off',
      },
    },
    {
      name: 'fledra/disables/bin',
      files: ['**/bin/**/*', `**/bin.${GLOB_SRC_EXT}`],
      rules: {
        'antfu/no-import-dist': 'off',
        'antfu/no-import-node-modules-by-path': 'off',
      },
    },
    {
      name: 'fledra/disables/dts',
      files: ['**/*.d.?([cm])ts'],
      rules: {
        'eslint-comments/no-unlimited-disable': 'off',
        'import/no-duplicates': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      name: 'fledra/disables/config-files',
      files: [`**/*.config.${GLOB_SRC_EXT}`, `**/*.config.*.${GLOB_SRC_EXT}`],
      rules: {
        'no-console': 'off',
      },
    },
  ];
}
