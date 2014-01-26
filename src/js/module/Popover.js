define('module/Popover', function () {
  /**
   * Popover (http://getbootstrap.com/javascript/#popovers)
   */
  var Popover = function () {
    /**
     * show popover
     * @param {jQuery} popover
     * @param {Element} elPlaceholder - placeholder for popover
     */
    var showPopover = function ($popover, elPlaceholder) {
      var $placeholder = $(elPlaceholder);
      var pos = $placeholder.position(), height = $placeholder.height();

      // display popover below placeholder.
      $popover.css({
        display: 'block',
        left: pos.left,
        top: pos.top + height
      });
    };

    /**
     * update current state
     * @param {jQuery} $popover - popover container
     * @param {Object} oStyle - style object
     */
    this.update = function ($popover, oStyle) {
      var $linkPopover = $popover.find('.note-link-popover');

      if (oStyle.anchor) {
        var $anchor = $linkPopover.find('a');
        $anchor.attr('href', oStyle.anchor.href).html(oStyle.anchor.href);
        showPopover($linkPopover, oStyle.anchor);
      } else {
        $linkPopover.hide();
      }

      var $imagePopover = $popover.find('.note-image-popover');
      if (oStyle.image) {
        showPopover($imagePopover, oStyle.image);
      } else {
        $imagePopover.hide();
      }
    };

    /**
     * hide all popovers
     * @param {jQuery} $popover - popover contaienr
     */
    this.hide = function ($popover) {
      $popover.children().hide();
    };
  };

  return Popover;
});
