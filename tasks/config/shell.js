module.exports = function(grunt) {
  grunt.config.set('shell', {
    typescript: {
      command: "npm run ts"
    }
  });

  grunt.loadNpmTasks('grunt-shell');
};