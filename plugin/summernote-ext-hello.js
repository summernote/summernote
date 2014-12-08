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
          event : 'hello',
          title: 'hello',
          hide: true
        });
      },
      helloDropdown: function () {


        var list = '<li><a data-event="helloDropdown" href="#" data-value="summernote">summernote</a></li>';
        list += '<li><a data-event="helloDropdown" href="#" data-value="codemirror">Code Mirror</a></li>';
        var dropdown = '<ul class="dropdown-menu">' + list + '</ul>';

        return tmpl.iconButton('fa fa-header', {
          title: 'hello',
          hide: true,
          dropdown : dropdown
        });
      }

    },

    events: { // events
      hello: function (layoutInfo) {
        // Get current editable node
        var $editable = layoutInfo.editable();

        // Call insertText with 'hello'
        editor.insertText($editable, 'hello ');
      },
      helloDropdown: function (layoutInfo, value) {
        // Get current editable node
        var $editable = layoutInfo.editable();

        // Call insertText with 'hello'
        editor.insertText($editable, 'hello ' + value + '!!!!');
      }
    }
  });
})(jQuery);
