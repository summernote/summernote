define([
  'jquery'
], function ($) {
  var Fullscreen = function (context) {
    var $editor = context.layoutInfo.editor;
    var $toolbar = context.layoutInfo.toolbar;
    var $editable = context.layoutInfo.editable;
    var $codable = context.layoutInfo.codable;

    var $window = $(window);
    var $scrollbar = $('html, body');

    var $clone;

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

        // when summernote became fullscreen mode, add $editor's clone and move $editor into body
        $clone = $editor.clone();
        $clone.addClass('clone');
        $editor.after($clone);
        $editor.appendTo('body');

        // set fullscreen class about fullscreen mode
        $('.note-modal').addClass('fullscreen-dialog');
        $('.modal-backdrop').addClass('old-dialog-backdrop');
        $('body').addClass('note-fullscreen');

        $editable.data('orgHeight', $editable.css('height'));

        $window.on('resize', function () {
          resize({
            h: $window.height() - $toolbar.outerHeight()
          });
        }).trigger('resize');

        $scrollbar.css('overflow', 'hidden');
      } else {
        // delete clone
        $clone.after($editor);
        $clone.remove();

        // remove fullscreen class
        $('.note-modal').removeClass('fullscreen-dialog');
        $('body').removeClass('note-fullscreen');
        $('.old-dialog-backdrop').removeClass('old-dialog-backdrop');

        $window.off('resize');
        resize({
          h: $editable.data('orgHeight')
        });
        $scrollbar.css('overflow', 'visible');
      }

      context.invoke('toolbar.updateFullscreen', isFullscreen);
    };
  };

  return Fullscreen;
});
