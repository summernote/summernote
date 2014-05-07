define([
  'summernote/core/func',
  'summernote/core/list',
  'summernote/module/Button'
], function (func, list, Button) {
  /**
   * Popover (http://getbootstrap.com/javascript/#popovers)
   */
  var Popover = function () {
    var button = new Button();

    /**
     * show popover
     * @param {jQuery} popover
     * @param {Element} elPlaceholder - placeholder for popover
     */
    var showPopover = function ($popover, elPlaceholder) {
      var $placeholder = $(elPlaceholder);
      var pos = $placeholder.position();

      // include margin
      var height = $placeholder.outerHeight(true);

      // display popover below placeholder.
      $popover.css({
        display: 'block',
        left: pos.left,
        top: pos.top + height
      });
    };

    var PX_POPOVER_ARROW_OFFSET_X = 20;

    /**
     * update current state
     * @param {jQuery} $popover - popover container
     * @param {Object} oStyle - style object
     * @param {Boolean} isAirMode
     */
    this.update = function ($popover, oStyle, isAirMode) {
      button.update($popover, oStyle);

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

      if (isAirMode) {
        var $airPopover = $popover.find('.note-air-popover');
        if (!oStyle.range.isCollapsed()) {
          var bnd = func.rect2bnd(list.last(oStyle.range.getClientRects()));
          $airPopover.css({
            display: 'block',
            left: Math.max(bnd.left + bnd.width / 2 - PX_POPOVER_ARROW_OFFSET_X, 0),
            top: bnd.top + bnd.height
          });
        } else {
          $airPopover.hide();
        }
      }
    };

    this.updateRecentColor = function (elBtn, sEvent, sValue) {
      button.updateRecentColor(elBtn, sEvent, sValue);
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
