var script = document.getElementById('start');
var isIE8 = script && script.getAttribute('data-browser') === 'ie8';
var jqueryVersion = script && script.getAttribute('data-jquery-version');

var jqueryPath;
if (jqueryVersion) {
  jqueryPath = '//cdnjs.cloudflare.com/ajax/libs/jquery/' + jqueryVersion + '/jquery';
} else {
  jqueryPath = isIE8 ? '//code.jquery.com/jquery-1.11.3' : '//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery';
}

require.config({
  baseUrl: 'src/js',
  paths: {
    jquery: jqueryPath,
    bootstrap: '//netdna.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap',
    lang: '../../lang/summernote-ko-KR'
  },
  shim: {
    bootstrap: ['jquery'],
    lang: ['jquery']
  },
  packages: [{
    name: 'summernote',
    main: 'summernote',
    location: './'
  }]
});

require(['jquery', 'summernote'], function ($) {
  var requireByPromise = function (paths) {
    return $.Deferred(function (deferred) {
      require(paths, function () {
        deferred.resolve.apply(this, arguments);
      });
    });
  };

  var promise = $.Deferred();
  // editor type setting
  switch ($('script[data-editor-type]').data('editor-type')) {
    case 'lite':
      promise = requireByPromise(['summernote/lite/settings']);
      break;
    case 'bs3':
      promise = requireByPromise(['bootstrap', 'summernote/bs3/settings']).then(function () {
        return requireByPromise(['lang']);
      });
      break;
  }

  promise.then(function () {
    // initialize summernote
    $('.summernote').summernote({
      height: 300,
      lang: 'ko-KR',
      placeholder: 'type here...'
    });
  });
});
