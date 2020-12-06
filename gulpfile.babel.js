import { src, dest, watch, series, parallel } from "gulp";
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import rename from "gulp-rename";
import size from "gulp-size";
import del from "del";
import browserSync from "browser-sync";
import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import { rollup } from "rollup";
import { terser } from "rollup-plugin-terser";
import gulpTerser from "gulp-terser-js";
import gulpif from "gulp-if";

const options = {
	paths: {
		scss: {
			src: "src/scss/*.scss",
			dest: "dist/css/",
		},
		css: {
			src: "dist/css/*.css",
			dest: "dist/css/",
		},
		js: {
			src: [
				"src/js/Ata/ata_init.js",
				"src/js/Ata/ata_autocomplete_widget.js",
			],
			dest: "dist/js/",
		},
		jsLib: {
			all: {
				src: "",
				dest: "",
			},
			leaflet: {
				src: [
					// "node_modules/leaflet-sidebar/src/L.Control.Sidebar.js",
					"src/js/leaflet/L.Control.AtaPanes.js",
				],
				dest: "dist/js/leaflet/",
			},
		},
	},
	scss: {
		outputStyle: "expanded",
	},
};

// Clean Task
export const clean = (cb) => {
	del(["dist/js/*.js", "dist/css/*.css"]);
	return cb();
};

// SCSS Task
export const scss = () => {
	return src(options.paths.scss.src)
		.pipe(sass(options.scss).on("error", sass.logError))
		.pipe(postcss([autoprefixer()]))
		.pipe(rename({ suffix: ".min" }))
		.pipe(size({ title: "CSS", gzip: true, showFiles: true }))
		.pipe(dest(options.paths.scss.dest))
		.pipe(server.stream());
};

// CSS Minify Task
export const cssMinify = () => {
	return src(options.paths.css.src)
		.pipe(postcss([cssnano()]))
		.pipe(size({ title: "CSS", gzip: true, showFiles: true }))
		.pipe(dest(options.paths.css.dest));
};

// JS Tasks

// Fichiers site (Ata)
const ata = () => {
	return rollup({
		input: "src/js/Ata/index.js",
		plugins: [
			nodeResolve(),
			babel({ babelHelpers: "bundled" }),
			process.env.NODE_ENV === "production" && terser(),
		],
		external: ["jquery"],
	}).then((bundle) => {
		return bundle.write({
			file: "dist/js/ata.min.js",
			name: "Ata",
			exports: "named",
			format: "iife",
			globals: { jquery: "$" },
			esModule: false,
			sourcemap: false,
		});
	});
};

// JS individuels utilisés par le site.
// Les fichiers sont traités individuellement.
const js = () => {
	return (
		src(options.paths.js.src)
			.pipe(
				gulpif(
					process.env.NODE_ENV === "production",
					gulpTerser().on("error", function (error) {
						this.emit("end");
					})
				)
			)
			// .pipe(gulpTerser())
			// .on("error", function (error) {
			// 	this.emit("end");
			// })
			.pipe(rename({ suffix: ".min" }))
			.pipe(size({ title: "JS", gzip: true, showFiles: true }))
			.pipe(dest(options.paths.js.dest))
	);
};

// Plugins Leaflet
// Les fichiers sont traités individuellement
const jsLeaflet = () => {
	return src(options.paths.jsLib.leaflet.src)
		.pipe(
			gulpif(
				process.env.NODE_ENV === "production",
				gulpTerser().on("error", function (error) {
					this.emit("end");
				})
			)
		)
		.pipe(rename({ suffix: ".min" }))
		.pipe(size({ title: "JSLib", gzip: true, showFiles: true }))
		.pipe(dest(options.paths.jsLib.leaflet.dest));
};

export const jsTask = parallel(ata, js, jsLeaflet);

// Browsersync
const server = browserSync.create();
export const serve = (done) => {
	server.init({
		proxy: "http://localhost:8888/ata.dev/?var_mode=recalcul",
		notify: false,
	});
	done();
};
export const reload = (done) => {
	server.reload();
	done();
};

// Watch Task
export const watchFiles = () => {
	watch("src/scss/**/*.scss", scss);
	watch("src/js/**/*.js", series(jsTask, reload));
};

// dev, build and default Tasks
export const dev = series(parallel(scss, jsTask), serve, watchFiles);
export const build = series(clean, parallel(scss, jsTask), cssMinify);
export default dev;
