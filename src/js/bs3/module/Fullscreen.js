define([
  'jquery'
], function ($) {
  var Fullscreen = function (summernote) {
    var self = this;
    var ui = $.summernote.ui;

    var $editor = summernote.layoutInfo.editor;
    var $toolbar = summernote.layoutInfo.toolbar;
    var $editable = summernote.layoutInfo.editable;
    var $codable = summernote.layoutInfo.codable;

    var $window = $(window);
    var $scrollbar = $('html, body');

    /**
     * toggle fullscreen
     */
    this.toggle = function () {
      var resize = function (size) {
        $editable.css('height', size.h);
        $codable.css('height', size.h);
        if ($codable.data('cmeditor')) {
          $codable.data('cmeditor').setsize(null, size.h);
        }
      };

      $editor.toggleClass('fullscreen');
      var isFullscreen = $editor.hasClass('fullscreen');
      if (isFullscreen) {
        $editable.data('orgheight', $editable.css('height'));

        $window.on('resize', function () {
          resize({
            h: $window.height() - $toolbar.outerHeight()
          });
        }).trigger('resize');

        $scrollbar.css('overflow', 'hidden');
      } else {
        $window.off('resize');
        resize({
          h: $editable.data('orgheight')
        });
        $scrollbar.css('overflow', 'visible');
      }

      summernote.invoke('toolbar.updateFullscreen', [isFullscreen]);
    };
  };

  return Fullscreen;
});
