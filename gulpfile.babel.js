import { src, dest, watch, series, parallel } from "gulp";
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import rename from "gulp-rename";
import size from "gulp-size";
import del from "del";
import browserSync from "browser-sync";
import webpackStream from "webpack-stream";

const options = {
	paths: {
		scss: {
			src: "src/scss/*.scss",
			dest: "dist/css/",
			watch: "src/scss/**/*.scss",
		},
		css: {
			src: "dist/css/*.css",
			dest: "dist/css/",
		},
		js: {
			src: "src/js/index.js",
			dest: "dist/js/",
			watch: "src/js/**/*.js",
		},
		jsLib: {
			all: {
				src: "",
				dest: "",
			},
			leaflet: {
				src: [
					"node_modules/leaflet-sidebar/src/L.Control.Sidebar.js",
				],
				dest: "dist/js/vendor/",
			},
		},
	},
	scss: {
		outputStyle: "expanded",
	},
};

// Webpack-stream config
// https://gist.github.com/prplmark/cdb1ac061670c7df18b928deae2dcf5c
let config = require("./webpack.config.js");
config.mode = process.env.NODE_ENV;

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

// JS Task
export const js = () => {
	return src(options.paths.js.src)
		.pipe(webpackStream(config))
		.pipe(size({ title: "JS", gzip: true, showFiles: true }))
		.pipe(dest(options.paths.js.dest));
};

// JS Leaflet Lib/Plugins
// chaque plugin est copié séparément
export const jsLeafletLib = () => {
	return src(options.paths.jsLib.leaflet.src)
		.pipe(size({ title: "JSLib", gzip: true, showFiles: true }))
		.pipe(dest(options.paths.jsLib.leaflet.dest));
};

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
	watch(options.paths.scss.watch, scss);
	watch(options.paths.js.watch, series(js, reload));
};

// dev, build and default Tasks
export const dev = series(parallel(scss, js), serve, watchFiles);
export const build = series(clean, parallel(scss, jsLeafletLib, js), cssMinify);
export default dev;
