var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var fileinclude = require('gulp-file-include');
var htmlreplace = require('gulp-html-replace');
var watch = require('gulp-watch');
var minifyCss = require('gulp-minify-css');

var baseCore = [

];

var JS = {
	core : baseCore.concat([

	]),
	core_min : 'core.min.js',
	css_min : 'style.min.css'
};

var v = new Date().getTime();
var HtmlReplace = {
	js_core : '../../js/dist/'+JS.core_min+'?v='+v,
	css : '../../style/'+JS.css_min+'?v='+v,

	site_core : '../../js/dist/'+JS.site_min+'?v='+v,
	site_css : '../../style/'+JS.site_css_min+'?v='+v
};

var F = {
	each : function(list, callback){
		for(var i= 0,len=list.length; i<len; i++){
			(function(i){
				callback(list[i], i, len);
			})(i);

		}
	},
	devHtmlByDir : function(){
		gulp.src(['./dev/*.html'])
			.pipe(fileinclude({
				prefix: '@@'
			})).pipe(gulp.dest('./build'));
	},
	devWatchHtmlByDir : function(){
		gulp.watch('./dev/*.html', function(param){
			console.log(JSON.stringify(param));

			var path = param.path;
			if(!path) throw 'no path -->'+param.type;

			gulp.src(path)
				.pipe(fileinclude({
					prefix: '@@'
				})).pipe(gulp.dest('./build'));
		});
	},
	pubHtmlByDir : function(){
		gulp.src(['./dev/*.html'])
			.pipe(fileinclude({
				prefix: '@@'
			}))
			.pipe(htmlreplace(HtmlReplace))
			.pipe(gulp.dest('./page'));
	}
};

gulp.task('core', function(){
	gulp.src(JS.core)
		.pipe(uglify())
		.pipe(concat(JS.core_min))
		.pipe(gulp.dest('./js/dist'));

	gulp.src(JS.site_core)
		.pipe(uglify())
		.pipe(concat(JS.site_min))
		.pipe(gulp.dest('./js/dist'));
});
gulp.task('css', function(){
	gulp.src(['style/style.css'])
		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(concat(JS.css_min))
		.pipe(gulp.dest('style/'));

	gulp.src(['style/site.css'])
		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(concat(JS.site_css_min))
		.pipe(gulp.dest('style/'));
});


gulp.task('html_dev', function(){

	F.devHtmlByDir();
});

gulp.task('htmltest', function(){
	F.pubHtmlByDir();

});

gulp.task('watch_dev', function(){
	F.devWatchHtmlByDir();

	gulp.watch('./inc/*', function(){
		F.devHtmlByDir();
	});
});


gulp.task('dev', ['html_dev', 'watch_dev']);

gulp.task('pub', ['core', 'css', 'htmltest']);