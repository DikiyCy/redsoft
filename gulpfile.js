'use strict';

let projectFolder = "dist";
let sourceFolder = "src";

const fs = require('fs');

let path = {
    build: {
        html: projectFolder + "/",
        css: projectFolder + "/css/",
        js: projectFolder + "/js/",
        img: projectFolder + "/img/",
        fonts: projectFolder + "/fonts/",
    },
    src: {
        html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
        css: sourceFolder + "/scss/style.scss",
        js: sourceFolder + "/js/script.js",
        img: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: sourceFolder + "/fonts/*.ttf",
    },
    watch: {
        html: sourceFolder + "/**/*.html",
        css: sourceFolder + "/scss/**/*.scss",
        js: sourceFolder + "/js/**/*.js",
        img: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
    },
    clean: "./" + projectFolder + "/",
};

const { src, dest } = require('gulp');
const gulp = require('gulp');
const browserSyncVar = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const del = require('del');
const scss = require('gulp-sass');
const autopreficser = require('gulp-autoprefixer');
const groupMedia = require('gulp-group-css-media-queries');
const cssClean = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fonter = require('gulp-fonter');
const htmlMin = require('gulp-htmlmin');

const browserSyncFunc = () => {
    browserSyncVar.init({
        server: {
            baseDir: "./" + projectFolder + "/"
        },
        port: 3000,
        host: "192.168.1.198",
        notify: false
    })
};

const htmlFunc = () => {
    return src(path.src.html)
            .pipe(fileInclude())
            .pipe(htmlMin({ collapseWhitespace: true }))
            .pipe(dest(path.build.html))
            .pipe(browserSyncVar.stream())
};

const cssFunc = () => {
    return src(path.src.css)
        .pipe (
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(groupMedia())
        .pipe(
            autopreficser({
                // overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(cssClean())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browserSyncVar.stream())
};

const jsFunc = () => {
    return src(path.src.js)
            .pipe(fileInclude())
            .pipe(dest(path.build.js))
            .pipe(uglify())
            .pipe(
                rename({
                    extname: ".min.js"
                })
            )
            .pipe(dest(path.build.js))
            .pipe(browserSyncVar.stream())
};

const imgFunc = () => {
    return src(path.src.img)
        .pipe(dest(path.build.img))
        .pipe(src((path.src.img)))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugin: [{ removeViewBox: false }],
                interlaced: true,
                optimisationLevel: 3
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browserSyncVar.stream())
};

const fontsFunc = () => {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
};

const fontsStyle = () => {
    let file_content = fs.readFileSync(sourceFolder + '/scss/fonts.scss');
    if (file_content == '') {
        fs.writeFile(sourceFolder + '/scss/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(sourceFolder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
};

function cb() {
};

gulp.task('fonter', () => {
    return src([sourceFolder + '/fonts/*.otf'])
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest(sourceFolder + "/fonts/"));
});

const watchFiles = () => {
    gulp.watch([path.watch.html], htmlFunc);
    gulp.watch([path.watch.css], cssFunc);
    gulp.watch([path.watch.js], jsFunc);
    gulp.watch([path.watch.img], imgFunc);
};

const clear = () => {
    return del(path.clean);
}

let build = gulp.series(clear, gulp.parallel(jsFunc, cssFunc, htmlFunc, imgFunc, fontsFunc), fontsStyle);
let watch = gulp.parallel(build, browserSyncFunc, watchFiles);

exports.fontsStyle = fontsStyle;
exports.fontsFunc = fontsFunc;
exports.imgFunc = imgFunc;
exports.jsFunc = jsFunc;
exports.cssFunc = cssFunc;
exports.htmlFunc = htmlFunc;
exports.build = build;
exports.watch = watch;
exports.default = watch;
