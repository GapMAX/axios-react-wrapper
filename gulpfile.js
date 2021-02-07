const babel = require("gulp-babel");
const {
  src,
  dest,
  series
} = require("gulp");
const clean = require("gulp-clean");
const terser = require("gulp-terser");

function defaultTask (){
  return src("./src/**/*.tsx")
    .pipe(babel({
      presets : ["@babel/env"],
      plugins : ["@babel/plugin-transform-modules-umd"]
    }))
    .pipe(terser())
    .pipe(dest(
      "./lib"
    ))
}

function cleanLibDirectory(){
  return src("./lib", {

  }).pipe(clean());
}

exports.default = series(cleanLibDirectory, defaultTask);