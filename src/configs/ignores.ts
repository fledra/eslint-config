import { GLOB_IGNORE } from '../globs';
import type { TypedFlatConfigItem } from '../types';

export function ignores(ignores: string[] = []): TypedFlatConfigItem {
  return {
    name: 'fledra/ignores',
    ignores: [
      ...GLOB_IGNORE,
      ...ignores,
    ],
  };
}
