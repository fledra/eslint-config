import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';
import type { ParserOptions } from '@typescript-eslint/parser';
import type { Linter } from 'eslint';

import type { FlatGitignoreOptions } from './configs';
import type { RuleOptions } from './typegen';

export type Awaitable<T> = T | Promise<T>;

export interface Rules extends RuleOptions {}

export type TypedFlatConfigItem = Omit<Linter.Config<Linter.RulesRecord & Rules>, 'plugins'> & {
  // Relax plugins type limitation, not every plugin has the correct type info yet
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- note above
  plugins?: Record<string, any>;
};

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>;

export interface OptionsOverrides {
  /**
   * An object containing the overrides for the configured rules.
   */
  overrides?: TypedFlatConfigItem['rules'];
}

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[];
}

export interface TypeScriptWithTypesOptions {
  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string;

  /**
   * Override type aware rules.
   */
  overridesTypeAware?: TypedFlatConfigItem['rules'];
}

export interface TypeScriptParserOptions {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>;

  /**
   * Glob patterns for files that should be type aware.
   * @default ['**\/*.{ts,tsx}']
   */
  filesTypeAware?: string[];

  /**
   * Glob patterns for files that should not be type aware.
   * @default ['**\/*.md\/**']
   */
  ignoresTypeAware?: string[];
}

export type TypescriptOptions =
  | (TypeScriptWithTypesOptions & OptionsOverrides)
  | (TypeScriptParserOptions & OptionsOverrides);

export interface UnicornOptions {
  /**
   * Instead of cherry-picked rules, include all rules recommended by `eslint-plugin-unicorn`
   *
   * @default false
   */
  recommended?: boolean;
}

export interface ConfigOptions extends TypedFlatConfigItem {

  /**
   * Enable gitignore support.
   *
   * Pass an object to configure the options.
   *
   * @default true
   */
  gitignore?: boolean | FlatGitignoreOptions;

  /**
   * Core rules. Can't be disabled.
   */
  javascript?: OptionsOverrides;

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | TypescriptOptions;

  /**
   * Enable JSX related rules.
   *
   * Currently only stylistic rules are included.
   *
   * @default false
   */
  jsx?: boolean;

  /**
   * Options for eslint-plugin-unicorn.
   *
   * @default true
   */
  unicorn?: boolean | UnicornOptions;

  /**
   * Enable stylistic rules.
   *
   * @see https://eslint.style/
   * @default true
   */
  stylistic?: boolean | (StylisticCustomizeOptions & OptionsOverrides);
}
