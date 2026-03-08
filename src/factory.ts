import type { ResolvableFlatConfig } from 'eslint-flat-config-utils';

import type { ConfigNames } from './typegen';
import type { Awaitable, ConfigOptions, ResolvedOptions, TypedFlatConfigItem } from './types';

import { FlatConfigComposer } from 'eslint-flat-config-utils';
import { isPackageExists } from 'local-pkg';

import {
  comments,
  defaultStylisticOptions,
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

const defaultPluginRenameMapping = {
  '@stylistic': 'style',
  '@typescript-eslint': 'ts',
  'import-lite': 'import',
  'n': 'node',
  'vitest': 'test',
  'yml': 'yaml',
};

const VuePackages = ['vue', 'nuxt'];

export function resolveSubOptions<T extends object, K extends keyof T>(options: T, key: K) {
  if (typeof options[key] === 'boolean' || !options[key]) {
    return {} as never;
  }

  const subOptions = options[key] as ResolvedOptions<T[K]>;
  const stylisticOptions = defaultStylisticOptions;

  if ('stylistic' in options) {
    Object.assign(stylisticOptions, options.stylistic);
  }

  if ('stylistic' in subOptions) {
    Object.assign(stylisticOptions, subOptions.stylistic);
  }

  stylisticOptions.jsx = ('jsx' in stylisticOptions);

  return subOptions;
}

export function fledra(options: ConfigOptions = {}, ...otherConfigs: ResolvableFlatConfig<TypedFlatConfigItem>[]) {
  const {
    componentExts = [],
    ignores: ignoreFiles,
    renamePlugins = true,
    gitignore: enableGitignore = true,
    jsdoc: enableJSDoc = true,
    jsonc: enableJSONC = true,
    node: enableNode = true,
    imports: enableImports = true,
    unicorn: enableUnicorn = true,
    markdown: enableMarkdown = true,
    toml: enableToml = true,
    yaml: enableYaml = true,
    stylistic: enableStylistic = true,
    perfectionist: enablePerfectionist = true,
    typescript: enableTypescript = isPackageExists('typescript'),
    vue: enableVue = VuePackages.some((p) => isPackageExists(p)),
  } = options;

  const configs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[] = [];

  if (enableVue) {
    componentExts.push('vue');
  }

  if (enableGitignore) {
    const gitignoreOptions = resolveSubOptions(options, 'gitignore');
    configs.push(gitignore(gitignoreOptions));
  }

  configs.push(
    ignores(ignoreFiles),
    javascript(resolveSubOptions(options, 'javascript')),
    comments(),
  );

  if (enablePerfectionist) {
    const perfectionistOptions = resolveSubOptions(options, 'perfectionist');
    configs.push(perfectionist(perfectionistOptions));
  }

  if (enableNode) {
    const nodeOptions = resolveSubOptions(options, 'node');
    configs.push(node(nodeOptions));
  }

  if (enableJSDoc) {
    const jsdocOptions = resolveSubOptions(options, 'jsdoc');
    configs.push(jsdoc(jsdocOptions));
  }

  if (enableImports) {
    const importsOptions = resolveSubOptions(options, 'imports');
    configs.push(imports(importsOptions));
  }

  if (enableUnicorn) {
    const unicornOptions = resolveSubOptions(options, 'unicorn');
    configs.push(unicorn(unicornOptions));
  }

  if (enableStylistic) {
    const stylisticOptions = resolveSubOptions(options, 'stylistic');
    configs.push(stylistic(stylisticOptions));
  }

  if (enableTypescript) {
    const typescriptOptions = resolveSubOptions(options, 'typescript');
    configs.push(
      typescript({
        ...typescriptOptions,
        componentExts: Array.from(new Set(componentExts)),
      }),
    );
  }

  if (enableVue) {
    const vueOptions = resolveSubOptions(options, 'vue');
    configs.push(
      vue({
        ...vueOptions,
        typescript: !!enableTypescript,
      }),
    );
  }

  if (enableJSONC) {
    const {
      sort: sorterOptions = true,
      ...jsoncOptions
    } = resolveSubOptions(options, 'jsonc');

    configs.push(jsonc(jsoncOptions));

    if (sorterOptions) {
      if (typeof sorterOptions === 'boolean') {
        configs.push(sortPackageJson(), sortTsconfig());
      } else {
        const {
          packageJson: enablePackageJsonSort = true,
          tsconfig: enableTsconfigSort = true,
        } = sorterOptions;

        if (enablePackageJsonSort) {
          configs.push(sortPackageJson());
        }

        if (enableTsconfigSort) {
          configs.push(sortTsconfig());
        }
      }
    }
  }

  if (enableYaml) {
    const yamlOptions = resolveSubOptions(options, 'yaml');
    configs.push(yaml(yamlOptions));
  }

  if (enableToml) {
    const tomlOptions = resolveSubOptions(options, 'toml');
    configs.push(toml(tomlOptions));
  }

  if (enableMarkdown) {
    const markdownOptions = resolveSubOptions(options, 'markdown');
    configs.push(markdown({
      ...markdownOptions,
      componentExts: Array.from(new Set(componentExts)),
    }));
  }

  configs.push(disables());

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();
  composer = composer.append(...configs, ...otherConfigs);

  if (renamePlugins) {
    composer.renamePlugins(defaultPluginRenameMapping);
  }

  return composer;
}
