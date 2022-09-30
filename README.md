# qwik-translate-routes

> Generate translated routes for your qwik project.

## Installation

```
// npm
npm install -D qwik-translate-routes
// yarn
yarn add -D qwik-translate-routes
// pnpm
pnpm add -D qwik-translate-routes
```

## Usage

-   Star the [github repo](https://github.com/Alexandre-Fernandez/qwik-translate-routes) 😎

### CLI

```css
npx qwik-translate-routes [path_to_dir] --translations [path_to_translation_dir_or_file]
```

### Module

```ts
import { translateDirectoryRecursive } from "qwik-translate-routes"

translateDirectoryRecursive("./path/to/dir", [
	"./path/to/translation/file/or/dir",
])
```

### Translation files

Translation files must be a one level deep `.json` file, using the main directory's directory names as keys and the translation as value.

#### Example

_fr.json_

```json
{
	"en": "fr",
	"about": "a-propos",
	"products": "produits"
}
```

This translation file assumes your target directory is called `en` and has subdirectories (nesting doesn't matter) called `about` and `products`.

## Reference

### CLI

| Option         | Shortcut | Argument    | Description                                                                                                     |
| -------------- | -------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| --translations | -tr      | ...string[] | Sets what translations will be used to generate the translated directories, either a path to a dir or 1+ files. |

#### Example

```css
npx qwik-translate-routes [path_to_dir] --tr [path_to_italian_translations] [path_to_german_translations]
```

### Module

```ts
/**
 * @param path A path to the directory to translate recursively (usually
 * `src/routes/en`).
 * @param translations An array of paths to `.json` translation files or an
 * array containing a single path to a translation directory.
 */
export function translateDirectoryRecursive(
	path: string,
	translations: string[]
) {}
```
