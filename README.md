# Summernote
Super Simple WYSIWYG Editor on Bootstrap(3.0 and 2.x).

[![Build Status](https://secure.travis-ci.org/HackerWins/summernote.png)](http://travis-ci.org/HackerWins/summernote)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

### Summernote
Summernote is a javascript program that helps you to create WYSIWYG Editor on web.

Home Page: http://hackerwins.github.io/summernote/

### Why Summernote?

Summernote has something specials no like others.
* Simple UI
* Interative WYSIWYG editing
* Handy integration with server

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
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" />
<script type="text/javascript" src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css" />

<!-- include summernote css/js-->
<link href="//oss.maxcdn.com/summernote/0.5.1/summernote.css" rel="stylesheet">
<script src="//oss.maxcdn.com/summernote/0.5.1/summernote.min.js"></script>
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

#### v0.5.1 2014-03-16
* Support 15 Languages(https://github.com/HackerWins/summernote/tree/master/lang)
* Add local-server for develop summernote.
* Font style: Font-Family
* And Bug patch.

#### v0.5 2013-12-29
* Support both Font-Awesome 3.x and 4.x
* CodeMirror as Codeview
* Insert Video (by cdownie)
* Support 5 Languages(by hendrismit, tschiela, inomies, cverond)
* Restructuring: jQuery build pattern

#### v0.4 2013-11-01
* Support both Bootstrap 3.0 and 2.x
* Fullscreen
* Codeview
* Image Upload callback

#### v0.3 2013-09-01
* Bugs(image upload, fontsize, tab, recent color, ...)
* Help dialog(keyboard shortcut)
* Init options(event callbacks, custom toolbar)
* Resize bar
* Support IE8 Beta(some range bugs, can't insert Image)

#### v0.2, 2013-08-01
* Undo/Redo
* Image sizing handle and popover
* Support standalone css
* Support Multiple Editor
* Remove jQuery.curstyles dependency

#### v0.1, 2013-07-01
* Font style: size, color, bold, italic, underline, remove font style
* Para style: bullet, align, outdent, indent, line height
* Image: drag & drop, dialog
* Link: popover and dialog
* Table: create table with dimension picker

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
  key.js    (keycode object)
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

#### start local server for developing summernote.
run local server with connect and watch.
```bash
# this will open a browser on http://localhost:3000.
grunt server
# If you change source code, automatically reload your page.
```

#### Coding convention
* JSHint: http://www.jshint.com/about/
* JSHint rule: https://github.com/HackerWins/summernote/blob/master/.jshintrc

### Contacts
* Email: susukang98@gmail.com
* Twitter: http://twitter.com/hackerwins

### License
summernote may be freely distributed under the MIT license.
