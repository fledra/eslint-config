import type { Linter } from 'eslint';
import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';

import type { ConfigNames, RuleOptions } from './typegen';
import type { Awaitable, ConfigOptions, ResolvedOptions, TypedFlatConfigItem } from './types';

import { FlatConfigComposer } from 'eslint-flat-config-utils';
import { isPackageExists } from 'local-pkg';

import {
  comments,
  disables,
  gitignore,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  perfectionist,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  toml,
  typescript,
  unicorn,
  vue,
  yaml,
} from './configs';

const VuePackages = ['vue', 'nuxt'];

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
    componentExts = [],
    ignores: optionsIgnores,
    gitignore: enableGitignore = true,
    jsx: enableJsx = false,
    jsonc: enableJSONC = true,
    unicorn: enableUnicorn = true,
    markdown: enableMarkdown = true,
    typescript: enableTypescript = isPackageExists('typescript'),
    toml: enableToml = true,
    yaml: enableYaml = true,
    vue: enableVue = VuePackages.some((p) => isPackageExists(p)),
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

  if (enableVue) {
    componentExts.push('vue');
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
    perfectionist(),
  );

  if (enableUnicorn) {
    const unicornOptions = resolveSubOptions(options, 'unicorn');
    configs.push(unicorn(unicornOptions));
  }

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
        componentExts: Array.from(new Set(componentExts)),
        overrides: getOverrides(options, 'typescript'),
      }),
    );
  }

  if (enableVue) {
    const vueOptions = resolveSubOptions(options, 'vue');
    configs.push(vue({
      ...vueOptions,
      overrides: getOverrides(options, 'vue'),
      stylistic: stylisticOptions,
      typescript: !!enableTypescript,
    }));
  }

  if (enableJSONC) {
    const jsoncOptions = resolveSubOptions(options, 'jsonc');
    configs.push(
      jsonc({
        ...jsoncOptions,
        stylistic: stylisticOptions,
      }),
      sortPackageJson(),
      sortTsconfig(),
    );
  }

  if (enableYaml) {
    const yamlOptions = resolveSubOptions(options, 'yaml');
    configs.push(yaml({
      ...yamlOptions,
      stylistic: stylisticOptions,
    }));
  }

  if (enableToml) {
    const tomlOptions = resolveSubOptions(options, 'toml');
    configs.push(toml({
      ...tomlOptions,
      stylistic: stylisticOptions,
    }));
  }

  if (enableMarkdown) {
    const markdownOptions = resolveSubOptions(options, 'markdown');
    configs.push(markdown({
      ...markdownOptions,
      componentExts,
    }));
  }

  configs.push(disables());

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();
  composer = composer.append(...configs, ...otherConfigs);

  return composer;
}
