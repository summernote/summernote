require.config({
  baseUrl: 'src/js',
  paths: {
    jquery: '//code.jquery.com/jquery-2.1.4',
    bootstrap: '//netdna.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap',
    jui : ''
  },
  shim: {
    bootstrap: ['jquery']
  },
  packages: [{
    name: 'summernote',
    main: 'summernote',
    location: './'
  }]
});

require([
  'jquery',
  'summernote',
  'summernote/lite/settings',
  'summernote/jui/settings',
  'summernote/bs3/settings'
], function ($, summernote, lite, jui, bs3) {
  // editor type setting
  switch ($('script[data-editor-type]').data('editor-type')) {
    case 'lite':
      $.summernote = $.extend($.summernote, lite);
      break;
    case 'jui':
      $.summernote = $.extend($.summernote, jui);
      break;
    case 'bs3':
      $.summernote = $.extend($.summernote, bs3);
      break;
  }

  // initialize summernote
  $('.summernote').summernote({
    height: 300
  });
});
