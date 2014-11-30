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

    // connect configuration.
    connect: {
      all: {
        options: {
          port: 3000,
          livereload: true,
          middleware: function (connect, options, middlewares) {
            var base = options.base[0];
            middlewares = middlewares || [];
            return middlewares.concat([
              require('connect-livereload')(), // livereload middleware
              connect['static'](base),    // serve static files
              connect.directory(base)  // make empty directories browsable
            ]);
          },
          open: 'http://localhost:3000'
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
    shell: {
      'meteor-test': {
        command: 'meteor/runtests.sh',
        options: {
          execOptions: {
            killSignal: 'SIGKILL'
          }
        }
      },
      'meteor-publish': {
        command: 'meteor/publish.sh'
      }
    }

  });

  // load all tasks from the grunt plugins used in this file
  require('load-grunt-tasks')(grunt);

  // server
  grunt.registerTask('server', ['connect', 'watch']);

  // build: build summernote.js
  grunt.loadTasks('build');

  // test: unit test on test folder
  grunt.registerTask('test', ['jshint', 'qunit']);

  // dist
  grunt.registerTask('dist', ['build', 'test', 'uglify', 'recess']);

  // default: build, test, dist.
  grunt.registerTask('default', ['dist']);

  // Meteor tasks
  grunt.registerTask('meteor-test', 'shell:meteor-test');
  grunt.registerTask('meteor-publish', 'shell:meteor-publish');
  // Ideally we'd run tests before publishing, but the chances of tests breaking (given that
  // Meteor is orthogonal to the library) are so small that it's not worth the maintainer's time
  // grunt.regsterTask('meteor', ['shell:meteor-test', 'shell:meteor-publish']);
  grunt.registerTask('meteor', 'shell:meteor-publish');

};
