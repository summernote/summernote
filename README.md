# Summernote
Super Simple WYSIWYG Editor on Bootstrap~

Inspired by
* Gmail WYSIWYG Editor (http://www.gmail.com)
* Redactor (http://imperavi.com/redactor/)

### Summernote ?
Summernote is a javascript program that helps you to create WYSIWYG Editor on web. Summernote uses opensouce libraries(jquery, jquery.curstyles, bootstrap, fontAwesome)

Demo Page: http://hackerwins.github.io/summernote/

### Release

A summer is comming soon. release summernote v0.1 on 1st June, 2013

### Speciality

Summernote has something specials no like others. interative WYSIWYG editing, easy integrate Backend server and so much others.

### TODO list

implements image embeding, make/edit link, insert table

### Easy to install

#### 01. include js/css
```html
<!-- include libries(jquery, jquery.curstyles, bootstrap, fontawesome) -->
<script type="text/javascript" src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="libs/jquery.curstyles.min.js"></script>
<script type="text/javascript" src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.no-icons.min.css">
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/3.1.1/css/font-awesome.min.css">

<!-- include summernote css/js-->
<link rel="stylesheet" href="summernote.css" />
<script type="text/javascript" src="summernote.js"></script>
```

#### 02. target elements
```html
<div id="summernote">Hello Summernote</div>
```

#### 03. run script after document ready
```javascript
$(document).ready(function() {
  $('#summernote').summernote();
});
```

### Supported platform
* Modern Browser (Webkit, Firefox, IE 9+)
* OS (Windows, Mac)
