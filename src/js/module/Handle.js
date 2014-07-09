define('summernote/module/Handle', function () {
  /**
   * Handle
   */
  var Handle = function () {
    /**
     * update handle
     * @param {jQuery} $handle
     * @param {Object} oStyle
     * @param {Boolean} isAirMode
     */
    this.update = function ($handle, oStyle, isAirMode) {
      var $selection = $handle.find('.note-control-selection');
      if (oStyle.image) {
        var $image = $(oStyle.image);
        var pos = isAirMode ? $image.offset() : $image.position();

        // include margin
        var szImage = {
          w: $image.outerWidth(true),
          h: $image.outerHeight(true)
        };

        $selection.css({
          display: 'block',
          left: pos.left,
          top: pos.top,
          width: szImage.w,
          height: szImage.h
        }).data('target', oStyle.image); // save current image element.
        var sSizing = szImage.w + 'x' + szImage.h;
        $selection.find('.note-control-selection-info').text(sSizing);
      } else {
        $selection.hide();
      }
    };

    this.hide = function ($handle) {
      $handle.children().hide();
    };
  };

  return Handle;
});
