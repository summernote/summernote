module.exports = function (grunt) {
  const version = grunt.config('pkg.version');
  const date = (new Date()).toISOString().replace(/:\d+\.\d+Z$/, 'Z');
  
  const banner = [
    `/**`,
    ` * Super simple wysiwyg editor v${version}`,
    ` * https://summernote.org`,
    ` *`,
    ` * Copyright 2013- Alan Hong. and other contributors`,
    ` * summernote may be freely distributed under the MIT license.`,
    ` *`,
    ` * Date: ${date}`,
    ` */`
  ].join('\n');
  
  const input = {
    external: ['jquery']
  };
  
  const output = {
    banner,
    format: 'umd',
    globals: {
      'jquery': 'jQuery'
    }
  };

  const rollup = require('rollup');

  grunt.registerMultiTask('build', 'concatenate source: summernote.js', function () {
    const done = this.async();
    
    rollup.rollup(Object.assign(input, {
      input: this.data.input
    })).then((bundle) => {
      return bundle.write(Object.assign(output, {
        file: this.data.output
      }));
    }).then((result) => {
      done();
    }).catch((err) => {
      grunt.log.error(err);
    });
  });
};
