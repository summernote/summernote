module.exports = function(grunt) {
  grunt.initConfig({
    qunit: { all: [ 'test/*.html' ] },
    uglify: {
      my_target: {
        files: { 'build/summernote.min.js': ['summernote.js'] }
      }
    },
    recess: {
      dist: {
        options: { compile: true, compress: true },
        files: {
          'build/summernote.css': ['summernote.less']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-recess');

  grunt.registerTask('test', 'qunit');
  grunt.registerTask('build', ['uglify', 'recess']);
  grunt.registerTask('default', ['qunit', 'uglify', 'recess']);
};
