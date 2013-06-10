module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    qunit: {
      all: [ 'test/*.html' ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-qunit');

  // Default task(s).
  grunt.registerTask('default', 'qunit');
};
