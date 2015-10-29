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
  $.extend($.summernote.plugins, {
    'hello': function (context) {

      var self = this;
      var ui = $.summernote.ui;

      // define hello button
      context.addButton('hello', function () {
        return ui.button({
          contents: '<i class="fa fa-font fa-flip-vertical" /> Hello',
          tooltip: 'hello',
          click: function () {
            alert('Hello, World!');
            self.show().hide(1000);
          }
        }).render();
      });

      // define summernote custom event
      this.events = {
        'summernote.init' : function (we, e) {
          console.log('summernote initialized');
        },
        'summernote.keyup' : function (we, e) {
          console.log('summernote keyup');
        }
      }

      // define initialize method
      this.initialize = function () {
        // something to do

        this.$panel = $("<div class='hello-panel'></div>").css({
          position: 'absolute',
          width: 100,
          height: 100,
          left: '50%',
          top: '50%',
          background: 'red'
        }).hide();
        this.$panel.appendTo('body');
      };

      this.show = function () {
        this.$panel.show();
      };

      // when destroy summernote or remove module
      this.destroy = function() {
        this.$panel.remove();
        this.$panel = null;
      }
    }
  });
}));
