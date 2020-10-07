module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-stylelint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-postcss');

  grunt.initConfig({
    eslint: {
      options: {
        configFile: '.eslintrc.json',
        fix: true,
      },
      target: ['src/**/*.js'],
    },
    stylelint: {
      options: {
        configFile: '.stylelintrc.json',
        fix: true,
      },
      all: ['src/components/**/*.css'],
    },
    postcss: {
      options: {
        map: false,
        processors: [
          //require('pixrem')(), // add fallbacks for rem units
          require('autoprefixer')(),
          //require('cssnano')() // minify the result
        ],
      },
      dist: {
        src: 'src/styles/**/*.css',
      },
    },
    watch: {
      files: [
        'Gruntfile.js',
        '.stylelintrc.json',
        '.eslintrc.json',
        'src/**/*.js',
        'src/components/**/*.css',
      ],
      tasks: ['stylelint', 'eslint'],
    },
  });

  grunt.registerTask('default', ['eslint', 'postcss']);
};
