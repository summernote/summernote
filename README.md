# Summernote

[![Build Status](https://travis-ci.org/summernote/summernote.svg?branch=develop)](http://travis-ci.org/summernote/summernote)
[![npm version](https://badge.fury.io/js/summernote.svg)](http://badge.fury.io/js/summernote)
[![Coverage Status](https://coveralls.io/repos/summernote/summernote/badge.svg?branch=develop&service=github)](https://coveralls.io/github/summernote/summernote?branch=develop)

Summernote is a JavaScript library that helps you create WYSIWYG editors with a simple and easy-to-use interface. Summernote is licensed under the MIT license and maintained by the community.

Homepage: <https://summernote.org>

## Why use Summernote?

- **Simple and user-friendly**: Providing an easy to use, intuitive interface
- **Easy to install**: Just include the JS/CSS files on your HTML and create a `div` tag to get started
- **Compatible with Bootstrap**: Bootstrap 3, 4, and 5
- **Rich ecosystem**: A wide array of [plugins and connectors](https://github.com/summernote/awesome-summernote) are available, enhancing functionality and integration options
- **Easy image handling**: Images are automatically embedded in the content using base64 encoding, eliminating the need for separate image management

## How to Use

Summernote is built on [jQuery](http://jquery.com/).

### How to install

#### 1. Include JS/CSS

Include the following code in the `<head>` tag of your HTML:

```html
<!-- include libraries(jQuery, bootstrap) -->
<script type="text/javascript" src="//code.jquery.com/jquery-3.6.0.min.js"></script>
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" />
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>

<!-- include summernote css/js-->
<link href="summernote-bs5.css" rel="stylesheet">
<script src="summernote-bs5.js"></script>
```

#### 2. Place a `div` tag

Place a `div` tag somewhere in the `body` tag. This element will be replaced with the summernote editor.

```html
<div id="summernote">Hello Summernote</div>
```

#### 3. Initialize Summernote

Finally, initialize Summernote with the following JavaScript:

```javascript
$(document).ready(function() {
  $('#summernote').summernote();
});
```

For more examples, please visit the [project website](http://summernote.org/examples).

### API

Summernote provides a set of APIs. For example, you can use the following code to get the HTML source code underlying the text in the editor:

```javascript
var html = $('#summernote').summernote('code');
```

For more detail about the APIs, please refer to the [documentation](http://summernote.org/getting-started/#basic-api).

> Warning - code injection
> The code view allows the user to enter script contents. Make sure to filter/[sanitize the HTML on the server](https://github.com/search?l=JavaScript&q=sanitize+html). Otherwise, an attacker can inject arbitrary JavaScript code into clients.

## Contributing guide

See [CONTRIBUTING.md]( https://github.com/summernote/summernote/blob/main/.github/CONTRIBUTING.md) for details on how to contribute to Summernote.

## Contributors ✨

Thanks go to these incredible people:

<a href="https://github.com/summernote/summernote/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=summernote/summernote" alt="contributors"/>
</a>

## Sponsors

Is your company using Summernote? Ask your boss to support us. Becoming a sponsor will help us dedicate more time to maintaining this project and to making it even better for all our users. Also, your company logo will show up on here and on our website :-) [[Become a sponsor](https://opencollective.com/summernote#sponsor)]
<a href="https://opencollective.com/summernote#sponsor" target="_
blank"><img src="https://opencollective.com/summernote/sponsor.svg?width=890"></a>

### Backers

If you would like to contribute financially as an individual, please consider becoming a [Backer](https://opencollective.com/summernote#backers) of Summernote.
<a href="https://opencollective.com/summernote#backers" target="_blank"><img src="https://opencollective.com/summernote/backers.svg?width=890"></a>

## Contact

* Discord: [Join the Summernote Discord community](https://discord.gg/7A64GBKwyu)
