import { src, dest, watch, series, parallel } from "gulp";
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import rename from "gulp-rename";
import size from "gulp-size";
import del from "del";
import browserSync from "browser-sync";
import { rollup } from "rollup";
import replace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import gulpTerser from "gulp-terser-js";
import gulpif from "gulp-if";
import sassVar from "gulp-sass-variables";

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
				"src/js/Atlas/atlas_autocomplete_widget.js",
			],
			dest: "dist/js/",
		},
		jsLib: {
			all: {
				src: ["node_modules/imagesloaded/imagesloaded.pkgd.js"],
				dest: "dist/js/lib/",
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
        .pipe(sassVar({ $env: process.env.NODE_ENV }))
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
        });
    });
};

// Fichiers site (Atlas)
const atlas = () => {
	return rollup({
        input: "src/js/Atlas/index.js",
        plugins: [
            nodeResolve(),
            commonjs(),
            replace({ "process.env.NODE_ENV": JSON.stringify("development") }),
            babel({ babelHelpers: "bundled" }),
            process.env.NODE_ENV === "production" && terser(),
        ],
        external: ["jquery", "leaflet"],
    }).then((bundle) => {
        return bundle.write({
            file: "dist/js/atlas.min.js",
            format: "iife",
            name: "atlas",
            esModule: false,
            globals: { jquery: "$", leaflet: "L" },
        });
    });
};

// JS individuels utilisés par le site.
// Les fichiers sont traités individuellement.
const js = () => {
	return src(options.paths.js.src)
		.pipe(
			gulpif(
				process.env.NODE_ENV === "production",
				gulpTerser().on("error", function (error) {
					this.emit("end");
				})
			)
		)
		.pipe(rename({ suffix: ".min" }))
		.pipe(size({ title: "JS", gzip: true, showFiles: true }))
		.pipe(dest(options.paths.js.dest));
};

// JS Lib
// Les fichiers sont traités individuellement
const jsLib = () => {
	return src(options.paths.jsLib.all.src)
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
		.pipe(dest(options.paths.jsLib.all.dest));
};

export const jsTask = series(ata, atlas, js);


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
	watch(
		["src/js/Ata/*.js", "src/js/Atlas/*.js"],
		series(jsTask, reload)
	);
};

// dev, build and default Tasks
export const dev = series(parallel(scss, jsTask), serve, watchFiles);
export const build = series(clean, parallel(scss, jsTask), cssMinify);
export default dev;
