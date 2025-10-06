import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';

import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types';

import pluginJsonc from 'eslint-plugin-jsonc';
import parserJsonc from 'jsonc-eslint-parser';

import { GLOB_JSON, GLOB_JSON5, GLOB_JSONC } from '../globs';
import { defaultStylisticOptions } from './stylistic';

interface JSONCSortableOptions {
  packageJson?: boolean;
  tsconfig?: boolean;
}

export interface JSONCOptions extends OptionsFiles, OptionsOverrides {
  /**
   * Enable auto-sorting of supported JSON files (e.g. `tsconfig.json`)
   *
   * Pass an object to configure which sorters to enable.
   *
   * @default true
   */
  sort?: boolean | JSONCSortableOptions;

  stylistic?: boolean | StylisticCustomizeOptions;
}

export async function jsonc(options: JSONCOptions = {}): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_JSON, GLOB_JSON5, GLOB_JSONC],
    overrides = {},
    stylistic = true,
  } = options;

  const {
    indent = 2,
  } = typeof stylistic === 'boolean' ? defaultStylisticOptions : stylistic;

  return [
    {
      name: 'fledra/jsonc/setup',
      plugins: {
        jsonc: pluginJsonc,
      },
    },
    {
      name: 'fledra/jsonc/rules',
      languageOptions: {
        parser: parserJsonc,
      },
      files,
      rules: {
        'jsonc/array-bracket-spacing': ['error', 'never'],
        'jsonc/comma-dangle': ['error', 'never'],
        'jsonc/comma-style': ['error', 'last'],
        'jsonc/indent': ['error', indent],
        'jsonc/key-spacing': ['error', { afterColon: true, beforeColon: false }],
        'jsonc/no-bigint-literals': 'error',
        'jsonc/no-binary-expression': 'error',
        'jsonc/no-binary-numeric-literals': 'error',
        'jsonc/no-dupe-keys': 'error',
        'jsonc/no-escape-sequence-in-identifier': 'error',
        'jsonc/no-floating-decimal': 'error',
        'jsonc/no-hexadecimal-numeric-literals': 'error',
        'jsonc/no-infinity': 'error',
        'jsonc/no-multi-str': 'error',
        'jsonc/no-nan': 'error',
        'jsonc/no-number-props': 'error',
        'jsonc/no-numeric-separators': 'error',
        'jsonc/no-octal': 'error',
        'jsonc/no-octal-escape': 'error',
        'jsonc/no-octal-numeric-literals': 'error',
        'jsonc/no-parenthesized': 'error',
        'jsonc/no-plus-sign': 'error',
        'jsonc/no-regexp-literals': 'error',
        'jsonc/no-sparse-arrays': 'error',
        'jsonc/no-template-literals': 'error',
        'jsonc/no-undefined-value': 'error',
        'jsonc/no-unicode-codepoint-escapes': 'error',
        'jsonc/no-useless-escape': 'error',
        'jsonc/object-curly-newline': ['error', { consistent: true, multiline: true }],
        'jsonc/object-curly-spacing': ['error', 'always'],
        'jsonc/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
        'jsonc/space-unary-ops': 'error',
        'jsonc/valid-json-number': 'error',
        'jsonc/quote-props': 'error',
        'jsonc/quotes': 'error',
        'jsonc/vue-custom-block/no-parsing-error': 'error',

        ...overrides,
      },
    },
  ];
}

/**
 * Sort package.json
 */
export async function sortPackageJson(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: 'fledra/sort/package-json',
      files: ['**/package.json'],
      rules: {
        'jsonc/sort-array-values': [
          'error',
          {
            order: { type: 'asc' },
            pathPattern: '^files$',
          },
        ],
        'jsonc/sort-keys': [
          'error',
          {
            order: [
              'name',
              'displayName',
              'description',
              'version',
              'license',
              'private',
              'type',
              'module',
              'author',
              'contributors',
              'publisher',
              'bin',
              'main',
              'types',
              'typesVersions',
              'files',
              'imports',
              'exports',
              'homepage',
              'repository',
              'bugs',
              'funding',
              'engines',
              'packageManager',
              'icon',
              'categories',
              'contributes',
              'activationEvents',
              'sideEffects',
              'scripts',
              'dependencies',
              'devDependencies',
              'peerDependencies',
              'peerDependenciesMeta',
              'optionalDependencies',
              'overrides',
              'resolutions',
              'pnpm',
              'husky',
              'simple-git-hooks',
              'lint-staged',
              'eslintConfig',
              'unpkg',
              'jsdelivr',
            ],
            pathPattern: '^$',
          },
          {
            order: { type: 'asc' },
            pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies(Meta)?$',
          },
          {
            order: { type: 'asc' },
            pathPattern: '^(?:resolutions|overrides|pnpm.overrides)$',
          },
          {
            order: [
              'types',
              'import',
              'require',
              'default',
            ],
            pathPattern: '^exports.*$',
          },
          {
            order: [
              // client hooks only
              'pre-commit',
              'prepare-commit-msg',
              'commit-msg',
              'post-commit',
              'pre-rebase',
              'post-rewrite',
              'post-checkout',
              'post-merge',
              'pre-push',
              'pre-auto-gc',
            ],
            pathPattern: '^(?:gitHooks|husky|simple-git-hooks)$',
          },
        ],
      },
    },
  ];
}

/**
 * Sort tsconfig.json
 */
export function sortTsconfig(): TypedFlatConfigItem[] {
  return [
    {
      name: 'fledra/sort/tsconfig-json',
      files: ['**/[jt]sconfig.json', '**/[jt]sconfig.*.json'],
      rules: {
        'jsonc/sort-keys': [
          'error',
          {
            order: [
              'extends',
              'compilerOptions',
              'references',
              'files',
              'include',
              'exclude',
            ],
            pathPattern: '^$',
          },
          {
            order: [
              'incremental',
              'composite',

              'baseUrl',
              'rootDir',
              'rootDirs',
              'outDir',
              'outFile',
              'tsBuildInfoFile',
              'disableSourceOfProjectReferenceRedirect',
              'disableSolutionSearching',
              'disableReferencedProjectLoad',

              'target',
              'module',
              'moduleResolution',
              'moduleDetection',
              'moduleSuffixes',
              'lib',
              'libReplacement',
              'isolatedModules',

              'declaration',
              'declarationDir',
              'declarationMap',
              'isolatedDeclarations',
              'sourceMap',
              'inlineSourceMap',
              'inlineSources',
              'sourceRoot',

              'noEmit',
              'emitBOM',
              'emitDeclarationOnly',

              'strict',
              'allowJs',
              'checkJs',
              'maxNodeModuleJsDepth',

              'esModuleInterop',
              'allowSyntheticDefaultImports',
              'customConditions',
              'downlevelIteration',
              'erasableSyntaxOnly',
              'forceConsistentCasingInFileNames',
              'preserveSymlinks',
              'verbatimModuleSyntax',

              'noLib',
              'noResolve',

              'skipLibCheck',
              'skipDefaultLibCheck',

              'resolveJsonModule',
              'resolvePackageJsonExports',
              'resolvePackageJsonImports',

              'alwaysStrict',
              'strictBindCallApply',
              'strictFunctionTypes',
              'strictNullChecks',
              'strictPropertyInitialization',

              'allowArbitraryExtensions',
              'allowImportingTsExtensions',
              'allowUmdGlobalAccess',
              'allowUnreachableCode',
              'allowUnusedLabels',
              'exactOptionalPropertyTypes',
              'noFallthroughCasesInSwitch',
              'noImplicitAny',
              'noImplicitOverride',
              'noImplicitReturns',
              'noImplicitThis',
              'noPropertyAccessFromIndexSignature',
              'noUncheckedIndexedAccess',
              'noUnusedLocals',
              'noUnusedParameters',
              'useUnknownInCatchVariables',
              'importHelpers',
              'importsNotUsedAsValues',
              'mapRoot',
              'newLine',
              'noEmitHelpers',
              'noEmitOnError',
              'preserveConstEnums',
              'preserveValueImports',
              'removeComments',
              'stripInternal',

              'jsx',
              'jsxFactory',
              'jsxFragmentFactory',
              'jsxImportSource',
              'reactNamespace',
              'useDefineForClassFields',
              'emitDecoratorMetadata',
              'experimentalDecorators',

              /* lastly */
              'paths',
              'typeRoots',
              'types',
            ],
            pathPattern: '^compilerOptions$',
          },
        ],
      },
    },
  ];
}
