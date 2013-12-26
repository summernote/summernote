module.exports = function (grunt) {
  'use strict';

  var readOptionalJSON = function (filepath) {
    var data = {};
    try {
      data = grunt.file.readJSON(filepath);
    } catch (e) { }
    return data;
  };
  var srcHintOptions = readOptionalJSON('.jshintrc');

  // The concatenated file won't pass onevar
  // But our modules can
  delete srcHintOptions.onevar;

  grunt.initConfig({
    build: {
      all: {
        baseUrl: 'src/js',
        startFile: 'intro.js',
        endFile: 'outro.js',
        out: 'dist/summernote.js'
      }
    },
    jshint: {
      all: {
        src: [
          'src/**/*.js', 'Gruntfile.js', 'test/**/*.js', 'build/*.js'
        ],
        options: {
          jshintrc: true
        }
      },
      dist: {
        src: 'dist/summernote.js',
        options: srcHintOptions
      }
    },
    qunit: {
      all: [ 'test/*.html' ]
    },
    uglify: {
      all: {
        files: { 'dist/summernote.min.js': ['dist/summernote.js'] }
      }
    },
    recess: {
      dist: {
        options: { compile: true, compress: true },
        files: {
          'dist/summernote.css': ['src/less/summernote.less']
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  // build: build summernote.js
  grunt.loadTasks('build');

  // test: unit test on test folder
  grunt.registerTask('test', ['jshint', 'qunit']);

  // dev: build, jshint, test
  grunt.registerTask('dev', ['build', 'test']);

  // dist: 
  grunt.registerTask('dist', ['dev', 'uglify', 'recess']);

  // default: All tasks
  grunt.registerTask('default', ['dist']);
};
