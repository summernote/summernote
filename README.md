# Summernote
Super Simple WYSIWYG Editor on Bootstrap(3.0 and 2.x).

[![Build Status](https://secure.travis-ci.org/HackerWins/summernote.png)](http://travis-ci.org/HackerWins/summernote)

### Summernote
Summernote is a javascript program that helps you to create WYSIWYG Editor on web.

Demo Page: http://hackerwins.github.io/summernote/

### Why Summernote?

Summernote has something specials no like others.

Simple UI, Interative WYSIWYG editing, easy integrate Backend server and so much others.

#### Inspired by
* Gmail WYSIWYG Editor (http://www.gmail.com)
* Redactor (http://imperavi.com/redactor/)

### Easy to install

Summernote uses opensouce libraries(jQuery, bootstrap, fontAwesome) 

#### 01. include js/css
Include Following code into `<head>` tag of your HTML:
```html
<!-- include libries(jQuery, bootstrap, fontawesome) -->
<script type="text/javascript" src="//code.jquery.com/jquery-1.9.1.min.js"></script> 
<!-- bootstrap v3 -->
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.no-icons.min.css" />
<script type="text/javascript" src="//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.min.css" />

<!-- bootstrap v2.x
<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.no-icons.min.css" rel="stylesheet"> 
<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script> 
<link href="//netdna.bootstrapcdn.com/font-awesome/3.1.1/css/font-awesome.min.css" rel="stylesheet">
-->

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

### API
Get HTML `code` if you need.

```javascript
var sHTML = $('#summernote').code();
```

`Destroy` summernote.

```javascript
$('#summernote').destroy();
```

#### Dependencies
* jQuery: http://jquery.com/
* bootstrap: http://twitter.github.io/bootstrap/
* fontAwesome: https://github.com/FortAwesome/Font-Awesome

### Supported platform
* Modern Browser (Safari, Chrome, Firefox, Opera, Internet Explorer 9+)
* OS (Windows, Mac)

### Upcoming Features
* Air Mode
* Responsive Toolbar
* Table: Handles(Sizing, Selection) and Popover

#### v0.4 2013-10-01
* Support both Bootstrap 3.0 and 2.x
* support IE8
* Image Upload
* Fullscreen

### Change Log

#### v0.3 2013-09-01
* `FIXED` bugs(image upload, fontsize, tab, recent color, ...)
* `ADDED` help dialog(keyboard shortcut)
* `ADDED` init options(event callbacks, custom toolbar)
* `ADDED` resize bar
* `ADDED` support IE8 Beta(some range bugs, can't insert Image)

#### v0.2, 2013-08-01
* `ADDED` undo/redo
* `ADDED` image sizing handle and popover
* `ADDED` support standalone css
* `ADDED` support Multiple Editor
* `REMOVED` jQuery.curstyles dependency

#### v0.1, 2013-07-01
* `ADDED` font style: size, color, bold, italic, underline, remove font style
* `ADDED` para style: bullet, align, outdent, indent, line height
* `ADDED` image: drag & drop, dialog
* `ADDED` link: popover and dialog
* `ADDED` table: create table with dimension picker

### for Hacker

#### structure of summernote.js

```
$.extend - Renderer (Markup)
         \ EventHandler - Editor - Range (W3CRange extention)
                                 \ Style (Style Getter and Setter)
                                 \ History (Store on jQuery.data)
                        \ Toolbar
                        \ Popover
                        \ Handle
                        \ Dialog
----------Common Utils----------
Dom, List, Func
```

#### build summernote
```bash
# grunt-cli is need by grunt; you might have this installed already
npm install -g grunt-cli
npm install
grunt build
```
At this point, you should now have a `build/` directory populated with everything you need to use summernote.

#### test summernote
run tests with PhantomJS
```bash
grunt test
```

### Contacts
* Email: susukang98@gmail.com
* Twitter: http://twitter.com/hackerwins

### License
summernote may be freely distributed under the MIT license.
