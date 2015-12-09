module.exports = function (grunt) {
  'use strict';

  /**
   * read optional JSON from filepath
   * @param {String} filepath
   * @return {Object}
   */
  var readOptionalJSON = function (filepath) {
    var data = {};
    try {
      data = grunt.file.readJSON(filepath);
      // The concatenated file won't pass onevar
      // But our modules can
      delete data.onever;
    } catch (e) { }
    return data;
  };

  grunt.initConfig({
    // package File
    pkg: grunt.file.readJSON('package.json'),

    // bulid source(grunt-build.js).
    build: {
      all: {
        baseUrl: 'src/js',        // base url
        startFile: 'intro.js',    // intro part
        endFile: 'outro.js',      // outro part
        outFile: 'dist/summernote.js' // out file
      }
    },

    // for javascript convention.
    jshint: {
      all: {
        src: [
          'src/**/*.js',
          'plugin/**/*.js',
          'lang/**/*.js',
          'Gruntfile.js',
          'test/**/*.js',
          '!test/coverage/**/*.js',
          'build/*.js'
        ],
        options: {
          jshintrc: true
        }
      },
      dist: {
        src: 'dist/summernote.js',
        options: readOptionalJSON('.jshintrc')
      }
    },

    // qunit: javascript unit test.
    qunit: {
      all: [ 'test/*.html' ]
    },

    // uglify: minify javascript
    uglify: {
      options: {
        banner: '/*! Summernote v<%=pkg.version%> | (c) 2013-2015 Alan Hong and other contributors | MIT license */\n'
      },
      all: {
        files: { 'dist/summernote.min.js': ['dist/summernote.js'] }
      }
    },

    // recess: minify stylesheets
    recess: {
      dist: {
        options: { compile: true, compress: true },
        files: {
          'dist/summernote.css': ['src/less/summernote.less']
        }
      }
    },

    // compress: summernote-{{version}}-dist.zip
    compress: {
      main: {
        options: {
          archive: function () {
            return 'dist/summernote-{{version}}-dist.zip'.replace(
              '{{version}}',
              grunt.config('pkg.version')
            );
          }
        },
        files: [{
          expand: true,
          src: [
            'dist/*.js',
            'dist/*.css'
          ]
        }, {
          src: ['plugin/**/*.js', 'lang/**/*.js'],
          dest: 'dist/'
        }]
      }
    },

    // connect configuration.
    connect: {
      all: {
        options: {
          port: 3000
        }
      }
    },

    // watch source code change
    watch: {
      all: {
        files: ['src/less/*.less', 'src/js/**/*.js'],
        tasks: ['recess', 'jshint', 'qunit'],
        options: {
          livereload: true
        }
      }
    },

    // Meteor commands to test and publish package
    exec: {
      'meteor-test': {
        command: 'meteor/runtests.sh'
      },
      'meteor-publish': {
        command: 'meteor/publish.sh'
      }
    },

    'saucelabs-qunit': {
      'all': {
        options: {
          urls: ['http://localhost:3000/test/unit.html'],
          build: process.env.TRAVIS_BUILD_NUMBER,
          tags: [process.env.TRAVIS_BRANCH, process.env.TRAVIS_PULL_REQUEST],
          browsers: [{
            browserName: 'internet explorer',
            version: '8.0',
            platform: 'windows XP'
          }, {
            browserName: 'internet explorer',
            version: '9.0',
            platform: 'windows 7'
          }, {
            browserName: 'internet explorer',
            version: '10.0',
            platform: 'windows 8'
          }, {
            browserName: 'internet explorer',
            version: '11.0',
            platform: 'windows 8.1'
          }, {
            browserName: 'chrome',
            version: '43',
            platform: 'windows 8'
          }, {
            browserName: 'firefox',
            version: '38',
            platform: 'windows 8'
          }, {
            browserName: 'safari',
            version: '8.0',
            platform: 'OS X 10.10'
          }],
          testname: 'unit test for summernote',
          'public': 'public'
        }
      }
    },

    karma: {
      options: {
        configFile: './test/karma.conf.js'
      },
      travis: {
        singleRun: true,
        browsers: ['PhantomJS'],
        reporters: ['progress', 'coverage']
      }
    },

    coveralls: {
      options: {
        force: false
      },
      travis: {
        src: 'test/coverage/**/lcov.info'
      }
    }
  });

  // load all tasks from the grunt plugins used in this file
  require('load-grunt-tasks')(grunt);

  // load all grunts/*.js
  grunt.loadTasks('grunts');

  // server: runt server for development
  grunt.registerTask('server', ['connect', 'watch']);

  // test: unit test on test folder
  grunt.registerTask('test', ['jshint', 'qunit']);

  // test: saucelabs test
  grunt.registerTask('saucelabs-test', ['connect', 'saucelabs-qunit']);

  // dist: make dist files
  grunt.registerTask('dist', ['build', 'test', 'uglify', 'recess', 'compress']);

  // default: server
  grunt.registerTask('default', ['server']);

  // Meteor tasks
  grunt.registerTask('meteor-test', 'exec:meteor-test');
  grunt.registerTask('meteor-publish', 'exec:meteor-publish');
  grunt.registerTask('meteor', ['meteor-test', 'meteor-publish']);

};
