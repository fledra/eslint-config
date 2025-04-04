import type { TypedFlatConfigItem } from '../types';

import { GLOB_IGNORE } from '../globs';

export function ignores(ignores: string[] = []): TypedFlatConfigItem {
  return {
    name: 'fledra/ignores',
    ignores: [
      ...GLOB_IGNORE,
      ...ignores,
    ],
  };
}
