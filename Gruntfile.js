module.exports = function(grunt) {
  'use strict';

  var customLaunchers = {
    /*
    'SL_IE8': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '8.0',
      platform: 'windows XP'
    },
    'SL_EDGE': {
      base: 'SauceLabs',
      browserName: 'microsoftedge',
      version: 'latest',
      platform: 'windows 10'
    },
    'SL_SAFARI': {
      base: 'SauceLabs',
      browserName: 'safari',
      version: 'latest',
      platform: 'OS X 10.12'
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
    'SL_CHROME': {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'latest',
      platform: 'windows 8'
    },
    'SL_FIREFOX': {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'latest',
      platform: 'windows 8'
    }
  };

  grunt.initConfig({
    // package File
    pkg: grunt.file.readJSON('package.json'),

    // bulid source(grunt-build.js).
    build: {
      bs3: {
        input: './src/js/bs3/settings',
        output: './dist/summernote.js'
      },
      bs4: {
        input: './src/js/bs4/settings',
        output: './dist/summernote-bs4.js'
      },
      lite: {
        input: './src/js/lite/settings',
        output: './dist/summernote-lite.js'
      }
    },

    // for javascript convention.
    eslint: {
      target: [
        'src/**/*.js',
        'plugin/**/*.js',
        'lang/**/*.js',
        'Gruntfile.js',
        'test/**/*.js',
        '!coverage/**/*.js',
        '!test/coverage/**/*.js',
        'build/*.js'
      ]
    },

    // uglify: minify javascript
    uglify: {
      options: {
        banner: '/*! Summernote v<%=pkg.version%> | (c) 2013- Alan Hong and other contributors | MIT license */\n'
      },
      all: {
        files: [
          { 'dist/summernote.min.js': ['dist/summernote.js'] },
          { 'dist/summernote-bs4.min.js': ['dist/summernote-bs4.js'] },
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
            'dist/summernote.css': ['src/less/summernote.less'],
            'dist/summernote-bs4.css': ['src/less/summernote-bs4.less'],
            'dist/summernote-lite.css': ['src/less/summernote-lite.less']

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
          archive: function() {
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
      less: {
        files: ['src/less/*.less'],
        tasks: ['recess'],
        options: {
          livereload: true
        }
      },
      script: {
        files: ['src/js/**/*.js', 'test/unit/**/*.js'],
        tasks: ['lint', 'build', 'karma:all'],
        options: {
          livereload: true
        }
      }
    },

    karma: {
      options: {
        configFile: './karma.conf.js'
      },
      watch: {
        background: false,
        singleRun: false
      },
      all: {
        // Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS, IE
        singleRun: true,
        browsers: ['PhantomJS']
      },
      dist: {
        singleRun: true,
        browsers: ['PhantomJS']
      },
      travis: {
        singleRun: true,
        browsers: ['PhantomJS'],
        reporters: ['dots', 'coverage']
      },
      saucelabs: {
        reporters: ['saucelabs'],
        sauceLabs: {
          testName: 'unit tests for summernote',
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
        src: 'coverage/**/lcov.info'
      }
    },
    clean: {
      dist: ['dist/**/*']
    },
    copy: {
      dist: {
        files: [
          { src: 'lang/*', dest: 'dist/' },
          { expand: true, cwd: 'src/icons/dist/font/', src: ['**', '!*.html'], dest: 'dist/font/' }
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
          relativeFontPath: './font/',
          stylesheet: 'less',
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
  grunt.registerTask('lint', ['eslint']);

  // test: unit test on test folder
  grunt.registerTask('test', ['lint', 'karma:watch']);

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
};
