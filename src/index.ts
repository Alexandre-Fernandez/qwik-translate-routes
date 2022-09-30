import {
	readdirSync,
	existsSync,
	lstatSync,
	rmSync,
	readFileSync,
	mkdirSync,
	writeFileSync,
} from "fs"
import { resolve, sep } from "path"

const INITIAL_DEPTH = 1
const METHODS = Object.freeze(["get", "post", "put", "patch", "delete"])

/**
 * @param path A path to the directory to translate recursively (usually
 * `src/routes/en`).
 * @param translations A path to a `.json` translation files directory or an
 * array of paths to `.json` translation files.
 */
export function translateDirectoryRecursive(
	path: string,
	translations: string[],
	cache = {
		root: "",
		depth: INITIAL_DEPTH,
		translations: [] as Record<string, string>[],
	}
) {
	if (cache.depth === INITIAL_DEPTH) {
		// resolving paths and initializing cache
		path = resolve(path)
		translations = translations.map((t) => resolve(t))
		if (translations.length === 1 && isDirectory(translations[0])) {
			translations = readdirSync(translations[0]).reduce(
				(prev, filename) => {
					if (filename.split(".").pop() === "json") {
						prev.push(resolve(translations[0], filename))
					}
					return prev
				},
				[] as string[]
			)
		}
		translations = translations.map((p) => {
			const resolved = resolve(p)
			cache.translations.push(JSON.parse(readFileSync(resolved, "utf8")))
			return resolved
		})
		cache.root = resolve(path, "..")

		// resetting directories
		const baseName = path.split(sep).pop() || ""
		cache.translations.forEach((t) => {
			const translatedBaseName = t[baseName]
			if (translatedBaseName) {
				const translatedDirPath = `${cache.root}${sep}${translatedBaseName}`
				rmSync(translatedDirPath, {
					recursive: true,
					force: true,
				})
				mkdirSync(translatedDirPath)
			}
		})
	}

	readdirSync(path).forEach((filename) => {
		const childPath = resolve(path, filename)
		if (isDirectory(childPath)) {
			cache.translations.forEach((translation) => {
				mkdirSync(getTranslatedPath(translation, childPath, cache.root))
			})
			return translateDirectoryRecursive(childPath, translations, {
				...cache,
				depth: cache.depth + 1,
			})
		}

		if (/^index\.[tj]sx$/.test(filename)) {
			cache.translations.forEach((translation) => {
				writeFileSync(
					getTranslatedPath(translation, childPath, cache.root),
					createQwikForwarder(childPath, cache.depth, cache.root)
				)
			})
		}
	})
}

function getTranslatedPath(
	translation: Record<string, string>,
	path: string,
	ignore = ""
) {
	const ignored = path.replace(ignore, "")
	return `${path.replace(ignored, "")}${ignored
		.split(sep)
		.map((name) => translation[name] || name)
		.join(sep)}`
}

const DEFAULT_ALIAS = "component"
function createQwikForwarder(path: string, depth: number, root = "") {
	let imports = `import { default as ${DEFAULT_ALIAS}`
	const forwarders = [`export default ${DEFAULT_ALIAS}`]

	const file = readFileSync(path, "utf8")
	METHODS.forEach((method) => {
		let fileHasMethod = false
		if (file.includes(`export const on${capitalize(method)}`)) {
			fileHasMethod = true
		} else if (file.includes(`export function on${capitalize(method)}`)) {
			fileHasMethod = true
		}

		if (fileHasMethod) {
			const { imported, forwarder } = importOnMethod(method)
			imports += imported
			forwarders.push(forwarder)
		}
	})

	let importPath = path.replace(root, "").split(sep).slice(0, -1).join(sep)
	if (importPath[0] === sep) importPath = importPath.slice(1)
	imports += ` } from "${"../".repeat(depth)}${importPath}"`

	return `/* eslint-disable */\n${imports}\n\n${forwarders
		.reverse()
		.join("\n\n")}\n`
}

function importOnMethod(method: string) {
	const onMethod = `on${capitalize(method)}`
	const onMethodAlias = `${method}Handler`
	return {
		imported: `, ${onMethod} as ${onMethodAlias}`,
		forwarder: `export const ${onMethod} = ${onMethodAlias}`,
	}
}

function capitalize(string: string) {
	return string[0].toUpperCase() + string.substring(1).toLowerCase()
}

function isDirectory(path: string) {
	return existsSync(path) && lstatSync(path).isDirectory()
}
