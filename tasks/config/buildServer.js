module.exports = function (grunt) {
  grunt.registerTask('bs', [
    'tsconfig:main',
    'shell:typescript'
  ]);
};