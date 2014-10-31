(function ($) {
  // template, editor
  var tmpl = $.summernote.renderer.getTemplate();
  var editor = $.summernote.eventHandler.getEditor();

  // add plugin
  $.summernote.addPlugin({
    name: 'fontstyle', // name of plugin
    buttons: { // buttons
      strikethrough: function (lang) {
        return tmpl.iconButton('fa fa-strikethrough', {
          event: 'strikethrough',
          title: lang.fontstyle.strikethrough
        });
      },
      superscript: function (lang) {
        return tmpl.iconButton('fa fa-superscript', {
          event: 'superscript',
          title: lang.fontstyle.superscript
        });
      },
      subscript: function (lang) {
        return tmpl.iconButton('fa fa-subscript', {
          event: 'subscript',
          title: lang.fontstyle.subscript
        });
      },
      fontsize: function (lang, options) {
        var items = options.fontSizes.reduce(function (memo, v) {
          return memo + '<li><a data-event="fontsize" href="#" data-value="' + v + '">' +
                          '<i class="fa fa-check"></i> ' + v +
                        '</a></li>';
        }, '');

        var label = '<span class="note-current-fontsize">11</span>';
        return tmpl.button(label, {
          title: lang.fontstyle.size,
          dropdown: '<ul class="dropdown-menu">' + items + '</ul>'
        });
      }
    },

    events: { // events
      strikethrough: function (layoutInfo) {
        editor.strikethrough(layoutInfo.editable());
      },
      superscript: function (layoutInfo) {
        editor.superscript(layoutInfo.editable());
      },
      subscript: function (layoutInfo) {
        editor.subscript(layoutInfo.editable());
      },
      fontsize: function (layoutInfo, value) {
        editor.fontSize(layoutInfo.editable(), value);
      }
    },

    options: {
      fontSizes: ['8', '9', '10', '11', '12', '14', '18', '24', '36']
    },

    langs: {
      'en-US': {
        fontstyle: {
          strikethrough: 'Strikethrough',
          subscript: 'Subscript',
          superscript: 'Superscript',
          size: 'Font Size'
        }
      },
      'ko-KR': {
        fontstyle: {
          superscript: '위 첨자',
          subscript: '아래 첨자',
          strikethrough: '취소선',
          size: '글자 크기'
        }
      }
    }
  });
})(jQuery);
