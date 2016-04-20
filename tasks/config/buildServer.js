module.exports = function (grunt) {
  grunt.registerTask('build-server', [
    'tsconfig:main',
    'shell:typescript'
  ]);
};