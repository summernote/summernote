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

  var customLaunchers = {
    /*
    'SL_IE8': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '8.0',
      platform: 'windows XP'
    },
    */
    'SL_IE9': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '9.0',
      platform: 'windows 7'
    },
    'SL_IE10': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '10.0',
      platform: 'windows 8'
    },
    'SL_IE11': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '11.0',
      platform: 'windows 8.1'
    },
    'SL_EDGE': {
      base: 'SauceLabs',
      browserName: 'microsoftedge',
      version: 'latest',
      platform: 'windows 10'
    },
    'SL_CHROME': {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '59',
      platform: 'windows 8'
    },
    'SL_FIREFOX': {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '54',
      platform: 'windows 8'
    },
    'SL_SAFARI': {
      base: 'SauceLabs',
      browserName: 'safari',
      version: '8.0',
      platform: 'OS X 10.10'
    }
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

    jscs: {
      src: ['*.js', 'src/**/*.js', 'test/**/*.js', 'plugin/**/*.js'],
      gruntfile: 'Gruntfile.js',
      build: 'build'
    },

    // uglify: minify javascript
    uglify: {
      options: {
        banner: '/*! Summernote v<%=pkg.version%> | (c) 2013- Alan Hong and other contributors | MIT license */\n'
      },
      all: {
        files: [
          { 'dist/summernote.min.js': ['dist/summernote.js'] },
          {
            expand: true,
            cwd: 'dist/lang',
            src: '**/*.js',
            dest: 'dist/lang',
            ext: '.min.js'
          },
          {
            expand: true,
            cwd: 'dist/plugin',
            src: '**/*.js',
            dest: 'dist/plugin',
            ext: '.min.js'
          }
        ]
      }
    },

    // recess: minify stylesheets
    recess: {
      dist: {
        options: { compile: true, compress: true },
        files: [
          {
            'dist/summernote.css': ['src/less/summernote.less']
          },
          {
            expand: true,
            cwd: 'dist/plugin',
            src: '**/*.css',
            dest: 'dist/plugin',
            ext: '.min.css'
          }
        ]
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
            'dist/*.css',
            'dist/font/*'
          ]
        }, {
          src: ['plugin/**/*.js', 'plugin/**/*.css', 'lang/**/*.js'],
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
        files: ['src/less/*.less', 'src/js/**/*.js', 'test/unit/**/*.js'],
        tasks: ['recess', 'lint'],
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

    karma: {
      options: {
        configFile: './test/karma.conf.js'
      },
      all: {
        // Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS, IE
        singleRun: true,
        browsers: ['PhantomJS'],
        reporters: ['progress']
      },
      dist: {
        singleRun: true,
        browsers: ['PhantomJS']
      },
      travis: {
        singleRun: true,
        browsers: ['PhantomJS'],
        reporters: ['progress', 'coverage']
      },
      saucelabs: {
        reporters: ['saucelabs'],
        sauceLabs: {
          testName: '[Travis] unit tests for summernote',
          startConnect: false,
          tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
          build: process.env.TRAVIS_BUILD_NUMBER,
          tags: [process.env.TRAVIS_BRANCH, process.env.TRAVIS_PULL_REQUEST]
        },
        captureTimeout: 120000,
        customLaunchers: customLaunchers,
        browsers: Object.keys(customLaunchers),
        singleRun: true
      }
    },

    coveralls: {
      options: {
        force: false
      },
      travis: {
        src: 'test/coverage/**/lcov.info'
      }
    },
    clean: {
      dist: ['dist/**/*']
    },
    copy: {
      dist: {
        files: [
          { src: 'lang/*', dest: 'dist/' },
          { src: 'plugin/**/*', dest: 'dist/' },
          { expand: true, cwd: 'src/icons/dist/font/', src: ['**', '!*.html'], dest: 'dist/font/' },
          { src: 'src/icons/dist/summernote.css', dest: 'src/icons/dist/summernote.less' }
        ]
      }
    },
    webfont: {
      icons: {
        src: 'src/icons/*.svg',
        dest: 'src/icons/dist/font',
        destCss: 'src/icons/dist/',
        options: {
          font: 'summernote',
          template: 'src/icons/templates/summernote.css'
        }
      }
    }
  });

  // load all tasks from the grunt plugins used in this file
  require('load-grunt-tasks')(grunt);

  // load all grunts/*.js
  grunt.loadTasks('grunts');

  // server: run server for development
  grunt.registerTask('server', ['connect', 'watch']);

  // lint
  grunt.registerTask('lint', ['jshint', 'jscs']);

  // test: unit test on test folder
  grunt.registerTask('test', ['lint', 'karma:all']);

  // test: unit test on travis
  grunt.registerTask('test-travis', ['lint', 'karma:travis']);

  // test: saucelabs test
  grunt.registerTask('saucelabs-test', ['karma:saucelabs']);

  // dist: make dist files
  grunt.registerTask('dist', [
    'clean:dist',
    'build', 'webfont', 'lint', 'karma:dist',
    'copy:dist', 'uglify', 'recess', 'compress'
  ]);

  // default: server
  grunt.registerTask('default', ['server']);

  // Meteor tasks
  grunt.registerTask('meteor-test', 'exec:meteor-test');
  grunt.registerTask('meteor-publish', 'exec:meteor-publish');
  grunt.registerTask('meteor', ['meteor-test', 'meteor-publish']);
};
