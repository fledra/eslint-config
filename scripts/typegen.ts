import type { Awaitable, TypedFlatConfigItem } from '../src/types';

import fs from 'node:fs/promises';

import { flatConfigsToRulesDTS } from 'eslint-typegen/core';
import { builtinRules } from 'eslint/use-at-your-own-risk';

import { comments, disables, ignores, imports, javascript, jsdoc, jsonc, markdown, node, perfectionist, stylistic, typescript, unicorn, vue, yaml } from '../src';
import { toml } from '../src/configs/toml';

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
  jsdoc(),
  jsonc(),
  imports(),
  unicorn(),
  perfectionist(),
  vue(),
  yaml(),
  toml(),
  markdown(),
  disables(),
);

const configNames = configs.map((i) => i.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, { includeAugmentation: false });
dts += `
// Names of all configs
export type ConfigNames = ${configNames.map((i) => `'${i}'`).join(' | ')};
`;

await fs.writeFile('src/typegen.d.ts', dts);
