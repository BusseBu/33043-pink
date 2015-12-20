"use strict";

module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);

  var config = {
    pkg: grunt.file.readJSON("package.json"),

    sass: {
      style: {
        files: {
          "build/css/style.css": "src/sass/style.scss"
        }
      }
    },

    imagemin: {
      images: {
        options: {
          optimizationLevel : 3
        },
        files: [{
          expand: true,
          cwd: 'src/img',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: 'build/img'
        }]
      }
    },

    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        caseSensitive: true,
        keepClosingSlash: true
      },
     html: {
       files: {
         "form.min.html" : "form.html",
         "index.min.html" : "index.html"
       }
     }
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'build/css',
          src: ['*.css', '!*.min.css'],
          dest: 'build/css',
          ext: '.min.css'
        }]
      }
    },

    csscomb: {
      style: {
        src: "build/css/style.css",
        dest: "build/css/style.css"
      }
    },

    lintspaces: {
      style: {
        src: "*.html"
      }
    },

    cmq: {
      options: {
        log: false
      },
      style: {
        files: {
          "build/css/style.css" : "build/css/style.css"
        }
      }
    },

    browserify: {
      style: {
        files: {
          "build/js/script.js": "src/js/*.js"
        }
      }
    },

    postcss: {
      options: {
        processors: [
          require("autoprefixer")({browsers: "last 2 versions"})
        ]
      },
      style: {
        src: "build/css/*.css"
      }
    },

    watch: {
      scripts: {
        files: ['src/js/*.js'],
        tasks: ['browserify'],
        options: {
          spawn: false
        }
      },
      style: {
        files: ["src/sass/*.scss"],
        tasks: ["sass"],
        options: {
          spawn: false,
          livereload: true
        }
      }
    }
  };

    grunt.registerTask("build", [
      "sass",
      "browserify",
      "cmq",
      "postcss",
      "csscomb",
      "imagemin",
      "htmlmin",
      "cssmin"
    ]);

  // Не редактируйте эту строку
  config = require("./.gosha")(grunt, config);

  grunt.initConfig(config);
};
