import type { ConfigOptions } from '../src';

import { exec } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { platform } from 'node:process';
import { promisify } from 'node:util';

import { afterAll, beforeAll, it } from 'vitest';

const timeout = platform === 'win32' ? 300_000 : 30_000;

beforeAll(async () => {
  await fs.rm(path.resolve('test', '_fixtures'), { recursive: true, force: true });
});

afterAll(async () => {
  await fs.rm(path.resolve('test', '_fixtures'), { recursive: true, force: true });
});

runWithConfig('default', {});

runWithConfig('js', {
  typescript: false,
  vue: {
    typescript: false,
  },
});

runWithConfig('all', {
  jsonc: true,
  typescript: true,
  vue: true,
});

async function runWithConfig(name: string, config: ConfigOptions) {
  it.concurrent(name, async ({ expect }) => {
    const input = path.resolve('test', 'fixtures', 'input');
    const output = path.resolve('test', 'fixtures', 'output', name);
    const target = path.resolve('test', '_fixtures', name);

    await fs.cp(input, target, { recursive: true });
    await fs.writeFile(
      path.join(target, 'eslint.config.ts'),
      `
// @eslint-disable
import fledra from '../../../src'
export default fledra(${JSON.stringify(config)})
`,
      { encoding: 'utf8' },
    );

    try {
      const execAsync = promisify(exec);
      await execAsync('eslint . --fix', { cwd: target });
    } catch {}

    const files = await fs.readdir(target);
    files.splice(files.findIndex((f) => f === 'eslint.config.ts'), 1);

    await Promise.all(files.map(async (file) => {
      const source = await fs.readFile(path.join(input, file), 'utf-8');
      const content = await fs.readFile(path.join(target, file), 'utf-8');
      const outputPath = path.join(output, file);
      const isTypescriptFile = file.includes('-ts.');

      if (content === source || (!config.typescript && isTypescriptFile)) {
        await fs.rm(outputPath, { force: true });
        return;
      }

      await expect.soft(content).toMatchFileSnapshot(path.join(output, file));
    }));
  }, timeout);
}
