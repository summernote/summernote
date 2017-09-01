var script = document.getElementById('start');
var isIE8 = script && script.getAttribute('data-browser') === 'ie8';
var jqueryVersion = script && script.getAttribute('data-jquery-version');

var jqueryPath;
if (jqueryVersion) {
    jqueryPath = '//cdnjs.cloudflare.com/ajax/libs/jquery/' + jqueryVersion + '/jquery';
} else {
    jqueryPath = isIE8 ? '//code.jquery.com/jquery-1.11.3' : '//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery';
}

var paths = {
    jquery: jqueryPath,
    bootstrap: '//netdna.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap',
    lang: '../../lang/summernote-ko-KR'
};
var dependencies = ['jquery', 'summernote'];

var bsE = document.querySelector('script[data-editor-type]').getAttribute('data-editor-type') || 'bs3';
if (bsE === 'bs4') {
    paths = {
        jquery: jqueryPath,
        bootstrap: '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.6/js/bootstrap',
        lang: '../../lang/summernote-ko-KR'
    };
}

require.config({
    baseUrl: 'src/js',
    paths: paths,
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

require(dependencies, function ($) {
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
        case 'bs4':
            promise = requireByPromise(['bootstrap', 'summernote/bs4/settings']).then(function () {
                return requireByPromise(['lang']);
            });

            break;
    }

    promise.then(function () {
        // initialize summernote

        if (bsE === 'bs4') {
            $('head').append($('<link rel="stylesheet" ' +
                  'href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.6/css/bootstrap.css" />'));
            $('head').append($('<link rel="stylesheet" href="../dist/summernote.bs4.css" />'));
        }
        else {
            $('head').append($('<link rel="stylesheet" ' +
                'href="//netdna.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.css" />'));
            $('head').append($('<link rel="stylesheet" href="../dist/summernote.bs3.css" />'));
        }
        $('#main-cont').show();
        $('.summernote').summernote({
            height: 300,
            placeholder: 'type here...'
        });
    });
});
