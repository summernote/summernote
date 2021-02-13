const config = require('./webpack.config.dev');

// Do not include output / entry - karma-webpack does not support it
delete config.entry;
delete config.output.filename;
delete config.output.path;

// Show only errors while using karma
config.stats = 'errors-only';

module.exports = config;
