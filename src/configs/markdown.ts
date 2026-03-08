import type { OptionsComponentExts, OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types';

import pluginMarkdown from '@eslint/markdown';
import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors';

import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN } from '../globs';

export interface MarkdownOptions extends OptionsFiles, OptionsOverrides, OptionsComponentExts {
  /**
   * Enable GitHub flavored markdown support.
   *
   * @default true
   */
  gfm?: boolean;

  /**
   * An object containing the overrides for the configured rules for code blocks in markdown.
   */
  overridesCode?: TypedFlatConfigItem['rules'];
}

export async function markdown(options: MarkdownOptions = {}): Promise<TypedFlatConfigItem[]> {
  const {
    files: _files = [],
    componentExts = [],
    gfm = true,
    overrides,
    overridesCode,
  } = options;

  const files = [GLOB_MARKDOWN, ..._files];

  return [
    {
      name: 'fledra/markdown/setup',
      plugins: {
        markdown: pluginMarkdown,
      },
    },
    {
      name: 'fledra/markdown/processor',
      ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
      files,
      // `eslint-plugin-markdown` only creates virtual files for code blocks,
      // but not the markdown file itself. Use `eslint-merge-processors` to
      // add a pass-through processor for the markdown file itself.
      processor: mergeProcessors([
        pluginMarkdown.processors.markdown,
        processorPassThrough,
      ]),
    },
    {
      name: 'fledra/markdown/parser',
      language: gfm ? 'markdown/gfm' : 'markdown/commonmark',
      files,
    },
    {
      name: 'fledra/markdown/rules',
      files,
      rules: {
        ...pluginMarkdown.configs.recommended.at(0)?.rules,
        'markdown/fenced-code-language': 'off',
        'markdown/no-missing-label-refs': 'off', // https://github.com/eslint/markdown/issues/294
        ...overrides,
      },
    },
    {
      name: 'fledra/markdown/disables/markdown',
      files,
      rules: {
        // Disable rules do not work with markdown sourcecode.
        'no-irregular-whitespace': 'off',
        'perfectionist/sort-exports': 'off',
        'perfectionist/sort-imports': 'off',
        'style/indent': 'off',
      },
    },
    {
      name: 'fledra/markdown/disables/code',
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            impliedStrict: true,
          },
        },
      },
      files: [
        GLOB_MARKDOWN_CODE,
        ...componentExts.map((ext) => `${GLOB_MARKDOWN}/**/*.${ext}`),
      ],
      rules: {
        'no-alert': 'off',
        'no-console': 'off',
        'no-labels': 'off',
        'no-lone-blocks': 'off',
        'no-restricted-syntax': 'off',
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'no-unused-labels': 'off',

        'no-unused-vars': 'off',
        'node/prefer-global/process': 'off',
        'style/comma-dangle': 'off',

        'style/eol-last': 'off',
        'ts/consistent-type-imports': 'off',
        'ts/explicit-function-return-type': 'off',
        'ts/no-namespace': 'off',
        'ts/no-redeclare': 'off',
        'ts/no-require-imports': 'off',
        'ts/no-unused-expressions': 'off',
        'ts/no-unused-vars': 'off',
        'ts/no-use-before-define': 'off',

        'unicode-bom': 'off',
        'unused-imports/no-unused-imports': 'off',
        'unused-imports/no-unused-vars': 'off',

        ...overridesCode,
      },
    },
  ];
}
