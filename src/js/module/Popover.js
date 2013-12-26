define('module/Popover', function () {
  /**
   * Popover (http://getbootstrap.com/javascript/#popovers)
   */
  var Popover = function () {
    var showPopover = function ($popover, elPlaceholder) {
      var $placeholder = $(elPlaceholder);
      var pos = $placeholder.position(), height = $placeholder.height();
      $popover.css({
        display: 'block',
        left: pos.left,
        top: pos.top + height
      });
    };

    this.update = function ($popover, oStyle) {
      var $linkPopover = $popover.find('.note-link-popover'),
          $imagePopover = $popover.find('.note-image-popover');
      if (oStyle.anchor) {
        var $anchor = $linkPopover.find('a');
        $anchor.attr('href', oStyle.anchor.href).html(oStyle.anchor.href);
        showPopover($linkPopover, oStyle.anchor);
      } else {
        $linkPopover.hide();
      }

      if (oStyle.image) {
        showPopover($imagePopover, oStyle.image);
      } else {
        $imagePopover.hide();
      }
    };

    this.hide = function ($popover) {
      $popover.children().hide();
    };
  };

  return Popover;
});
