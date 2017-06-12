var gulp = require('gulp');
// var yarn = require("gulp-yarn");
//var exec = require('gulp-exec');
var exec = require("child_process").exec;

var path = {
	src: [ './src/*.coffee', "./src/*/*.coffee"  ]

}

var jspath = {
	src: [
		"./src/**/*.js",
		"./src/**/*.jsx",
		"./src/**/*.scss",
		"./src/**/*.sass",
		"./src/**/*.css",
		"./src/**/*.html",
		"./build/**/*.js"
	]
}
var distpath = ["./dist/*.js", "./dist/*.css", "./dist/images/*"];

var development_dist = "../app/assets/javascripts/dist/";
var index_dist = "../app/views/home/";
var public_path = "../public/";
var reportOptions = {
  	err: true, // default = true, false means don't write err
  	stderr: true, // default = true, false means don't write stderr
  	stdout: true // default = true, false means don't write stdout
}

gulp.task('default', ["yarn"]);


gulp.task("yarn", function(cb){
  return exec("yarn dev", function(err, stdout, stderr){
    console.log(stdout);
    console.log(stderr);
    cb(err);
    exec("rm -f ../public/*.js", function(){
      gulp.src("./dist/*").pipe(gulp.dest(public_path));
      gulp.src("./dist/**/*").pipe(gulp.dest(public_path));
    });
  });
});

gulp.task("copy", function(){
  exec("rm -f ../public/*.js", function(){
    gulp.src("./dist/*").pipe(gulp.dest(public_path));
    gulp.src("./dist/**/*").pipe(gulp.dest(public_path));
  });
});

gulp.task("delete_js", function(){
  console.log("delete");
  return ;
});


gulp.task("watch", function(cb){
  gulp.watch(distpath, ["copy"]);
});
