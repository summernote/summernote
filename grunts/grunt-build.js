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
 
  const rollup = require('rollup');
  const rollupTypescript = require('rollup-plugin-typescript');
  const typescript = require('typescript');
  const replace = require('rollup-plugin-replace');
 
  const inputOptions = {
    external: ['jquery'],
    plugins: [
      rollupTypescript({
        typescript: typescript,
        include: ['**/*.js', '**/*.ts']
      }),
      replace({
        delimiters: ['@@', '@@'],
        VERSION: version
      })
    ]
  };
  
  const outputOptions = {
    banner,
    format: 'umd',
    sourcemap: true,
    globals: {
      'jquery': 'jQuery'
    }
  };

  grunt.registerMultiTask('build', 'concatenate source: summernote.js', function () {
    const done = this.async();
    
    rollup.rollup(Object.assign(inputOptions, {
      input: this.data.input
    })).then((bundle) => {
      return bundle.write(Object.assign(outputOptions, {
        file: this.data.output
      }));
    }).then((result) => {
      done();
    }).catch((err) => {
      grunt.log.error(err);
    });
  });
};
