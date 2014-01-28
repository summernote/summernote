'use strict';

var express = require('express'),
    openBrowser = require('open'),
    app = express();

app.use('/', express.static(__dirname));
app.listen(3000, function () {
  console.log('Summernote App');
});

openBrowser('http://127.0.0.1:3000/examples/index.html');