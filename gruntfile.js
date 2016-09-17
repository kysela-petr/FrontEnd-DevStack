module.exports = function(grunt) {
    'use strict';

    require('time-grunt')(grunt);

    // definice závislostí použitých v projektu,
    // je blbost importovat celý bootstrap.min.js
    var devStackOptions = {
        vendorsJS: [
            'bower_components/jquery/dist/jquery.min.js',
            //  'bower_components/bootstrap/js/transition.js',
            //  'bower_components/bootstrap/js/alert.js',
            //  'bower_components/bootstrap/js/button.js',
            //  'bower_components/bootstrap/js/carousel.js',
            //  'bower_components/bootstrap/js/collapse.js',
            //  'bower_components/bootstrap/js/dropdown.js',
            //  'bower_components/bootstrap/js/modal.js',
            //  'bower_components/bootstrap/js/tooltip.js',
            //  'bower_components/bootstrap/js/popover.js',
            //  'bower_components/bootstrap/js/scrollspy.js',
            //  'bower_components/bootstrap/js/tab.js',
            //  'bower_components/bootstrap/js/affix.js'
        ]
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // spojení souborů pro méně http requestů
        // rozděleno dle typu a pro větší rychlost tasků
        concat: {
            options: {
                stripBanners: true,
            },
            vendors: {
                src: devStackOptions.vendorsJS,
                dest: 'www/dist/js/vendors.js'
            },
            application: {
                src: ['www/src/js/*.js', 'www/src/js/**/*.js', 'www/src/js/**/**/*.js'],
                dest: 'www/dist/js/main.js'
            },
            script: {
                src: ['www/dist/js/vendors.js', 'www/dist/js/main.js'],
                dest: 'www/dist/js/main.js'
            },
            style: {
                src: 'www/dist/style/*.css',
                dest: 'www/dist/style/main.css'
            }
        },

        // uglifikace javascriptu
        // rozděleno do subtasků kvůli rychlosti
        uglify: {
            options: {
                report: 'gzip',
                preserveComments: false
            },
            vendors: {
                files: {
                    'www/dist/js/vendors.js': 'www/dist/js/vendors.js'
                }
            },
            application: {
                files: {
                    'www/dist/js/main.js': 'www/dist/js/main.js'
                }
            }
        },

        // nebudeš prasit JavaScript a nebudeš!
        jshint: {
            main: ['www/src/js/*.js', 'www/src/js/**/*.js', 'www/src/js/**/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // kompilace stylů bootstrapu a samotné šablony webu
        // -> rozděleno do samostatných subtasků kvůli rychlosti
        less: {
            bootstrap: {
                files: {
                    'www/dist/style/bootstrap.css': 'www/src/style/bootstrap/main.less',
                }
            },
            theme: {
                files: {
                    'www/dist/style/theme.css': 'www/src/style/theme/main.less',
                }
            }
        },

        // fallback pro rem hodnoty a
        // doplnění prefixů pro css dle caniuse.com
        postcss: {
            options: {
                processors: [
                    require('pixrem')(),
                    require('autoprefixer')({
                        browsers: ['> 4% in CZ', 'last 3 version', 'ios 6', 'ie 7', 'ie 8', 'ie 9']
                    })
                ]
            },
            bootstrap: {
                src: 'www/dist/style/bootstrap.css'
            },
            theme: {
                src: 'www/dist/style/theme.css'
            },
        },

        // minifikace stylů bootstrapu a samotné šablony webu
        // -> rozděleno do samostatných subtasků kvůli rychlosti
        cssmin: {
            bootstrap: {
                files: {
                    'www/dist/style/bootstrap.css': 'www/dist/style/bootstrap.css'
                }
            },
            theme: {
                files: {
                    'www/dist/style/theme.css': 'www/dist/style/theme.css'
                }
            }
        },

        // zkopírování bower komponent do adresáře přístupného přes url
        copy: {
            lte: {
                src: 'bower_components/lt-ie-9/lt-ie-9.min.js',
                dest: 'www/dist/js/lt-ie-9.min.js'
            },
            font_awesome_style: {
                src: 'bower_components/font-awesome/css/font-awesome.min.css',
                dest: 'www/dist/style/font-awesome.min.css'
            },
            font_awesome_font: {
                filter: 'isFile',
                flatten: true,
                expand: true,
                src: 'bower_components/font-awesome/fonts/*',
                dest: 'www/dist/font/'
            }
        },

        // nahradit adresu k font awesome, jinak vyhazuje 404
        replace: {
            dist: {
                options: {
                    patterns: [{
                        match: '../fonts/',
                        replacement: '../../dist/font/'
                    }],
                    usePrefix: false
                },
                files: [{
                    expand: false,
                    flatten: true,
                    src: 'www/dist/style/font-awesome.min.css',
                    dest: 'www/dist/style/font-awesome.min.css'
                }]
            }
        },

        // mazání vygenerovaných souborů před novým generováním
        clean: {
            bootstrap: ['www/dist/style/bootstrap.css', 'www/dist/style/main.css'],
            theme: ['www/dist/style/theme.css', 'www/dist/style/main.css'],
            style: 'www/dist/style/*.css',
            scriptApp: 'www/dist/js/main.js',
            script: 'www/dist/js/*.js'
        },

        // minifikace obrázků a grafiky webu,
        // na png je ještě lepší tinypng.com
        // ale lepší něco než-li ni
        image: {
            image_folder: {
                options: {
                    pngquant: true,
                    optipng: true,
                    zopflipng: true,
                    advpng: true,
                    jpegRecompress: true,
                    jpegoptim: true,
                    mozjpeg: true,
                    gifsicle: true,
                    svgo: true
                },
                files: [{
                    expand: true,
                    cwd: 'www/src/image/',
                    src: ['*.{png,jpg,gif,svg}'],
                    dest: 'www/dist/image/'
                }]
            },
        },

        // watch task pro styly, js, šablony i gruntfile
        watch: {
            style_bootstrap: {
                files: 'www/src/style/bootstrap/*.less',
                tasks: ['clean:bootstrap', 'less:bootstrap', 'concat:style']
            },
            style_theme: {
                files: ['www/src/style/theme/*.less', 'www/src/style/theme/**/*.less'],
                tasks: ['clean:theme', 'less:theme', 'concat:style']
            },
            script: {
                files: ['www/src/js/*.js', 'www/src/js/**/*.js'],
                tasks: ['clean:scriptApp', 'jshint', 'concat:application', 'concat:script']
            },
            template: {
                files: ['www/_templates/*.html', 'www/_templates/**/*.html'],
                tasks: []
            },
            image: {
                files: 'www/src/image/*',
                tasks: ['image']
            },
            grunt: {
                files: ['Gruntfile.js']
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: ['www/*', 'www/**/*', 'www/**/**/*']
                },
                options: {
                    watchTask: true,
                    server: "./www/"
                }
            }
        }
    });

    require('jit-grunt')(grunt, {
        concat: 'grunt-contrib-concat'
    });

    // vývojové prostředí "grunt default"
    grunt.registerTask('default', ['clean', 'copy', 'replace', 'concat:vendors', 'jshint', 'concat:application', 'concat:script', 'image', 'less', 'concat:style', 'browserSync', 'watch']);
    // produkční prostředí -> vygenerování minifikovaných souborů pro commit "grunt build"
    grunt.registerTask('build', ['clean', 'copy', 'replace', 'concat:vendors', 'jshint', 'concat:application', 'concat:script', 'image', 'less', 'postcss', 'cssmin', 'concat:style', 'uglify']);
};
