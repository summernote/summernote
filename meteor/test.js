'use strict';

Tinytest.add('Instantiation', function (test) {
  var editor = document.createElement('div');
  document.body.appendChild(editor);
  $(editor).summernote();

  test.equal(typeof $(editor).code(), 'string', 'Instantiation');
});
