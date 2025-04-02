import fs from 'node:fs';
import process from 'node:process';
import { EOL } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';

import { findUpSync } from 'find-up-simple';
import type { TypedFlatConfigItem } from '../types';

export interface FlatGitignoreOptions {
  /**
   * Path to `.gitignore` files, or files with compatible formats like `.eslintignore`.
   * @default ['.gitignore'] // or first match within cwd path
   */
  files?: string | string[];

  /**
   * Path to `.gitmodules` file.
   * @default ['.gitmodules'] // or first match within cwd path
   */
  filesGitModules?: string | string[];

  /**
   * Throw an error if gitignore file not found.
   * @default false
   */
  strict?: boolean;

  /**
   * Mark the current working directory as the root directory,
   * disable searching for `.gitignore` files in parent directories.
   *
   * This option is not effective when `files` is explicitly specified.
   * @default false
   */
  root?: boolean;

  /**
   * Current working directory.
   * Used to resolve relative paths.
   * @default process.cwd()
   */
  cwd?: string;
}

function convertIgnorePatternToMinimatch(pattern: string): string {
  const isNegated = pattern.startsWith('!');
  const negatedPrefix = isNegated ? '!' : '';
  const patternToTest = (isNegated ? pattern.slice(1) : pattern).trimEnd();

  // Special cases
  if (['', '**', '/**', '**/'].includes(patternToTest))
    return `${negatedPrefix}${patternToTest}`;

  const firstIndexOfSlash = patternToTest.indexOf('/');

  const matchEverywherePrefix = firstIndexOfSlash < 0 || firstIndexOfSlash === patternToTest.length - 1 ? '**/' : '';
  const patternWithoutLeadingSlash = firstIndexOfSlash === 0 ? patternToTest.slice(1) : patternToTest;

  /*
   * Escape `{` and `(` because in gitignore patterns they are just
   * literal characters without any specific syntactic meaning,
   * while in minimatch patterns they can form brace expansion or extglob syntax.
   *
   * For example, gitignore pattern `src/{a,b}.js` ignores file `src/{a,b}.js`.
   * But, the same minimatch pattern `src/{a,b}.js` ignores files `src/a.js` and `src/b.js`.
   * Minimatch pattern `src/\{a,b}.js` is equivalent to gitignore pattern `src/{a,b}.js`.
   */
  const escapedPatternWithoutLeadingSlash = patternWithoutLeadingSlash.replaceAll(
    /(?=((?:\\.|[^{(])*))\1([{(])/guy,
    '$1\\$2',
  );

  const matchInsideSuffix = patternToTest.endsWith('/**') ? '/*' : '';

  return `${negatedPrefix}${matchEverywherePrefix}${escapedPatternWithoutLeadingSlash}${matchInsideSuffix}`;
}

function relativeMinimatch(pattern: string, relativePath: string, cwd: string) {
  // if gitignore is in the current directory leave it as is
  if (['', '.', '/'].includes(relativePath))
    return pattern;

  const negated = pattern.startsWith('!') ? '!' : '';
  let cleanPattern = negated ? pattern.slice(1) : pattern;

  if (!relativePath.endsWith('/'))
    relativePath = `${relativePath}/`;

  const isParent = relativePath.startsWith('..');
  // child directories need to just add path in start
  if (!isParent)
    return `${negated}${relativePath}${cleanPattern}`;

  // uncle directories don't make sense
  if (!relativePath.match(/^(\.\.\/)+$/))
    throw new Error('The ignore file location should be either a parent or child directory');

  // if it has ** depth it may be left as is
  if (cleanPattern.startsWith('**'))
    return pattern;

  // if glob doesn't match the parent dirs it should be ignored
  const parents = relative(resolve(cwd, relativePath), cwd).split(/[/\\]/);

  while (parents.length && cleanPattern.startsWith(`${parents[0]}/`)) {
    cleanPattern = cleanPattern.slice(parents[0].length + 1);
    parents.shift();
  }

  // if it has ** depth it may be left as is
  if (cleanPattern.startsWith('**'))
    return `${negated}${cleanPattern}`;

  // if all parents are out, it's clean
  if (parents.length === 0)
    return `${negated}${cleanPattern}`;

  // otherwise it doesn't matches the current folder
  return null;
}

export function gitignore(options: FlatGitignoreOptions = {}): TypedFlatConfigItem {
  const ignores: string[] = [];

  const {
    cwd = process.cwd(),
    root = false,
    files: _files = root ? '.gitignore' : findUpSync('.gitignore', { cwd }) || [],
    filesGitModules: _filesGitModules = root
      ? (fs.existsSync(join(cwd, '.gitmodules')) ? '.gitmodules' : [])
      : findUpSync('.gitmodules', { cwd }) || [],
    strict = true,
  } = options;

  const files = [_files].flat().map((file) => resolve(cwd, file));
  const filesGitModules = [_filesGitModules].flat().map((file) => resolve(cwd, file));

  for (const file of files) {
    let content = '';

    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (error) {
      if (strict) {
        throw error;
      }
      continue;
    }

    const relativePath = relative(cwd, dirname(file)).replaceAll('\\', '/');
    const globs = content.split(EOL)
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => convertIgnorePatternToMinimatch(line))
      .map((glob) => relativeMinimatch(glob, relativePath, cwd))
      .filter((glob) => glob !== null);

    ignores.push(...globs);
  }

  for (const file of filesGitModules) {
    let content = '';

    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (error) {
      if (strict) {
        throw error;
      }
      continue;
    }

    const dirs = content.split(/\r?\n/u)
      .map((line) => line.match(/path\s*=\s*(.+)/u))
      .filter((match) => match !== null)
      .map((match) => match[1].trim());

    ignores.push(...dirs.map((dir) => `${dir}/**`));
  }

  if (strict && files.length === 0) {
    throw new Error('No .gitignore file found');
  }

  return {
    name: 'fledra/gitignore',
    ignores,
  };
}
