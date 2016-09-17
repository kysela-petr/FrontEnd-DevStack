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
                dest: 'dist/js/vendors.js'
            },
            application: {
                src: ['src/js/*.js', 'src/js/**/*.js', 'src/js/**/**/*.js'],
                dest: 'dist/js/main.js'
            },
            script: {
                src: ['dist/js/vendors.js', 'dist/js/main.js'],
                dest: 'dist/js/main.js'
            },
            style: {
                src: 'dist/style/*.css',
                dest: 'dist/style/main.css'
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
                    'dist/js/vendors.js': 'dist/js/vendors.js'
                }
            },
            application: {
                files: {
                    'dist/js/main.js': 'dist/js/main.js'
                }
            }
        },

        // nebudeš prasit JavaScript a nebudeš!
        jshint: {
            main: ['src/js/*.js', 'src/js/**/*.js', 'src/js/**/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // kompilace stylů bootstrapu a samotné šablony webu
        // -> rozděleno do samostatných subtasků kvůli rychlosti
        less: {
            bootstrap: {
                files: {
                    'dist/style/bootstrap.css': 'src/style/bootstrap/main.less',
                }
            },
            theme: {
                files: {
                    'dist/style/theme.css': 'src/style/theme/main.less',
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
                src: 'dist/style/bootstrap.css'
            },
            theme: {
                src: 'dist/style/theme.css'
            },
        },

        // minifikace stylů bootstrapu a samotné šablony webu
        // -> rozděleno do samostatných subtasků kvůli rychlosti
        cssmin: {
            bootstrap: {
                files: {
                    'dist/style/bootstrap.css': 'dist/style/bootstrap.css'
                }
            },
            theme: {
                files: {
                    'dist/style/theme.css': 'dist/style/theme.css'
                }
            }
        },

        // zkopírování bower komponent do adresáře přístupného přes url
        copy: {
            lte: {
                src: 'bower_components/lt-ie-9/lt-ie-9.min.js',
                dest: 'dist/js/lt-ie-9.min.js'
            },
            font_awesome_style: {
                src: 'bower_components/font-awesome/css/font-awesome.min.css',
                dest: 'dist/style/font-awesome.min.css'
            },
            font_awesome_font: {
                filter: 'isFile',
                flatten: true,
                expand: true,
                src: 'bower_components/font-awesome/fonts/*',
                dest: 'dist/font/'
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
                    src: 'dist/style/font-awesome.min.css',
                    dest: 'dist/style/font-awesome.min.css'
                }]
            }
        },

        // mazání vygenerovaných souborů před novým generováním
        clean: {
            bootstrap: ['dist/style/bootstrap.css', 'dist/style/main.css'],
            theme: ['dist/style/theme.css', 'dist/style/main.css'],
            style: 'dist/style/*.css',
            scriptApp: 'dist/js/main.js',
            script: 'dist/js/*.js'
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
                    cwd: 'src/image/',
                    src: ['*.{png,jpg,gif,svg}'],
                    dest: 'dist/image/'
                }]
            },
        },

        codekit: {
            compile_templates: {
                files: [{
                    expand: true,
                    cwd: 'src/templates',
                    src: ['*.kit', '**/*.kit'],
                    dest: 'dist/templates',
                    ext: '.html'
                }]
            }
        },

        // watch task pro styly, js, šablony i gruntfile
        watch: {
            style_bootstrap: {
                files: 'src/style/bootstrap/*.less',
                tasks: ['clean:bootstrap', 'less:bootstrap', 'concat:style']
            },
            style_theme: {
                files: ['src/style/theme/*.less', 'src/style/theme/**/*.less'],
                tasks: ['clean:theme', 'less:theme', 'concat:style']
            },
            script: {
                files: ['src/js/*.js', 'src/js/**/*.js'],
                tasks: ['clean:scriptApp', 'jshint', 'concat:application', 'concat:script']
            },
            template: {
                files: ['src/templates/*.kit', 'src/templates/**/*.kit'],
                tasks: ['codekit']
            },
            image: {
                files: 'src/image/*',
                tasks: ['image']
            },
            grunt: {
                files: ['Gruntfile.js']
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: ['*', '**/*', '**/**/*']
                },
                options: {
                    watchTask: true,
                    server: "./"
                }
            }
        }
    });

    require('jit-grunt')(grunt, {
        concat: 'grunt-contrib-concat'
    });

    // vývojové prostředí "grunt default"
    grunt.registerTask('default', ['clean', 'copy', 'replace', 'concat:vendors', 'jshint', 'concat:application', 'concat:script', 'image', 'less', 'concat:style', 'codekit', 'browserSync', 'watch']);
    // produkční prostředí -> vygenerování minifikovaných souborů pro commit "grunt build"
    grunt.registerTask('build', ['clean', 'copy', 'replace', 'concat:vendors', 'jshint', 'concat:application', 'concat:script', 'image', 'less', 'postcss', 'cssmin', 'concat:style', 'codekit', 'uglify']);
};
