import { src, dest, watch, series, parallel } from 'gulp';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import rename from 'gulp-rename';
import del from 'del';
import browserSync from 'browser-sync';
import webpackStream from 'webpack-stream';

const options = {
	paths: {
		scss: {
			src: 'src/scss/*.scss',
			dest: 'dist/css/',
			watch: 'src/scss/**/*.scss'
		},
		js: {
			src: 'src/js/index.js',
			dest: 'dist/js/',
			watch: 'src/js/**/*.js'
		}
	},
	scss: {
		outputStyle: 'expanded'
	}
}

// Webpack-stream config
// https://gist.github.com/prplmark/cdb1ac061670c7df18b928deae2dcf5c
let config = require('./webpack.config.js');
config.mode = process.env.NODE_ENV;

// Clean Task
export const clean = (cb) => {
	del.sync(['dist']);
	return cb();
}

// SCSS Task
export const scss = () => {
	return src(options.paths.scss.src)
		.pipe(sass(options.scss).on('error', sass.logError))
		.pipe(postcss([autoprefixer()]))
		.pipe(dest(options.paths.scss.dest))
		.pipe(rename({ suffix: '.min' }))
		.pipe(postcss([cssnano()]))
		.pipe(dest(options.paths.scss.dest))
		.pipe(server.stream());
}

// JS Task
export const js = () => {
	return src(options.paths.js.src)
		.pipe(webpackStream(config))
		.pipe(dest(options.paths.js.dest));
}

// Browsersync
const server = browserSync.create();
export const serve = done => {
	server.init({
		proxy: 'http://localhost:8888/ata.dev/?var_mode=recalcul',
		notify: false
	});
	done();
}
export const reload = done => {
	server.reload();
	done();
}

// Watch Task
export const watchFiles = () => {
	watch(options.paths.scss.watch, scss);
	watch(options.paths.js.watch, series(js, reload));
}

// dev, build and default Tasks
export const dev = series(clean, parallel(scss, js), serve, watchFiles);
export const build = series(clean, parallel(scss, js));
export default dev;
