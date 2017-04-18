(function (factory) {
  /* global define */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(window.jQuery);
  }
}(function ($) {
    
  // Extends plugins for adding readmore.
  //  - plugin is external module for customizing.
  $.extend($.summernote.plugins, {
    /**
      * @param {Object} context - context object has status of editor.
      */
    'elfinder': function (context) {
      var self = this;
      
      // ui has renders to build ui elements.
      //  - you can create a button with `ui.button`
      var ui = $.summernote.ui;
      
      // add elfinder button
      context.memo('button.elfinder', function () {
        // create button
        var button = ui.button({
          contents: '<i class="fa fa-list-alt"/> File Manager',
          tooltip: 'elfinder',
          click: function () {
              elfinderDialog();
          }
        });
        
        // create jQuery object from button instance.
        var $elfinder = button.render();
        return $elfinder;
      });
      
      
      
      // This methods will be called when editor is destroyed by $('..').summernote('destroy');
      // You should remove elements on `initialize`.
      this.destroy = function () {
          this.$panel.remove();
          this.$panel = null;
      };
    }
      
  });
}));
