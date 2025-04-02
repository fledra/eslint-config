# @fledra/eslint-config

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

- No plugins are renamed
- `type` key does not exist in the configuration object

## License

[MIT](./LICENSE) License &copy; 2025-PRESENT [Baran D. (Fledra)](https://fledra.dev)
