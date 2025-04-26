import type { ParserOptions } from '@typescript-eslint/parser';

import type { OptionsComponentExts, OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types';

import process from 'node:process';

import pluginTs from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

import { GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from '../globs';

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

export function typescript(
  options: OptionsFiles & OptionsOverrides & OptionsComponentExts & TypeScriptWithTypesOptions & TypeScriptParserOptions = {},
): TypedFlatConfigItem[] {
  const {
    componentExts = [],
    overrides = {},
    overridesTypeAware = {},
    parserOptions = {},
  } = options;

  let files = [
    GLOB_TS,
    GLOB_TSX,
    ...componentExts.map((ext) => `**/*.${ext}`),
  ];

  if (options.files) {
    files = files.concat(options.files);
  }

  const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX];
  const ignoresTypeAware = options.ignoresTypeAware ?? [`${GLOB_MARKDOWN}/**`];
  const tsconfigPath = options?.tsconfigPath ? options.tsconfigPath : undefined;
  const isTypeAware = !!tsconfigPath;

  const typeAwareRules: TypedFlatConfigItem['rules'] = {
    'dot-notation': 'off',
    'no-implied-eval': 'off',
    'ts/await-thenable': 'error',
    'ts/dot-notation': ['error', { allowKeywords: true }],
    'ts/no-floating-promises': 'error',
    'ts/no-for-in-array': 'error',
    'ts/no-implied-eval': 'error',
    'ts/no-misused-promises': 'error',
    'ts/no-unnecessary-type-assertion': 'error',
    'ts/no-unsafe-argument': 'error',
    'ts/no-unsafe-assignment': 'error',
    'ts/no-unsafe-call': 'error',
    'ts/no-unsafe-member-access': 'error',
    'ts/no-unsafe-return': 'error',
    'ts/promise-function-async': 'error',
    'ts/restrict-plus-operands': 'error',
    'ts/restrict-template-expressions': 'error',
    'ts/return-await': ['error', 'in-try-catch'],
    'ts/strict-boolean-expressions': ['error', { allowNullableBoolean: true, allowNullableObject: true }],
    'ts/switch-exhaustiveness-check': 'error',
    'ts/unbound-method': 'error',
  };

  function makeParser(typeAware: boolean, files: string[], ignores?: string[]): TypedFlatConfigItem {
    return {
      name: `fledra/typescript/${typeAware ? 'type-aware-parser' : 'parser'}`,
      files,
      ...(ignores && { ignores }),
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          sourceType: 'module',
          ...(typeAware
            ? {
                projectService: {
                  allowDefaultProject: ['./*.js'],
                  defaultProject: tsconfigPath,
                },
                tsconfigRootDir: process.cwd(),
              }
            : {}),
          ...parserOptions,
        },
      },
    };
  }

  return [
    {
      name: 'fledra/typescript/setup',
      plugins: {
        ts: pluginTs,
      },
    },
    ...(isTypeAware
      ? [
          makeParser(false, files),
          makeParser(true, filesTypeAware, ignoresTypeAware),
        ]
      : [
          makeParser(false, files),
        ]
    ),
    {
      name: 'fledra/typescript/rules',
      files,
      rules: {
        ...pluginTs.configs['eslint-recommended'].rules,
        ...pluginTs.configs.strict.rules,

        'no-unused-vars': 'off',
        'no-use-before-define': 'off',
        'unused-imports/no-unused-vars': 'off', // clashes with `@typescript-eslint/no-unused-vars`

        'ts/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }],
        'ts/consistent-type-definitions': ['error', 'interface'],
        'ts/consistent-type-imports': [
          'error',
          {
            disallowTypeAnnotations: false,
            fixStyle: 'separate-type-imports',
            prefer: 'type-imports',
          },
        ],
        'ts/method-signature-style': ['error', 'property'],
        'ts/no-dupe-class-members': 'error',
        'ts/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
        'ts/no-explicit-any': ['error', { fixToUnknown: true }],
        'ts/no-import-type-side-effects': 'error',
        'ts/no-invalid-void-type': 'off',
        'ts/no-redeclare': ['error', { builtinGlobals: false }],
        'ts/no-require-imports': 'error',
        'ts/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
          },
        ],
        'ts/no-unused-vars': ['error', {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        }],
        'ts/no-use-before-define': ['error', { classes: false, functions: false, variables: true }],
        'ts/no-wrapper-object-types': 'error',
        'ts/unified-signatures': 'off',

        ...overrides,
      },
    },
    ...(isTypeAware
      ? [
          {
            files: filesTypeAware,
            ignores: ignoresTypeAware,
            name: 'fledra/typescript/rules-type-aware',
            rules: {
              ...typeAwareRules,
              ...overridesTypeAware,
            },
          },
        ]
      : []),
  ];
}
