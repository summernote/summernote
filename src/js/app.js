require.config({
  baseUrl: 'src/js',
  paths: {
    jquery: '//code.jquery.com/jquery-1.9.1.min',
    bootstrap: '//netdna.bootstrapcdn.com/bootstrap/3.0.1/js/bootstrap.min',
    CodeMirror: '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/codemirror',
    CodeMirrorXml: '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/mode/xml/xml.min',
    CodeMirrorFormatting: '//cdnjs.cloudflare.com/ajax/libs/codemirror/2.36.0/formatting.min'
  },
  shim: {
    bootstrap: ['jquery'],
    CodeMirror: { exports: 'CodeMirror' },
    CodeMirrorXml: ['CodeMirror'],
    CodeMirrorFormatting: ['CodeMirror', 'CodeMirrorXml']
  }
});

require([
  'jquery', 'bootstrap', 'CodeMirrorFormatting',
  'summernote'
], function ($) {
  // summernote
  $('.summernote').summernote({
    height: 300,
    focus: true,
    tabsize: 2,
    codemirror: {
      theme: 'monokai'
    }
  });
});
