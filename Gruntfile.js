module.exports = function(grunt) {
    require('time-grunt')(grunt);

    let config = require('./credentials.json');
    let currentdate = new Date();

    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-file-append');
    grunt.loadNpmTasks('grunt-rsync');

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
                        return dest + src.replace(/\//g, '.');
                    }
                }],
            }
        },
        rsync: {
            options: {
                args: ["--verbose", "--checksum"],
                exclude: [".git*"],
                recursive: true
            },
            private: {
                options: {
                    src: './dist/',
                    dest: config.private_directory,
                }
            },
			simulation: {
				options: {
					src: './dist/',
					dest: config.simulation_directory,
				}
			},
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
    grunt.registerTask('private', ['clean', 'copy:screeps', 'file_append:versioning', 'rsync:private']);
    grunt.registerTask('simulation', ['clean', 'copy:screeps', 'file_append:versioning', 'rsync:simulation']);


	simulation_directory
}
