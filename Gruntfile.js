module.exports = function(grunt) {
  grunt.initConfig({
    qunit: { all: [ 'test/*.html' ] },
    uglify: {
      my_target: {
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
    build: {
      all: {
        baseUrl: 'src/js',
        startFile: 'intro.js',
        endFile: 'outro.js',
        out: 'dist/summernote.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-recess');

  // build: build summernote.js
  grunt.loadTasks('build');

  // test: unit test on test folder
  grunt.registerTask('test', 'qunit');

  // dist:
  grunt.registerTask('dist', ['uglify', 'recess']);

  // default: All tasks
  grunt.registerTask('default', ['qunit', 'uglify', 'recess']);
};
