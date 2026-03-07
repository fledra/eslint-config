import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';

import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types';

import { GLOB_YAML } from '../globs';
import { interopDefault } from '../utils';
import { defaultStylisticOptions } from './stylistic';

export interface YAMLOptions extends OptionsOverrides, OptionsFiles {
  stylistic?: boolean | StylisticCustomizeOptions;
}

export async function yaml(options: YAMLOptions = {}): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_YAML],
    overrides = {},
    stylistic = true,
  } = options;

  const { indent, quotes } = {
    ...defaultStylisticOptions,
    ...(typeof stylistic === 'boolean' ? {} : stylistic),
  };

  const [
    pluginYaml,
    parserYaml,
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-yml')),
    interopDefault(import('yaml-eslint-parser')),
  ]);

  return [
    {
      name: 'fledra/yaml/setup',
      plugins: {
        yaml: pluginYaml,
      },
    },
    {
      name: 'fledra/yaml/rules',
      languageOptions: {
        parser: parserYaml,
      },
      files,
      rules: {
        'style/spaced-comment': 'off', // clashes with yaml plugin rule

        'yaml/block-mapping': 'error',
        'yaml/block-sequence': 'error',
        'yaml/no-empty-key': 'error',
        'yaml/no-empty-sequence-entry': 'error',
        'yaml/no-irregular-whitespace': 'error',
        'yaml/plain-scalar': 'error',

        'yaml/vue-custom-block/no-parsing-error': 'error',

        ...(stylistic && {
          'yaml/block-mapping-question-indicator-newline': 'error',
          'yaml/block-sequence-hyphen-indicator-newline': 'error',
          'yaml/flow-mapping-curly-newline': 'error',
          'yaml/flow-mapping-curly-spacing': 'error',
          'yaml/flow-sequence-bracket-newline': 'error',
          'yaml/flow-sequence-bracket-spacing': 'error',
          'yaml/indent': ['error', typeof indent === 'number' ? indent : undefined],
          'yaml/key-spacing': 'error',
          'yaml/no-tab-indent': 'error',
          'yaml/quotes': ['error', {
            avoidEscape: true,
            prefer: quotes === 'backtick' ? 'single' : quotes,
          }],
          'yaml/spaced-comment': 'error',
        }),

        ...overrides,
      },
    },
    {
      files: ['pnpm-workspace.yaml'],
      name: 'fledra/yaml/pnpm-workspace',
      rules: {
        'yaml/sort-keys': [
          'error',
          {
            order: [
              'packages',
              'overrides',
              'hoistPattern',
              'supportedArchitectures',
              'catalog',
              'catalogs',

              'onlyBuiltDependencies',
              'onlyBuiltDependenciesFile',
              'ignoredBuiltDependencies',
              'ignoredOptionalDependencies',
              'neverBuiltDependencies',
              'patchedDependencies',

              'allowedDeprecatedVersions',
              'allowNonAppliedPatches',
              'configDependencies',
              'packageExtensions',
              'peerDependencyRules',
            ],
            pathPattern: '^$',
          },
          {
            order: { type: 'asc' },
            pathPattern: '.*',
          },
        ],
      },
    },
  ];
}
