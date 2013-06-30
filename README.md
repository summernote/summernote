# Summernote
Super Simple WYSIWYG Editor on Bootstrap.

[![Build Status](https://secure.travis-ci.org/HackerWins/summernote.png)](http://travis-ci.org/HackerWins/summernote)

### Summernote ?
Summernote is a javascript program that helps you to create WYSIWYG Editor on web.

Demo Page: http://hackerwins.github.io/summernote/

### Why Summernote?

Summernote has something specials no like others.

Simple UI, Interative WYSIWYG editing, easy integrate Backend server and so much others.

#### Inspired by
* Gmail WYSIWYG Editor (http://www.gmail.com)
* Redactor (http://imperavi.com/redactor/)

### Easy to install

Summernote uses opensouce libraries(jquery, jquery.curstyles, bootstrap, fontAwesome) 

#### 01. include js/css
Include Following code into `<head>` tag of your HTML:
```html
<!-- include libries(jquery, jquery.curstyles, bootstrap, fontawesome) -->
<script type="text/javascript" src="//code.jquery.com/jquery-1.9.1.min.js"></script> 
<script type="text/javascript" src="//v3.javascriptmvc.com/jquery/dist/jquery.curstyles.min.js"></script>
<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.no-icons.min.css" rel="stylesheet"> 
<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script> 
<link href="//netdna.bootstrapcdn.com/font-awesome/3.1.1/css/font-awesome.min.css" rel="stylesheet">

<!-- include summernote css/js-->
<link rel="stylesheet" href="summernote.css" />
<script type="text/javascript" src="summernote.min.js"></script>
```
If your summernote download is placed in a different folder, don't forget to change file's paths.

#### 02. target elements
And place `div` tag to somewhere in the `body` tag. This element will be placed by the visual representation of the summernote.
```html
<div id="summernote">Hello Summernote</div>
```

#### 03. summernote
Finally, run script after document ready.
```javascript
$(document).ready(function() {
  $('#summernote').summernote();
});
```

#### Dependencies
* jQuery: http://jquery.com/
* jquery.curstyles: http://bitovi.com/blog/2010/06/get-multiple-computed-styles-fast-with-the-curstyles-jquery-plugin.html
* bootstrap: http://twitter.github.io/bootstrap/
* fontAwesome: https://github.com/FortAwesome/Font-Awesome

### Supported platform
* Modern Browser (Safari, Chrome, Firefox, Opera, Internet Explorer 9+)
* OS (Windows, Mac)

### Release

* release summernote v0.2 on 1st August, 2013
** undo/redo
** image: sizing handle and popover
** support standalone css using bootstrap utility mixins

### Author
* Email: susukang98@gmail.com
* Twitter: http://twitter.com/susukang98

### License
summernote may be freely distributed under the MIT license.
