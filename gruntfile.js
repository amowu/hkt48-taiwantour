'use strict';

module.exports = function(grunt) {
  // Unified Watch Object
  var watchFiles = {
    serverViews: ['app/views/**/*.*'],
    serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
    clientViews: ['public/modules/**/views/**/*.html'],
    clientJS: ['public/js/*.js', 'public/modules/**/*.js'],
    clientCSS: ['public/modules/**/*.css'],
    mochaTests: ['app/tests/**/*.js']
  };

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      serverViews: {
        files: watchFiles.serverViews,
        options: {
          livereload: true
        }
      },
      serverJS: {
        files: watchFiles.serverJS,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      clientViews: {
        files: watchFiles.clientViews,
        options: {
          livereload: true,
        }
      },
      clientJS: {
        files: watchFiles.clientJS,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      clientCSS: {
        files: watchFiles.clientCSS,
        tasks: ['csslint'],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      all: {
        src: watchFiles.clientJS.concat(watchFiles.serverJS),
        options: {
          jshintrc: true
        }
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc',
      },
      all: {
        src: watchFiles.clientCSS
      }
    },
    uglify: {
      production: {
        options: {
          mangle: false
        },
        files: {
          'dist/application.min.js': 'dist/application.js',
          'dist/vendor.min.js': 'dist/vendor.js'
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'dist/application.min.css': '<%= applicationCSSFiles %>',
          'dist/vendor.min.css': '<%= vendorCSSFiles %>'
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug'],
          ext: 'js,html',
          watch: watchFiles.serverViews.concat(watchFiles.serverJS)
        }
      }
    },
    'node-inspector': {
      custom: {
        options: {
          'web-port': 1337,
          'web-host': 'localhost',
          'debug-port': 5858,
          'save-live-edit': true,
          'no-preload': true,
          'stack-trace-limit': 50,
          'hidden': []
        }
      }
    },
    ngmin: {
      production: {
        files: {
          'dist/application.js': '<%= applicationJavaScriptFiles %>',
          'dist/vendor.js': '<%= vendorJavaScriptFiles %>'
        }
      }
    },
    concurrent: {
      default: ['nodemon', 'watch'],
      debug: ['nodemon', 'watch', 'node-inspector'],
      options: {
        logConcurrentOutput: true
      }
    },
    env: {
      test: {
        NODE_ENV: 'test'
      },
      production: {
        NODE_ENV: 'production'
      }
    },
    mochaTest: {
      src: watchFiles.mochaTests,
      options: {
        reporter: 'spec',
        require: 'server.js'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'public/modules/core/img/',
            src: '**',
            dest: 'dist/modules/core/img/'
          },
          {
            expand: true,
            cwd: 'public/modules/members/img/',
            src: '**',
            dest: 'dist/modules/members/img/'
          },
          {
            expand: true,
            cwd: 'public/modules/members/views/',
            src: '**',
            dest: 'dist/modules/members/views/'
          },
          {
            expand: true,
            cwd: 'public/modules/members/',
            src: 'members.json',
            dest: 'dist/modules/members/'
          },
          {
            expand: true,
            cwd: 'public/',
            src: '*.txt',
            dest: 'dist/'
          },
          {
            expand: true,
            cwd: 'public/',
            src: '*.xml',
            dest: 'dist/'
          },
          {
            expand: true,
            cwd: 'app/views/',
            src: 'index.html',
            dest: 'dist/'
          },
          {
            expand: true,
            cwd: 'public/lib/slick-carousel/slick/fonts',
            src: '*',
            dest: 'dist/fonts'
          },
          {
            expand: true,
            cwd: 'public/lib/slick-carousel/slick/',
            src: 'ajax-loader.gif',
            dest: 'dist/'
          }
        ]
      }
    }
  });

  // Load NPM tasks 
  require('load-grunt-tasks')(grunt);

  // Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  // A Task for loading the configuration object
  grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
    var init = require('./config/init')();
    var config = require('./config/config');

    grunt.config.set('applicationJavaScriptFiles', config.assets.js);
    grunt.config.set('applicationCSSFiles', config.assets.css);
    grunt.config.set('vendorJavaScriptFiles', config.assets.lib.js);
    grunt.config.set('vendorCSSFiles', config.assets.lib.css);
  });

  grunt.task.registerTask('copyFiles', 'Task that copy the public files into a gdist.', function() {

  });

  // Lint task(s).
  grunt.registerTask('lint', ['jshint', 'csslint']);

  // Default task(s).
  grunt.registerTask('default', ['lint', 'concurrent:default']);

  // Debug task.
  grunt.registerTask('debug', ['lint', 'concurrent:debug']);

  // Test task.
  grunt.registerTask('test', ['lint', 'env:test', 'mochaTest', 'karma:unit']);
  
  // Build task(s).
  grunt.registerTask('build', ['lint', 'loadConfig', 'ngmin', 'uglify', 'cssmin', 'copy']);
};