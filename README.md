# tsconfig-multiple-extends

> Extend multiple tsconfigs from a single file.

## Installation

```
// npm
npm install -D tsconfig-multiple-extends
// yarn
yarn add -D tsconfig-multiple-extends
// pnpm
pnpm add -D tsconfig-multiple-extends
```

## Usage

-   Star the [github repo](https://github.com/Alexandre-Fernandez/tsconfig-multiple-extends) 😎

### CLI

```css
npx tsconfig-multiple-extends [path_to_config] --extends [path_to_extended_config_1] [path_to_extended_config_2]
```

### Module

```ts
import { Tsconfig } from "tsconfig-multiple-extends"

new Tsconfig("./path/to/tsconfig.json")
	.addExtends("./path/to/extended/tsconfig.json")
	.addExtends("./path/to/another/extended/tsconfig.json")
	.save()
```

## Reference

### CLI

| Option      | Shortcut | Argument    | Description                                                                                       |
| ----------- | -------- | ----------- | ------------------------------------------------------------------------------------------------- |
| --extends   | -xt      | ...string[] | Sets what tsconfigs should the provided one extend                                                |
| --save      | -sv      | string      | Sets the output path                                                                              |
| --noResolve | -nr      | bool        | If present `tsconfig-multiple-extends` won't resolve the extended configs `extends` property.[^1] |

#### Example

```css
npx tsconfig-multiple-extends [path_to_config] --xt [path_to_extended_config] -nr -sv [path_to_output]
```

### Module

```ts
class Tsconfig {
	/**
	 * @param path Path to the `tsconfig.json`.
	 */
	constructor(path: string) {}

	/**
	 * Extends the given `tsconfig.json` with `this`.
	 * @param path A path to the `tsconfig.json`
	 * @param resolveExtends If set to true it will also try to add
	 * all the properties from the extended tsconfigs recursively.
	 * **WARNING**: This will only works with relative paths.
	 */
	addExtends(path: string, resolveExtends = true) {}

	/**
	 * @returns The JSON corresponding to the current `Tsconfig`.
	 */
	toJSON() {}

	/**
	 * Saves the file as JSON to `path`.
	 * @param path Equal to the original constructor path by default.
	 */
	save(path = this.path) {}
}
```

[^1]: Only resolves relative paths from the extended configs.
