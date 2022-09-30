#!/usr/bin/env node
import { translateDirectoryRecursive } from ".."

const CMD = "tsconfig-multiple-extends"

const args = {
	path: "",
	translations: [] as string[],
}

let mode: keyof typeof args = "path"
for (const arg of process.argv.slice(2)) {
	if (arg === "--translations" || arg === "-tr") {
		mode = "translations"
		continue
	}
	switch (mode) {
		case "path":
			args.path = arg
			break
		case "translations":
			args.translations.push(arg)
			break
		default:
			throw new Error("Invalid command.")
	}
}

if (args.path) {
	if (args.translations.length > 0) {
		translateDirectoryRecursive(args.path, args.translations)
	} else {
		console.error(
			"Error: Provide the path to the route translations directory or to the route translation files."
		)
		console.log(
			`Example: \n  ${CMD} [path_to_dir] --translations [path_to_translate_dir] \n  ${CMD} [path_to_dir] --translations [path_to_translate_file] [path_to_translate_file]`
		)
	}
} else {
	console.error("Error: Provide the path to the directory to translate.")
	console.log(
		`Example: \n  ${CMD} [path_to_dir] --translations [path_to_translate_dir] \n  ${CMD} [path_to_dir] --translations [path_to_translate_file] [path_to_translate_file]`
	)
}
