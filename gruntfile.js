module.exports = function(grunt) {
    'use strict';

    require('time-grunt')(grunt);

    // definice závislostí použitých v projektu,
    // je blbost importovat celý bootstrap.min.js
    var devStackOptions = {
        vendorsJS: [
            'bower_components/jquery/dist/jquery.min.js',
            //  'bower_components/bootstrap/js/dist/alert.js',
            //  'bower_components/bootstrap/js/dist/button.js',
            //  'bower_components/bootstrap/js/dist/carousel.js',
            //  'bower_components/bootstrap/js/dist/collapse.js',
            //  'bower_components/bootstrap/js/dist/dropdown.js',
            //  'bower_components/bootstrap/js/dist/index.js',
            //  'bower_components/bootstrap/js/dist/modal.js',
            //  'bower_components/bootstrap/js/dist/popover.js',
            //  'bower_components/bootstrap/js/dist/scrollspy.js',
            //  'bower_components/bootstrap/js/dist/tab.js',
            //  'bower_components/bootstrap/js/dist/tooltip.js',
            //  'bower_components/bootstrap/js/dist/util.js'
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
                dest: 'build/js/vendors.js'
            },
            application: {
                src: ['src/js/*.js', 'src/js/**/*.js', 'src/js/**/**/*.js'],
                dest: 'build/js/main.js'
            },
            script: {
                src: ['build/js/vendors.js', 'build/js/main.js'],
                dest: 'build/js/main.js'
            },
            style: {
                src: 'build/style/*.css',
                dest: 'build/style/main.css'
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
                    'build/js/vendors.js': 'build/js/vendors.js'
                }
            },
            application: {
                files: {
                    'build/js/main.js': 'build/js/main.js'
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
        sass: {
            bootstrap: {
                files: {
                    'build/style/bootstrap.css': 'src/style/bootstrap/main.scss',
                }
            },
            theme: {
                files: {
                    'build/style/theme.css': 'src/style/theme/main.scss',
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
                src: 'build/style/bootstrap.css'
            },
            theme: {
                src: 'build/style/theme.css'
            },
        },

        // minifikace stylů bootstrapu a samotné šablony webu
        // -> rozděleno do samostatných subtasků kvůli rychlosti
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            bootstrap: {
                files: {
                    'build/style/bootstrap.css': 'build/style/bootstrap.css'
                }
            },
            theme: {
                files: {
                    'build/style/theme.css': 'build/style/theme.css'
                }
            }
        },

        uncss: {
            build: {
                files: {
                    'build/style/main.css': ['build/templates/*.html']
                },
                options: {
                    report: 'gzip',
                    ignore: ['.js-.*', '#.*']
                }
            }
        },

        // zkopírování bower komponent do adresáře přístupného přes url
        copy: {
            lte: {
                src: 'bower_components/lt-ie-9/lt-ie-9.min.js',
                dest: 'build/js/lt-ie-9.min.js'
            },
            font_awesome_style: {
                src: 'bower_components/font-awesome/css/font-awesome.min.css',
                dest: 'build/style/font-awesome.min.css'
            },
            font_awesome_font: {
                filter: 'isFile',
                flatten: true,
                expand: true,
                src: 'bower_components/font-awesome/fonts/*',
                dest: 'build/font/'
            }
        },

        // nahradit adresu k font awesome, jinak vyhazuje 404
        replace: {
            font_path: {
                options: {
                    patterns: [{
                        match: '../fonts/',
                        replacement: '../../build/font/'
                    }],
                    usePrefix: false
                },
                files: [{
                    expand: false,
                    flatten: true,
                    src: 'build/style/font-awesome.min.css',
                    dest: 'build/style/font-awesome.min.css'
                }]
            },
            remove_comments: {
                options: {
                    patterns: [{
                        match: RegExp(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm),
                        replacement: ''
                    }],
                    usePrefix: false
                },
                files: [{
                    expand: false,
                    flatten: true,
                    src: 'build/style/main.css',
                    dest: 'build/style/main.css'
                }]
            }
        },

        // mazání vygenerovaných souborů před novým generováním
        clean: {
            bootstrap: ['build/style/bootstrap.css', 'build/style/main.css'],
            theme: ['build/style/theme.css', 'build/style/main.css'],
            style: 'build/style/*.css',
            scriptApp: 'build/js/main.js',
            script: 'build/js/*.js'
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
                    dest: 'build/image/'
                }]
            },
        },

        // zkompiluje *.kit soubory na kompletní *.html šablony
        codekit: {
            compile_templates: {
                files: [{
                    expand: true,
                    cwd: 'src/templates',
                    src: ['*.kit', '**/*.kit'],
                    dest: 'build/templates',
                    ext: '.html'
                }]
            }
        },

        // watch task pro styly, js, šablony i gruntfile
        watch: {
            style_bootstrap: {
                files: 'src/style/bootstrap/*.scss',
                tasks: ['clean:bootstrap', 'sass:bootstrap', 'concat:style']
            },
            style_theme: {
                files: ['src/style/theme/*.scss', 'src/style/theme/**/*.scss'],
                tasks: ['clean:theme', 'sass:theme', 'concat:style']
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
    grunt.registerTask('default', ['clean', 'copy', 'replace:font_path', 'concat:vendors', 'jshint', 'concat:application', 'concat:script', 'image', 'sass', 'concat:style', 'codekit', 'browserSync', 'watch']);
    // produkční prostředí -> vygenerování minifikovaných souborů pro commit "grunt build"
    grunt.registerTask('build', ['clean', 'copy', 'replace:font_path', 'concat:vendors', 'jshint', 'concat:application', 'concat:script', 'image', 'sass', 'postcss', 'cssmin', 'concat:style', 'codekit', 'uncss', 'replace:remove_comments', 'uglify']);
};
