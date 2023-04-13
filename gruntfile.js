module.exports = function(grunt) {
  var srcJS = "bundles/",
      //srcCSS = "styles/",
      jsFiles = [],
      listJS = grunt.file.readJSON(srcJS+"compress.json");

  for (var i=0, file; file = listJS[i]; i++) {
    if (file === "app.js") {
      jsFiles.push(srcJS+"templates.js");
    }
    jsFiles.push(srcJS+file);
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    pathJS: "js/",
//    pathCSS: "dist/css/",
//    srcCSS: srcCSS,
    srcJS: srcJS,

    uglify: {
      minify: {
        options: {
		  beautify: true,
          sourceMap: true,
          sourceMapName: "<%= pathJS %>sourcemap.map"
        },
        files: {
          "<%= pathJS %><%= pkg.name %>.min.js": jsFiles
        }
      }
    },

//    stylus: {
//      build: {
//        options: {
//          linenos: true,
//          compress: false
//        },
//        files: [{
//          expand: true,
//          cwd: srcCSS,
//          src: [ "**/compress.styl" ],
//          dest: srcCSS,
//          ext: ".cp.css"
//        }]
//      }
//    },

//    cssmin: {
//      build: {
//        files: {
//          "<%= pathCSS %><%= pkg.name %>.min.css": ["<%= srcCSS %>**/compress.cp.css"]
//        }
//      }
//    },

    clean: {
//      css: ["<%= srcCSS %>/**/*.cp.css"],
      templates: ["<%= srcJS %>templates.js"]
    },

    watch: {
      templates: {
        files: "<%= srcJS %>**/**/**/*.tpl.html",
        tasks: ["js"],
        options: {
           livereload: 35731
        }
      },
      scripts: {
        files: jsFiles.concat(["<%= srcJS %>compress.json", "!<%= srcJS %>templates.js"]),
        tasks: ["js"],
        options: {
           livereload: 35731
        }
      },
//      stylesheets: {
//        files: ["<%= srcCSS %>**/*.styl", "<%= srcCSS %>**/*.css", "!<%= srcCSS %>**/*.cp.css"],
//        tasks: [ "css" ],
//        options: {
//           livereload: 35729
//        }
//      }
    },

    copy: {
        main: {
            files: [
              {
                cwd: 'bower_components/Font-Awesome/fonts',
                src: '**',
                dest: 'dist/fonts',
                expand: true,
                flatten: true,
                filter: 'isFile'
              },
              {
                cwd: 'bower_components/bootstrap/fonts',
                src: '**',
                dest: 'dist/fonts',
                expand: true,
                flatten: true,
                filter: 'isFile'
              },
              {
                cwd: 'bower_components/ionicons/fonts',
                src: '**',
                dest: 'dist/fonts',
                expand: true,
                flatten: true,
                filter: 'isFile'
              }
            ]
        }
    },

    html2js: {
      /**
       * These are the templates from `src/app`.
       */
      app: {
        options: {
          base: '<%= srcJS %>'
        },
        src: [ '<%= srcJS %>**/**/**/**/*.tpl.html' ],
        dest: '<%= srcJS %>templates.js'
      }
    }

  });

  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-stylus");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-copy');

//  grunt.registerTask("css", [ "stylus", "cssmin", "clean" ]);
  grunt.registerTask("js", ["html2js", "uglify", "clean"]);
  grunt.registerTask("default", ["copy", "js",  "uglify", "watch"]);
};
