module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    // package File
    pkg: grunt.file.readJSON('package.json'),

    // bulid source(grunt-build.js).
    build: {
      bs3: {
        input: './src/js/bs3/settings',
        output: './dist/summernote.js',
      },
      bs4: {
        input: './src/js/bs4/settings',
        output: './dist/summernote-bs4.js',
      },
      lite: {
        input: './src/js/lite/settings',
        output: './dist/summernote-lite.js',
      },
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
        'build/*.js',
      ],
    },

    // uglify: minify javascript
    uglify: {
      options: {
        banner: '/*! Summernote v<%=pkg.version%> | (c) 2013- Alan Hong and other contributors | MIT license */\n',
      },
      all: {
        files: [
          { 'dist/summernote.min.js': ['dist/summernote.js'] },
          { 'dist/summernote-bs4.min.js': ['dist/summernote-bs4.js'] },
          { 'dist/summernote-lite.min.js': ['dist/summernote-lite.js'] },
          {
            expand: true,
            cwd: 'dist/lang',
            src: '**/*.js',
            dest: 'dist/lang',
            ext: '.min.js',
          },
          {
            expand: true,
            cwd: 'dist/plugin',
            src: '**/*.js',
            dest: 'dist/plugin',
            ext: '.min.js',
          },
        ],
      },
    },

    // recess: minify stylesheets
    recess: {
      dist: {
        options: { compile: true, compress: true },
        files: [
          {
            'dist/summernote.css': ['src/less/summernote.less'],
            'dist/summernote-bs4.css': ['src/less/summernote-bs4.less'],
            'dist/summernote-lite.css': ['src/less/summernote-lite.less'],

          },
          {
            expand: true,
            cwd: 'dist/plugin',
            src: '**/*.css',
            dest: 'dist/plugin',
            ext: '.min.css',
          },
        ],
      },
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
          },
        },
        files: [{
          expand: true,
          src: [
            'dist/*.js',
            'dist/*.css',
            'dist/font/*',
          ],
        }, {
          src: ['plugin/**/*.js', 'plugin/**/*.css', 'lang/**/*.js'],
          dest: 'dist/',
        }],
      },
    },

    // connect configuration.
    connect: {
      all: {
        options: {
          port: 3000,
        },
      },
    },

    // watch source code change
    watch: {
      less: {
        files: ['src/less/*.less'],
        tasks: ['recess'],
        options: {
          livereload: true,
        },
      },
      script: {
        files: ['src/js/**/*.js', 'test/unit/**/*.js'],
        tasks: ['lint', 'build'],
        options: {
          livereload: true,
        },
      },
    },

    coveralls: {
      options: {
        force: false,
      },
      travis: {
        src: 'coverage/**/lcov.info',
      },
    },

    clean: {
      dist: ['dist/**/*'],
    },

    copy: {
      dist: {
        files: [
          { src: 'lang/*', dest: 'dist/' },
          { expand: true, cwd: 'src/icons/dist/font/', src: ['**', '!*.html'], dest: 'dist/font/' },
        ],
      },
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
          template: 'src/icons/templates/summernote.css',
        },
      },
    },
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
  grunt.registerTask('test', ['lint']);

  // dist: make dist files
  grunt.registerTask('dist', [
    'clean:dist',
    'build', 'webfont', 'lint',
    'copy:dist', 'uglify', 'recess', 'compress',
  ]);

  // default: server
  grunt.registerTask('default', ['server']);
};
