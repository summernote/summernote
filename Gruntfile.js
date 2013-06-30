module.exports = function(grunt) {
  grunt.initConfig({
    qunit: { all: [ 'test/*.html' ] },
    uglify: {
      my_target: {
        files: { 'build/summernote.min.js': ['summernote.js'] }
      }
    },
    less: {
      production: {
        files: {"build/summernote.css": "summernote.less"}
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('test', 'qunit');
  grunt.registerTask('build', ['uglify', 'less']);
  grunt.registerTask('default', ['qunit', 'uglify', 'less']);
};
