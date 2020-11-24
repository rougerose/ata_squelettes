import { src, dest, watch, series, parallel, on } from "gulp";
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import rename from "gulp-rename";
import del from "del";
import browserSync from "browser-sync";
import plumber from "gulp-plumber";
import size from "gulp-size";
import fs from "fs";
import path from "path";
import merge from "merge-stream";
import concat from "gulp-concat";
import terser from "gulp-terser-js";
import babel from "gulp-babel";

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
			src: "src/js",
			dest: "dist/js/",
			watch: "src/js/**/*.js",
		},
	},
	scss: {
		outputStyle: "expanded",
	},
};

// Clean Task
export const clean = (cb) => {
	del(["dist/css/*", "dist/js/*"]);
	return cb();
};

// SCSS Task
export const scss = () => {
	return src(options.paths.scss.src)
		.pipe(plumber())
		.pipe(sass(options.scss).on("error", sass.logError))
		.pipe(postcss([autoprefixer()]))
		.pipe(rename({ suffix: ".min" }))
		.pipe(size({ title: "CSS", gzip: true, showFiles: true }))
		.pipe(dest(options.paths.scss.dest))
		.pipe(server.stream());
};

export const cssOptim = () => {
	return src(options.paths.css.src)
		.pipe(plumber())
		.pipe(postcss([cssnano()]))
		.pipe(size({ title: "CSS", gzip: true, showFiles: true }))
		.pipe(dest(options.paths.css.dest));
};

// JS Task
// Compiler les fichiers js dans un sous-dossier
// et les rassembler dans un fichier unique portant le nom du dossier.
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md
export const jsFolders = (cb) => {
	let folders = getFolders(options.paths.js.src);
	let tasks = folders.map(function (folder) {
		return src(path.join(options.paths.js.src, folder, "/*.js"))
			.pipe(concat(folder + ".js"))
			.pipe(babel({ presets: ["@babel/preset-env"] }))
			.pipe(terser())
			.on("error", function (error) {
				this.emit("end");
			})
			.pipe(rename(folder + ".min.js"))
			.pipe(size({ title: "JS", gzip: true, showFiles: true }))
			.pipe(dest(options.paths.js.dest));
	});
	merge(tasks);
	cb();
};

function getFolders(dir) {
	return fs.readdirSync(dir).filter(function (file) {
		return fs.statSync(path.join(dir, file)).isDirectory();
	});
}


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
	watch(options.paths.js.watch, series(jsFolders, reload));
};

// dev, build and default Tasks
export const dev = series(parallel(scss, jsFolders), serve, watchFiles);
export const build = series(clean, parallel(scss, jsFolders), cssOptim);
export default dev;
