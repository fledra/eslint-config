import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';
import type { Linter } from 'eslint';

import type { FlatGitignoreOptions, TypescriptOptions, UnicornOptions, VueOptions } from './configs';
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

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ['vue']
   * @default []
   */
  componentExts?: string[];
}

export interface ConfigOptions extends TypedFlatConfigItem, OptionsComponentExts {

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
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean | VueOptions;

  /**
   * Options for eslint-plugin-unicorn.
   *
   * @default true
   */
  unicorn?: boolean | UnicornOptions;

  /**
   * Enable JSONC support.
   *
   * @default true
   */
  jsonc?: boolean | OptionsOverrides;

  /**
   * Enable YAML support.
   *
   * @default true
   */
  yaml?: boolean | OptionsOverrides;

  /**
   * Enable TOML support.
   *
   * @default true
   */
  toml?: boolean | OptionsOverrides;

  /**
   * Enable linting for **code snippets** in Markdown.
   *
   * @default true
   */
  markdown?: boolean | OptionsOverrides;

  /**
   * Enable stylistic rules.
   *
   * @see https://eslint.style/
   * @default true
   */
  stylistic?: boolean | (StylisticCustomizeOptions & OptionsOverrides);
}
