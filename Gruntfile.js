module.exports = function(grunt) {
  var config = require('./credentials.json')
  var currentdate = new Date();

  grunt.loadNpmTasks('grunt-screeps');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-file-append');

  grunt.initConfig({
    clean: {
      'dist': ['dist']
    },
    file_append: {
      versioning: {
        files: [{
          append: "\nglobal.SCRIPT_VERSION = " + currentdate.getTime() + "\n",
          input: 'dist/version.js',
        }]
      }
    },
    copy: {
      screeps: {
        files: [{
          expand: true,
          cwd: 'src',
          src: '**',
          dest: 'dist/',
          filter: 'isFile',
          rename: function(dest, src) {
            return dest + src.replace(/\//g, '_');
          }
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

  grunt.registerTask('deploy', ['clean', 'copy:screeps', 'file_append:versioning', 'screeps']);

}
