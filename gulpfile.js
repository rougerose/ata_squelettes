const { gulp, src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-dart-sass');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const del = require('del');

// Options
const options = {
	paths: {
		scss: {
			src: 'src/scss/*.scss',
			dest: 'dist/css/',
			watch: 'src/scss/**/*.scss'
		}
	},
	scss: {
		outputStyle: 'expanded'
	}
}

// Clean
function cleanDist(cb) {
	del.sync([options.paths.scss.dest]);
	return cb();
}

// SCSS
function scssTask() {
	return src(options.paths.scss.src)
		.pipe(sass(options.scss).on('error', sass.logError))
		.pipe(postcss([autoprefixer()]))
		.pipe(dest(options.paths.scss.dest))
		.pipe(rename({ suffix: '.min' }))
		.pipe(postcss([cssnano()]))
		.pipe(dest(options.paths.scss.dest));
}

// Watch
function watchFiles() {
	watch(options.paths.scss.watch, scssTask);
}

exports.watch = series(cleanDist, parallel(scssTask), watchFiles);
exports.default = series(cleanDist, parallel(scssTask));
