# @fledra/eslint-config

![NPM Version](https://img.shields.io/npm/v/%40fledra%2Feslint-config?labelColor=%23444&color=%23333)

One opinionated config for ESLint.

This config is a refactored/modified version of [Anthony Fu's ESLint config](https://github.com/antfu/eslint-config).
I will not copy every change from his config but I might occasionally yoink the ones I like.

- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files) format
- Respects `.gitignore` by default
- **Code style**: Minimal for reading, stable for diff, consistent... enough.
  - Using [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
  - Dangling commas
  - Single quotes
  - With semi

## Usage

### Install

First install `eslint` and this config:

```bash
pnpm i -D eslint @fledra/eslint-config
```

And create `eslint.config.mjs` in your project root:

```js
// eslint.config.mjs
import fledra from '@fledra/eslint-config';

export default fledra();
```

### Add script for package.json

For example:

```json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

## Customization

I followed Anthony's config for the most part so configuration options are pretty much the same. Check out [customization](https://github.com/antfu/eslint-config#customization) section of his config for more info.

### Important notes about configuration

- `type` key does not exist in the configuration object

## Plugins Renaming

I thought I did not want any plugin renaming at first but only kept the original name of `@typescript-eslint`, which was confusing.

From version `2.0.0` onwards plugin renaming is enabled by default.

| New Prefix | Original Prefix        | Source Plugin                                                                              |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `import/*` | `import-lite/*`        | [eslint-plugin-import-lite](https://github.com/9romise/eslint-plugin-import-lite)          |
| `node/*`   | `n/*`                  | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)                     |
| `yaml/*`   | `yml/*`                | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)                        |
| `ts/*`     | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) |
| `style/*`  | `@stylistic/*`         | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic)           |

When you want to override rules, or disable them inline, you need to use the new prefix:

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

### Change back to original prefix

If you really want to use the original prefix, you can revert the plugin renaming by:

```ts
import fledra from '@fledra/eslint-config';

export default fledra()
  .renamePlugins({
    ts: '@typescript-eslint',
    yaml: 'yml',
    node: 'n'
    // ...
  });
```

## License

[MIT](./LICENSE) License &copy; 2025-PRESENT [Baran D. (Fledra)](https://fledra.dev)
