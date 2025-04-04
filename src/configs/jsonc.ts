import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';

import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types';

import pluginJsonc from 'eslint-plugin-jsonc';
import parserJsonc from 'jsonc-eslint-parser';

import { GLOB_JSON, GLOB_JSON5, GLOB_JSONC } from '../globs';
import { defaultStylisticOptions } from './stylistic';

export interface JSONCOptions extends OptionsFiles, OptionsOverrides {
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
        'jsonc/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
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
              'private',
              'version',
              'license',
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
      files: ['**/tsconfig.json', '**/tsconfig.*.json'],
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
              /* Projects */
              'incremental',
              'composite',
              'tsBuildInfoFile',
              'disableSourceOfProjectReferenceRedirect',
              'disableSolutionSearching',
              'disableReferencedProjectLoad',

              /* Language and Environment */
              'target',
              'jsx',
              'jsxFactory',
              'jsxFragmentFactory',
              'jsxImportSource',
              'lib',
              'moduleDetection',
              'noLib',
              'reactNamespace',
              'useDefineForClassFields',
              'emitDecoratorMetadata',
              'experimentalDecorators',
              'libReplacement',

              /* Modules */
              'baseUrl',
              'rootDir',
              'rootDirs',
              'customConditions',
              'module',
              'moduleResolution',
              'moduleSuffixes',
              'noResolve',
              'resolveJsonModule',
              'resolvePackageJsonExports',
              'resolvePackageJsonImports',
              'allowArbitraryExtensions',
              'allowImportingTsExtensions',
              'allowUmdGlobalAccess',

              /* JavaScript Support */
              'allowJs',
              'checkJs',
              'maxNodeModuleJsDepth',

              /* Type Checking */
              'strict',
              'strictBindCallApply',
              'strictFunctionTypes',
              'strictNullChecks',
              'strictPropertyInitialization',
              'allowUnreachableCode',
              'allowUnusedLabels',
              'alwaysStrict',
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

              /* Emit */
              'declaration',
              'declarationDir',
              'declarationMap',
              'downlevelIteration',
              'emitBOM',
              'emitDeclarationOnly',
              'importHelpers',
              'importsNotUsedAsValues',
              'inlineSourceMap',
              'inlineSources',
              'mapRoot',
              'newLine',
              'noEmit',
              'noEmitHelpers',
              'noEmitOnError',
              'outDir',
              'outFile',
              'preserveConstEnums',
              'preserveValueImports',
              'removeComments',
              'sourceMap',
              'sourceRoot',
              'stripInternal',

              /* Interop Constraints */
              'allowSyntheticDefaultImports',
              'esModuleInterop',
              'forceConsistentCasingInFileNames',
              'isolatedDeclarations',
              'isolatedModules',
              'preserveSymlinks',
              'verbatimModuleSyntax',
              'erasableSyntaxOnly',

              /* Completeness */
              'skipDefaultLibCheck',
              'skipLibCheck',

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
