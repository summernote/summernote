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
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.1/css/bootstrap.min.css" />
<script type="text/javascript" src="//netdna.bootstrapcdn.com/bootstrap/3.0.1/js/bootstrap.min.js"></script>
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.0.1/css/font-awesome.min.css" />

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
* bootstrap: http://twitter.github.io/bootstrap (both 2.x and 3.x)
* fontAwesome: https://github.com/FortAwesome/Font-Awesome (both 3.x and 4.x)

### Supported platform
* Modern Browser (Safari, Chrome, Firefox, Opera, Internet Explorer 9+)
* OS (Windows, Mac)

### Upcoming Features
* Air Mode
* Responsive Toolbar
* Table: Handles(Sizing, Selection) and Popover
* support IE8
* Clipboard
* Media Object Selection

### Change Log

#### v0.5 2013-12-31
* Support both Font-Awesome 3.x and 4.x
* CodeMirror as Codeview
* Insert Video (by cdownie)
* Locale (by hendrismit, tschiela)
* Restructuring: jQuery build pattern

#### v0.4 2013-11-01
* `ADDED` Support both Bootstrap 3.0 and 2.x
* `ADDED` Fullscreen
* `ADDED` Code View
* `ADDED` Image Upload callback

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
summernote.js - Renderer.js (Generate markup) - Locale.js (Locale object)
              ㄴEventHandler.js - Editor.js  (Abstract editor)
                                ㄴStyle.js   (Style Getter and Setter)
                                ㄴHistory.js (Store on jQuery.data)
                                ㄴToolbar.js (Toolbar module)
                                ㄴPopover.js (Popover module)
                                ㄴHandle.js  (Handle module)
                                ㄴDialog.js  (Dialog module)
-----------------------------Core Script-----------------------------
  agent.js  (agent information)
  async.js  (aysnc utility)
  dom.js    (dom functions)
  list.js   (list functions)
  range.js  (W3CRange extention)
---------------------------------------------------------------------
```

#### build summernote
```bash
# grunt-cli is need by grunt; you might have this installed already
npm install -g grunt-cli
npm install

# build full version of summernote: dist/summernote.js
grunt build

# generate minified copy: dist/summernote.min.js, dist/summernote.css
grunt dist
```
At this point, you should now have a `build/` directory populated with everything you need to use summernote.

#### test summernote
run tests with PhantomJS
```bash
grunt test
```

#### Coding convention
* JSHint: http://www.jshint.com/about/
* JSHint rule: https://github.com/HackerWins/summernote/blob/master/.jshintrc

### Contacts
* Email: susukang98@gmail.com
* Twitter: http://twitter.com/hackerwins

### License
summernote may be freely distributed under the MIT license.
