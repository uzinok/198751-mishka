"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var imagemin = require('gulp-imagemin');
var webp = require('gulp-webp');
var del = require('del');
var htmlmin = require('gulp-htmlmin');

gulp.task("clean", function() {
  return del("build");
});

gulp.task("copy", function() {
  return gulp.src([
      "source/fonts/*.{woff, woff2}*",
      "source/img/*.+(png|jpg|svg|webp)*",
      "source/js/**",
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("css", function() {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("sprite", function() {
  return gulp.src(["source/img/for_sprite/*.svg"])
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          },
          {
            inlineSvg: true
          }
        ]
      })
    ]))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("source/img/"));
});

gulp.task("html", function() {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("build"));
});

gulp.task("opti_img", function() {
  return gulp.src(["source/img/*.+(svg|png|jpg)"])
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ]))
    .pipe(gulp.dest("source/img/"));
});

gulp.task("webp_convert", function() {
  return gulp.src(["source/img/*.+(png|jpg)"])
    .pipe(webp({
      quality: 95
    }))
    .pipe(gulp.dest("source/img/"));
});

gulp.task("server", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch("source/*.html", gulp.series("html")).on("change", server.reload);
});

gulp.task("build", gulp.series("clean", "copy", "css", "html"));
gulp.task("start", gulp.series("build", "server"));
