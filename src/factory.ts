import type { Linter } from 'eslint';
import type { ConfigNames, RuleOptions } from './typegen';
import type { Awaitable, ConfigOptions, ResolvedOptions, TypedFlatConfigItem } from './types';
import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';

import { FlatConfigComposer } from 'eslint-flat-config-utils';
import { isPackageExists } from 'local-pkg';

import { comments, disables, gitignore, ignores, imports, javascript, node, stylistic, typescript } from './configs';
import { jsdoc } from './configs/jsdoc';

export function resolveSubOptions<K extends keyof ConfigOptions>(options: ConfigOptions, key: K) {
  if (typeof options[key] === 'boolean' || !options[key])
    return {} as never;

  return options[key] as ResolvedOptions<ConfigOptions[K]>;
}

export function getOverrides<K extends keyof ConfigOptions>(
  options: ConfigOptions,
  key: K,
): Partial<Linter.RulesRecord & RuleOptions> {
  const subOptions = resolveSubOptions(options, key);

  if ('overrides' in subOptions) {
    return subOptions.overrides;
  }

  return {};
}

export function fledra(options: ConfigOptions = {}, ...otherConfigs: ResolvableFlatConfig<TypedFlatConfigItem>[]) {
  const {
    ignores: optionsIgnores,
    gitignore: enableGitignore = true,
    jsx: enableJsx = false,
    typescript: enableTypescript = isPackageExists('typescript'),
  } = options;

  const configs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[] = [];

  const stylisticOptions = options.stylistic === false
    ? false
    : typeof options.stylistic === 'object'
      ? options.stylistic
      : {};

  if (stylisticOptions && !('jsx' in stylisticOptions)) {
    stylisticOptions.jsx = enableJsx;
  }

  if (enableGitignore) {
    if (typeof enableGitignore === 'boolean') {
      configs.push(gitignore());
    } else {
      configs.push(gitignore(enableGitignore));
    }
  }

  configs.push(
    ignores(optionsIgnores),
    javascript({ overrides: getOverrides(options, 'javascript') }),
    comments(),
    node(),
    jsdoc(!!stylisticOptions),
    imports(!!stylisticOptions),
  );

  if (stylisticOptions) {
    configs.push(
      stylistic({
        ...stylisticOptions,
        overrides: getOverrides(options, 'stylistic'),
      }),
    );
  }

  if (enableTypescript) {
    const typescriptOptions = resolveSubOptions(options, 'typescript');
    configs.push(
      typescript({
        ...typescriptOptions,
        overrides: getOverrides(options, 'typescript'),
      }),
    );
  }

  configs.push(disables());

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();
  composer = composer.append(...configs, ...otherConfigs);

  return composer;
}
