module.exports = function(grunt) {
    var config = {
        pkg: grunt.file.readJSON('package.json'),
        browserify:     {
            options:      {
                transform:  [ require('brfs') ],
                browserifyOptions: {
                    basedir: "frontend/src/js/"
                }
            },

            kdgt: {
                src:        'frontend/src/main.js',
                dest:       'frontend/www/assets/js/main.js'
            }
        }
    };

    var watchDebug = {
        options: {
            'no-beep': true
        },
        scripts: {
            files: ['frontend/src/**/*.js', 'frontend/views/*.ejs', 'frontend/views/templates/*.ejs'],
            tasks: ['browserify:kdgt']
        }
    };

    config.watch = watchDebug;
    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default',
        [
            'browserify:kdgt',
        ]
    );

};