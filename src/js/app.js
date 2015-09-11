require.config({
  baseUrl: 'src/js',
  paths: {
    jquery: '//code.jquery.com/jquery-2.1.4',
    bootstrap: '//netdna.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap',
    jui: '//rawgit.com/seogi1004/jui/develop/dist/jui'
  },
  shim: {
    bootstrap: ['jquery'],
    jui : ['jquery']
  },
  packages: [{
    name: 'summernote',
    main: 'summernote',
    location: './'
  }]
});

require([
  'jquery',
  'summernote'
], function ($) {
  // editor type setting
  switch ($('script[data-editor-type]').data('editor-type')) {
    case 'lite':
      require(['summernote/lite/settings'], function (lite) {
        $.summernote = $.extend($.summernote, lite);
        // initialize summernote
        $('.summernote').summernote({
          height: 300
        });
      });
      break;
    case 'bs3':
      require(['bootstrap', 'summernote/bs3/settings'], function (bootstrap, bs3) {
        $.summernote = $.extend($.summernote, bs3);
        // initialize summernote
        $('.summernote').summernote({
          height: 300
        });
      });
      break;
    case 'jui':
      require(['jui', 'summernote/jui/settings'], function (jui, settings) {
        $.summernote = $.extend($.summernote, settings);
        // initialize summernote
        $('.summernote').summernote({
          height: 300
        });
      });
      break;    
  }
});
