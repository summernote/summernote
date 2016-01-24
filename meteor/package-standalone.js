// package metadata file for Meteor.js
'use strict';

var packageName = 'summernote:standalone';  // http://atmospherejs.com/summernote:standalone
var where = 'client';  // where to install: 'client' or 'server'. For both, pass nothing.

var packageJson = JSON.parse(Npm.require("fs").readFileSync('package.json'));

Package.describe({
  name: packageName,
  summary: 'summernote standalone (official): WYSIWYG editor with embedded images support, packaged without deps',
  version: packageJson.version,
  git: 'https://github.com/summernote/summernote.git'
});

Package.onUse(function (api) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']);
  // no exports - summernote adds itself to jQuery
  api.addFiles([
    'dist/summernote.js',
    'dist/summernote.css'
  ], where);
});

Package.onTest(function (api) {
  // load dependencies for test only, before loading the package
  api.use(['twbs:bootstrap@3.3.1'], where);

  // load our package
  api.use(packageName, where);

  // load the test runner
  api.use('tinytest', where);

  api.addFiles('meteor/test.js', where);
});
