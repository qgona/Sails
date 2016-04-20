module.exports = function(grunt) {
  grunt.config.set('tsconfig', {
    main: {}
  });

  grunt.loadNpmTasks('grunt-tsconfig-update');
};