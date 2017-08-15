define([
  'jquery'
], function ($) {
  var Fullscreen = function (context) {
    var self = this;
    var $editor = context.layoutInfo.editor;
    var $toolbar = context.layoutInfo.toolbar;
    var $editable = context.layoutInfo.editable;
    var $codable = context.layoutInfo.codable;

    var $window = $(window);
    var $scrollbar = $('html, body');
    var $clone;

    this.resizeTo = function (size) {
      $editable.css('height', size.h);
      $codable.css('height', size.h);
      if ($codable.data('cmeditor')) {
        $codable.data('cmeditor').setsize(null, size.h);
      }
    };

    this.onResize = function () {
      self.resizeTo({
        h: $window.height() - $toolbar.outerHeight()
      });
    };

    /**
     * toggle fullscreen
     */
    this.toggle = function () {
      $editor.toggleClass('fullscreen');
      if (this.isFullscreen()) {
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
        $window.on('resize', this.onResize).trigger('resize');
        $scrollbar.css('overflow', 'hidden');
      } else {
        // delete clone
        $clone.after($editor);
        $clone.remove();

        // remove fullscreen class
        $('.note-modal').removeClass('fullscreen-dialog');
        $('body').removeClass('note-fullscreen');
        $('.old-dialog-backdrop').removeClass('old-dialog-backdrop');
 
        $window.off('resize', this.onResize);
        this.resizeTo({ h: $editable.data('orgHeight') });
        $scrollbar.css('overflow', 'visible');
      }

      context.invoke('toolbar.updateFullscreen', this.isFullscreen());
    };

    this.isFullscreen = function () {
      return $editor.hasClass('fullscreen');
    };
  };

  return Fullscreen;
});
