(function (factory) {
  /* global define */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals: jQuery
    factory(window.jQuery);
  }
}(function ($) {
  // template
  var tmpl = $.summernote.renderer.getTemplate();

  /**
   * @class plugin.hello 
   * 
   * Hello Plugin  
   */
  $.summernote.addPlugin({
    /** @property {String} name name of plugin */
    name: 'hello',
    /** 
     * @property {Object} buttons 
     * @property {Function} buttons.hello   function to make button
     * @property {Function} buttons.helloDropdown   function to make button
     * @property {Function} buttons.helloImage   function to make button
     */
    buttons: { // buttons
      hello: function (lang, options) {

        return tmpl.iconButton(options.iconPrefix + 'header', {
          event : 'hello',
          title: 'hello',
          hide: true
        });
      },
      helloDropdown: function (lang, options) {


        var list = '<li><a data-event="helloDropdown" href="#" data-value="summernote">summernote</a></li>';
        list += '<li><a data-event="helloDropdown" href="#" data-value="codemirror">Code Mirror</a></li>';
        var dropdown = '<ul class="dropdown-menu">' + list + '</ul>';

        return tmpl.iconButton(options.iconPrefix + 'header', {
          title: 'hello',
          hide: true,
          dropdown : dropdown
        });
      },
      helloImage : function (lang, options) {
        return tmpl.iconButton(options.iconPrefix + 'file-image-o', {
          event : 'helloImage',
          title: 'helloImage',
          hide: true
        });
      }

    },

    /**
     * @property {Object} events 
     * @property {Function} events.hello  run function when button that has a 'hello' event name  fires click
     * @property {Function} events.helloDropdown run function when button that has a 'helloDropdown' event name  fires click
     * @property {Function} events.helloImage run function when button that has a 'helloImage' event name  fires click
     */
    events: { // events
      hello: function (event, editor, layoutInfo) {
        // Get current editable node
        var $editable = layoutInfo.editable();

        // Call insertText with 'hello'
        editor.insertText($editable, 'hello ');
      },
      helloDropdown: function (event, editor, layoutInfo, value) {
        // Get current editable node
        var $editable = layoutInfo.editable();

        // Call insertText with 'hello'
        editor.insertText($editable, 'hello ' + value + '!!!!');
      },
      helloImage : function (event, editor, layoutInfo) {
        var $editable = layoutInfo.editable();

        var img = $('<img src="http://upload.wikimedia.org/wikipedia/commons/b/b0/NewTux.svg" />');
        editor.insertNode($editable, img[0]);
      }
    }
  });
}));
