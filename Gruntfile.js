module.exports = function(grunt) {
  var config = require('./credentials.json')

  grunt.loadNpmTasks('grunt-screeps');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.initConfig({
    copy: {
      main: {
        files: [{
          expand: true,
          cwd: 'src', // 'Current Working Directory'
          src: '**', // Read everything inside the cwd
          dest: 'dist/', // Destination folder
        }],
      }
    },
    screeps: {
      options: {
        email: config.email,
        password: config.password,
        branch: config.branch,
        ptr: config.ptr
      },
      dist: {
        src: ['dist/*.js']
      }
    }
  });

  grunt.registerTask('deploy', ['copy', 'screeps']);

}
