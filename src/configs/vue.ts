import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks';

import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types';

import { mergeProcessors } from 'eslint-merge-processors';
import pluginVue from 'eslint-plugin-vue';
import processorVueBlocks from 'eslint-processor-vue-blocks';
import parserVue from 'vue-eslint-parser';

import { GLOB_VUE } from '../globs';
import { defaultStylisticOptions } from './stylistic';

export interface VueOptions extends OptionsOverrides, OptionsFiles {
  /**
   * Vue version. Apply different rules set from `eslint-plugin-vue`.
   *
   * @default 3
   */
  vueVersion?: 2 | 3;

  /**
   * Create virtual files for Vue SFC blocks to enable linting.
   *
   * @see https://github.com/antfu/eslint-processor-vue-blocks
   * @default true
   */
  sfcBlocks?: boolean | VueBlocksOptions;

  jsx?: boolean;
  typescript?: boolean;
  stylistic?: boolean | StylisticCustomizeOptions;
}

export async function vue(options: VueOptions = {}): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_VUE],
    overrides = {},
    jsx = false,
    stylistic = true,
    vueVersion = 3,
  } = options;

  const sfcBlocks = options.sfcBlocks === true ? {} : options.sfcBlocks ?? {};

  const {
    indent,
    commaDangle,
    braceStyle,
  } = {
    ...defaultStylisticOptions,
    ...(typeof stylistic === 'boolean' ? {} : stylistic),
  };

  return [
    {
      name: 'fledra/vue/setup',
      plugins: {
        vue: pluginVue,
      },
      // This allows Vue plugin to work with auto imports
      // https://github.com/vuejs/eslint-plugin-vue/pull/2422
      languageOptions: {
        globals: {
          // vue
          ComputedRef: 'readonly',
          InjectionKey: 'readonly',
          MaybeRef: 'readonly',
          MaybeRefOrGetter: 'readonly',
          Ref: 'readonly',
          WritableComputedRef: 'readonly',
          computed: 'readonly',
          defineAsyncComponent: 'readonly',
          defineComponent: 'readonly',
          defineEmits: 'readonly',
          defineExpose: 'readonly',
          defineProps: 'readonly',
          h: 'readonly',
          inject: 'readonly',
          isProxy: 'readonly',
          isReactive: 'readonly',
          isReadonly: 'readonly',
          isRef: 'readonly',
          markRaw: 'readonly',
          nextTick: 'readonly',
          onMounted: 'readonly',
          onUnmounted: 'readonly',
          provide: 'readonly',
          reactive: 'readonly',
          readonly: 'readonly',
          ref: 'readonly',
          resolveComponent: 'readonly',
          shallowReactive: 'readonly',
          shallowReadonly: 'readonly',
          shallowRef: 'readonly',
          toRaw: 'readonly',
          toRef: 'readonly',
          toRefs: 'readonly',
          toValue: 'readonly',
          unref: 'readonly',
          useSlots: 'readonly',
          watch: 'readonly',
          watchEffect: 'readonly',

          // vue-router
          useLink: 'readonly',
          useRoute: 'readonly',
          useRouter: 'readonly',
          onBeforeRouteLeave: 'readonly',
          onBeforeRouteUpdate: 'readonly',

          // pinia
          acceptHMRUpdate: 'readonly',
          createPinia: 'readonly',
          defineStore: 'readonly',
          getActivePinia: 'readonly',
          mapActions: 'readonly',
          mapGetters: 'readonly',
          mapState: 'readonly',
          mapStores: 'readonly',
          mapWritableState: 'readonly',
          setActivePinia: 'readonly',
          setMapStoreSuffix: 'readonly',
          storeToRefs: 'readonly',
        },
      },
    },
    {
      name: 'fledra/vue/rules',
      files,
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          extraFileExtensions: ['.vue'],
          parser: options.typescript ? await import('@typescript-eslint/parser') : null,
          sourceType: 'module',
          ecmaFeatures: {
            jsx,
          },
        },
      },
      processor: sfcBlocks === false
        ? pluginVue.processors['.vue']
        : mergeProcessors([
            pluginVue.processors['.vue'],
            processorVueBlocks({
              ...sfcBlocks,
              blocks: {
                styles: true,
                ...sfcBlocks.blocks,
              },
            }),
          ]),
      rules: {
        ...pluginVue.configs.base.rules,

        ...vueVersion === 2
          ? {
              ...pluginVue.configs['vue2-essential'].rules,
              ...pluginVue.configs['vue2-strongly-recommended'].rules,
              ...pluginVue.configs['vue2-recommended'].rules,
            }
          : {
              ...pluginVue.configs['flat/essential'].map((c) => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}),
              ...pluginVue.configs['flat/strongly-recommended'].map((c) => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}),
              ...pluginVue.configs['flat/recommended'].map((c) => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}),
            },

        'node/prefer-global/process': 'off',
        'ts/explicit-function-return-type': 'off',

        'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/component-options-name-casing': ['error', 'PascalCase'],
        'vue/custom-event-name-casing': ['error', 'camelCase'],
        'vue/define-macros-order': ['error', {
          order: [
            'defineOptions',
            'defineProps',
            'defineEmits',
            'defineSlots',
          ],
        }],
        'vue/dot-location': ['error', 'property'],
        'vue/dot-notation': ['error', { allowKeywords: true }],
        'vue/eqeqeq': ['error', 'smart'],
        'vue/html-indent': ['error', indent],
        'vue/html-quotes': ['error', 'double'],
        'vue/max-attributes-per-line': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/no-dupe-keys': 'off',
        'vue/no-empty-pattern': 'error',
        'vue/no-irregular-whitespace': 'error',
        'vue/no-loss-of-precision': 'error',
        'vue/no-restricted-syntax': [
          'error',
          'DebuggerStatement',
          'LabeledStatement',
          'WithStatement',
        ],
        'vue/no-restricted-v-bind': ['error', '/^v-/'],
        'vue/no-setup-props-reactivity-loss': 'off',
        'vue/no-sparse-arrays': 'error',
        'vue/no-unused-refs': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/no-v-html': 'off',
        'vue/object-shorthand': ['error', 'always', {
          avoidQuotes: true,
          ignoreConstructors: false,
        }],
        'vue/prefer-separate-static-class': 'error',
        'vue/prefer-template': 'error',
        'vue/prop-name-casing': ['error', 'camelCase'],
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'off',
        'vue/space-infix-ops': 'error',
        'vue/space-unary-ops': ['error', { nonwords: false, words: true }],

        ...(stylistic && {
          'vue/array-bracket-spacing': ['error', 'never'],
          'vue/arrow-spacing': ['error', { after: true, before: true }],
          'vue/block-spacing': ['error', 'always'],
          'vue/block-tag-newline': ['error', {
            multiline: 'always',
            singleline: 'always',
          }],
          'vue/brace-style': ['error', braceStyle, { allowSingleLine: true }],
          'vue/comma-dangle': ['error', commaDangle],
          'vue/comma-spacing': ['error', { after: true, before: false }],
          'vue/comma-style': ['error', 'last'],
          'vue/html-comment-content-spacing': ['error', 'always', {
            exceptions: ['-'],
          }],
          'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
          'vue/keyword-spacing': ['error', { after: true, before: true }],
          'vue/object-curly-newline': 'off',
          'vue/object-curly-spacing': ['error', 'always'],
          'vue/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
          'vue/operator-linebreak': ['error', 'before'],
          'vue/padding-line-between-blocks': ['error', 'always'],
          'vue/quote-props': ['error', 'consistent-as-needed'],
          'vue/space-in-parens': ['error', 'never'],
          'vue/template-curly-spacing': 'error',
        }),

        ...overrides,
      },
    },
  ];
}
