define('summernote/module/Handle', function () {
  /**
   * Handle
   */
  var Handle = function () {
    /**
     * update handle
     * @param {jQuery} $handle
     * @param {Object} styleInfo
     * @param {Boolean} isAirMode
     */
    this.update = function ($handle, styleInfo, isAirMode) {
      var $selection = $handle.find('.note-control-selection');
      if (styleInfo.image || styleInfo.video) {
        var target = styleInfo.image ? styleInfo.image : styleInfo.video;
        var $element = $(target);
        
        var pos = isAirMode ? $element.offset() : $element.position();

        // include margin
        var elementSize = {
          w: $element.outerWidth(true),
          h: $element.outerHeight(true)
        };

        $selection.css({
          display: 'block',
          left: pos.left,
          top: pos.top,
          width: elementSize.w,
          height: elementSize.h
        }).data('target', target); // save current image element.
        var sizingText = elementSize.w + 'x' + elementSize.h;
        $selection.find('.note-control-selection-info').text(sizingText);
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
