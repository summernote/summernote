(function ($) {
  // template, editor
  var tmpl = $.summernote.renderer.getTemplate();
  var editor = $.summernote.eventHandler.getEditor();

  // add plugin
  $.summernote.addPlugin({
    name: 'hello', // name of plugin
    buttons: { // buttons
      hello: function () {
        return tmpl.iconButton('fa fa-header', {
          event: 'hello',
          title: 'hello',
          hide: true
        });
      }
    },

    events: { // events
      hello: function (layoutInfo) {
        // Get current editable node
        var $editable = layoutInfo.editable();

        // Call insertText with 'hello'
        editor.insertText($editable, 'hello');
      }
    }
  });
})(jQuery);
