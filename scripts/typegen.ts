import fs from 'node:fs/promises';

import { flatConfigsToRulesDTS } from 'eslint-typegen/core';
import { builtinRules } from 'eslint/use-at-your-own-risk';

import type { Awaitable, TypedFlatConfigItem } from '../src/types';
import { comments, javascript, node, typescript, stylistic, ignores, imports, disables } from '../src';

// Combine all configs into a single flat array
async function combine(...configs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]) {
  const resolved = await Promise.all(configs);
  return resolved.flat();
}

const configs = await combine(
  {
    plugins: {
      '': {
        rules: Object.fromEntries(builtinRules.entries()),
      },
    },
  },
  ignores(),
  comments(),
  node(),
  javascript(),
  typescript(),
  stylistic(),
  imports(),
  disables(),
);

const configNames = configs.map((i) => i.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, { includeAugmentation: false });
dts += `
// Names of all configs
export type ConfigNames = ${configNames.map((i) => `'${i}'`).join(' | ')};
`;

await fs.writeFile('src/typegen.d.ts', dts);
