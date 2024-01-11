import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

const srcDir = "src/js/";
const destDir = "dist/js/";
const terserOptions = {
	compress: { passes: 3 },
	module: true,
	mangle: true,
	nameCache: {},
};
const outputPlugins = () => [process.env.NODE_ENV === "production" && terser()];

function build(src, dist, name, format) {
	return {
		input: srcDir + src,
		plugins: [resolve(), commonjs()],
		output: {
			file: destDir + dist,
			format: format,
			name: name,
			plugins: outputPlugins(),
		},
	};
}

export default [
	build("Ata/index.js", "ata.js", "Ata", "iife"),
	build("Ata/ata_init.js", "ata_init.js", "", "es"),
	build("Atlas/index.js", "atlas.js", "atlas", "iife"),
	build(
		"Atlas/atlas_autocomplete_widget.js",
		"atlas_autocomplete_widget.js",
		"",
		"es"
	),
];
