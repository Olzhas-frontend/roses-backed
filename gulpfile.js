const { src, dest, series, watch } = require('gulp');
const path = require('path');
const rootFolder = path.basename(path.resolve());
const browserSync = require('browser-sync').create();
const argv = require('yargs').argv;
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const rigger = require('gulp-rigger');
const del = require('del');
const changed = require('gulp-changed');
const debug = require('gulp-debug');
const zip = require('gulp-zip');

const gulpSass = require('gulp-sass');
const sass = require('sass');
const mainSass = gulpSass(sass);
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const sassGlob = require('gulp-sass-glob');

const ttf2woff2 = require('gulp-ttf2woff2');
const imagemin = require('gulp-imagemin');
const svgSprite = require('gulp-svg-sprite');
const imageminPngquant = require('imagemin-pngquant');
const webp = require('gulp-webp');
const webpack = require('webpack-stream');
const srcFolder = './app';
const buildFolder = './build';
let isProd = false;

const paths = {
	src: {
		html: `${srcFolder}/views/*.html`,
		css: `${srcFolder}/styles/**/*.scss`,
		js: `${srcFolder}/scripts/index.js`,
		resources: `${srcFolder}/resources/**/*`,
		images: `${srcFolder}/assets/images/**/**.{jpg,jpeg,png,svg}`,
		iconsMono: `${srcFolder}/assets/icons/mono/**/*.svg`,
		iconsMulti: `${srcFolder}/assets/icons/multi/**/*.svg`,
		fonts: `${srcFolder}/assets/fonts/**/**/*.ttf`,
	},
	build: {
		html: `${buildFolder}`,
		css: `${buildFolder}/css/`,
		js: `${buildFolder}/scripts/`,
		images: `${buildFolder}/images/`,
		resources: `${buildFolder}/resources/`,
		fonts: `${buildFolder}/fonts/`,
	},
	watch: {
		html: `${srcFolder}/views/**/*.html`,
		css: `${srcFolder}/styles/**/*.scss`,
		js: `${srcFolder}/scripts/**/**/*.js`,
		images: `${srcFolder}/assets/images/**/*`,
		iconsMono: `${srcFolder}/assets/icons/mono/**/*.svg`,
		iconsMulti: `${srcFolder}/assets/icons/multi/**/*.svg`,
	},
};

const clean = () => {
	return del([buildFolder]);
};

// scss styles
const styles = () => {
	return src(paths.src.css)
		.pipe(gulpif(!argv.prod, sourcemaps.init()))
		.pipe(
			plumber(
				notify.onError({
					title: 'SCSS',
					message: 'Error: <%= error.message %>',
				})
			)
		)
		.pipe(sassGlob())
		.pipe(
			mainSass({
				outputStyle: 'expanded',
			})
		)
		.pipe(gulpif(argv.prod, gcmq()))
		.pipe(
			gulpif(
				argv.prod,
				autoprefixer({
					overrideBrowserslist: [' last 2 version '],
					cascade: false,
					grid: true,
				})
			)
		)
		.pipe(gulpif(argv.prod, cleanCSS({ level: 2 })))
		.pipe(
			rename({
				suffix: '.min',
			})
		)
		.pipe(gulpif(!argv.prod, sourcemaps.write('.')))
		.pipe(dest(paths.build.css))
		.pipe(browserSync.stream());
};

const stylesBackend = () => {
	return src(paths.src.css)
		.pipe(
			plumber(
				notify.onError({
					title: 'SCSS',
					message: 'Error: <%= error.message %>',
				})
			)
		)
		.pipe(sassGlob())
		.pipe(mainSass())
		.pipe(
			autoprefixer({
				cascade: false,
				grid: true,
				overrideBrowserslist: ['last 5 versions'],
			})
		)
		.pipe(dest(paths.build.css))
		.pipe(browserSync.stream());
};

const htmlRigger = () => {
	return src([`${srcFolder}/views/*.html`])
		.pipe(rigger())
		.pipe(dest(buildFolder))
		.pipe(browserSync.stream());
};

const spritesMono = () => {
	return src(paths.src.iconsMono)
		.pipe(
			svgSprite({
				mode: {
					symbol: {
						sprite: '../sprites/sprite-mono.svg',
					},
				},
				shape: {
					transform: [
						{
							svgo: {
								plugins: [
									{
										removeAttrs: {
											attrs: ['class', 'data-name', 'fill', 'stroke.*'],
										},
									},
								],
							},
						},
					],
				},
			})
		)
		.pipe(dest(paths.build.images))
		.pipe(browserSync.stream());
};

const spritesMulti = () => {
	return src(paths.src.iconsMulti)
		.pipe(
			svgSprite({
				mode: {
					symbol: {
						sprite: '../sprites/sprite-multi.svg',
					},
				},
				shape: {
					transform: [
						{
							svgo: {
								plugins: [
									{
										removeAttrs: {
											attrs: ['class', 'data-name'],
										},
									},
									{
										removeUselessStrokeAndFill: false,
									},
									{
										inlineStyles: true,
									},
								],
							},
						},
					],
				},
			})
		)
		.pipe(dest(paths.build.images))
		.pipe(browserSync.stream());
};

const scripts = () => {
	return src(paths.src.js)
		.pipe(
			webpack({
				mode: isProd ? 'production' : 'development',
				devtool: !isProd ? 'source-map' : false,
				output: {
					filename: '[name].bundle.js',
				},
				entry: {
					index: './app/scripts/index.js',
					account: './app/scripts/account.js',
					singlePage: './app/scripts/singlePage.js',
				},
				experiments: {
					topLevelAwait: true,
				},
				//module: {
				//	rules: [
				//		{
				//			test: /\.js$/,
				//			exclude: /node_modules/,
				//			use: ['babel-loader'],
				//		},
				//	],
				//},
			})
		)
		.pipe(dest(paths.build.js))
		.pipe(browserSync.stream());
};

const scriptsBackend = () => {
	return src(paths.src.js).pipe(rigger()).pipe(dest(paths.build.js)).pipe(browserSync.stream());
};

const resources = () => {
	return src(paths.src.resources).pipe(dest(paths.build.resources));
};

const images = () => {
	return src(paths.src.images)
		.pipe(changed(paths.build.images))
		.pipe(debug({ title: 'Image' }))
		.pipe(
			imagemin(
				[
					imagemin.mozjpeg({ quality: 75, progressive: true }),
					imageminPngquant({ quality: [0.8, 0.9] }),
					imagemin.svgo(),
				],
				{
					verbose: true,
				}
			)
		)
		.pipe(dest(paths.build.images))
		.pipe(browserSync.stream());
};

const webpImages = () => {
	return src([`${paths.src.images}`])
		.pipe(webp())
		.pipe(dest(paths.build.images));
};

const fonts = () => {
	return src(paths.src.fonts).pipe(ttf2woff2()).pipe(dest(paths.build.fonts));
};

const zipFiles = (done) => {
	del.sync([`${buildFolder}/*.zip`]);
	return src(`${buildFolder}/**/*.*`, {})
		.pipe(
			plumber(
				notify.onError({
					title: 'ZIP',
					message: 'Error: <%= error.message %>',
				})
			)
		)
		.pipe(zip(`${rootFolder}.zip`))
		.pipe(dest(buildFolder));
};

const toProd = (done) => {
	isProd = true;
	done();
};

const watchFiles = () => {
	browserSync.init({
		server: {
			baseDir: `${buildFolder}`,
		},
		notify: false,
	});

	watch(paths.watch.css, styles);
	watch(paths.watch.html, htmlRigger);
	watch(paths.watch.images, images);
	watch(paths.watch.images, webpImages);
	watch(paths.watch.js, scripts);
	watch(paths.watch.iconsMono, spritesMono);
	watch(paths.watch.iconsMulti, spritesMulti);
};
exports.default = series(
	clean,
	htmlRigger,
	scripts,
	styles,
	resources,
	images,
	//webpImages,
	fonts,
	spritesMono,
	spritesMulti,
	watchFiles
);

exports.backend = series(
	clean,
	htmlRigger,
	scriptsBackend,
	stylesBackend,
	resources,
	images,
	webpImages,
	fonts,
	spritesMono,
	spritesMulti
);

exports.build = series(
	toProd,
	clean,
	htmlRigger,
	scripts,
	styles,
	resources,
	images,
	webpImages,
	fonts,
	spritesMono,
	spritesMulti,
	watchFiles
);

exports.zip = zipFiles;
