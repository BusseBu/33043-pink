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

    csscomb: {
      style: {
        src: "build/css/style.css",
        dest: "build/css/style.css"
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
        "browserify"
    ]);

  // Не редактируйте эту строку
  config = require("./.gosha")(grunt, config);

  grunt.initConfig(config);
};
