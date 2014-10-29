(function ($) {
  // template, editor
  var tmpl = $.summernote.renderer.getTemplate();
  var editor = $.summernote.eventHandler.getEditor();

  // add video plugin
  $.summernote.addPlugin({
    name: 'hello',
    buttons: {
      hello: function () {
        return tmpl.iconButton('fa fa-header', {
          event: 'hello',
          title: 'hello',
          hide: true
        });
      }
    },

    events: {
      hello: function (layoutInfo) {
        // Get current editable node
        var $editable = layoutInfo.editable();

        // Call insertText with 'hello'
        editor.insertText($editable, 'hello');
      }
    }
  });
})(jQuery);
