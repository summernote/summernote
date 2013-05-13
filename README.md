# summernote
> Super Simple WYSIWYG Editor on Bootstrap

### summernote ?
summernote is a javascript program that helps you to create WYSIWYG Editor on web. summernote uses opensouce libraries(jquery, jquery.curstyles, bootstrap, fontAwesome)

Demo Page: http://hackerwins.github.io/summernote/

### release
> summer is comming soon. release summernote v0.1 on 1st June, 2013

### installation
#### 01. include js/css
```html
<!-- include libries(jquery, jquery.curstyles, bootstrap, fontawesome) -->
<script type="text/javascript" src="http://code.jquery.com/jquery-1.9.1.min.js"></script> 
<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.no-icons.min.css" rel="stylesheet"> 
<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script> 
<link href="//netdna.bootstrapcdn.com/font-awesome/3.1.1/css/font-awesome.min.css" rel="stylesheet">
<link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/font-awesome/3.1.0/css/font-awesome.min.css">
<script type="text/javascript" src="libs/jquery.curstyles.min.js"></script>

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
