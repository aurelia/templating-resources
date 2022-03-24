var gulp = require('gulp');
var paths = require('./paths');
// var fs = require('fs');
var bump = require('gulp-bump');
var args = require('./args');
var conventionalChangelog = require('gulp-conventional-changelog');

gulp.task('changelog', function () {
  return gulp
    .src(paths.doc + '/CHANGELOG.md', {
      buffer: false
    })
    .pipe(conventionalChangelog({
      preset: 'angular'
    }))
    .pipe(gulp.dest(paths.doc));
});

gulp.task('bump-version', function() {
  return gulp.src(['./package.json', './bower.json'])
    // major|minor|patch|prerelease
    // default is patch
    .pipe(bump({ type:args.bump }))
    .pipe(gulp.dest('./'));
});

gulp.task('prepare-release', gulp.series(
    // 'build',
    // 'lint',
    'bump-version',
    // 'doc',
    'changelog',
  )
);
