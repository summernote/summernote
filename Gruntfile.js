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
    pkg: grunt.file.readJSON('package.json'),
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
    },
    watch: {
      css: {
        files: 'src/less/*.less',
        tasks: ['recess'],
        options: { livereload: true }
      },
      scripts: {
        files: 'src/js/**/*.js',
        tasks: ['build'],
        options: { livereload: true }
      }
    },
    connect: {
      all: {
        options: {
          port: 3000,
          keepalive: true,
          open: 'http://localhost:3000/examples/',
          options: { livereload: true }
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

  // grunt: connect
  grunt.registerTask('server', ['connect', 'watch']);

  // loaded npm module
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
};