// package metadata file for Meteor.js

var packageName = 'summernote:summernote';  // http://atmospherejs.com/summernote:summernote
var where = 'client';  // where to install: 'client', 'server', or ['client', 'server']

var packageJson = JSON.parse(Npm.require("fs").readFileSync('package.json'));

Package.describe({
  name: packageName,
  summary: 'summernote (official): jQuery+Bootstrap+FontAwesome WYSIWYG editor with embedded images support',
  version: packageJson.version,
  git: 'https://github.com/HackerWins/summernote.git'
});

Package.onUse(function (api) {
  api.versionsFrom('0.9.0');
  api.use('jquery@1.0.1', where);
  api.use('mizzao:bootstrap-3@3.3.1', where);
  api.use('fortawesome:fontawesome@4.2.0', where);
  // no exports - summernote adds itself to jQuery
  api.addFiles([
    'dist/summernote.js',
    'dist/summernote.css'
  ], where
  );
});

Package.onTest(function (api) {
  api.use(packageName, where);
  api.use('tinytest', where);

  api.addFiles('meteor/test.js', where);
});
