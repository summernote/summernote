# summernote
> Super Simple WYSIWYG Editor on Bootstrap

### summernote ?
summernote is a javascript program that helps you to create WYSIWYG Editor on web. summernote uses opensouce libraries(jquery, jquery.curstyles, bootstrap, fontAwesome)

Demo Page: http://hackerwins.github.io/summernote/

### installation
#### 01. include js/css
```html
<!-- include libries(jquery, jquery.curstyles, bootstrap, fontawesome) -->
<script type="text/javascript" src="http://code.jquery.com/jquery-1.9.1.min.js"></script> 
<script type="text/javascript" src="libs/jquery.curstyles.min.js"></script>
<link href="libs/bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
<link rel="stylesheet" href="libs/FortAwesome-Font-Awesome/css/font-awesome.min.css">

<!-- include summernote css/js-->
<link rel="stylesheet" href="summernote.css" />
<script type="text/javascript" src="summernote.js"></script>
```
#### 02. target elements
```html
<div id="summernote">Hello Summernote</div>
```
#### 03. run script
```javascript
$('#summernote').summernote();
```

### TODO list
1. implements image, link, table

### browser support
> Modern Browser (Webkit, Firefox, IE 9+)
