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
     * returns position from placeholder
     * @param {Element} placeholder
     * @param {Boolean} isAirMode
     */
    var posFromPlaceholder = function (placeholder, isAirMode) {
      var $placeholder = $(placeholder);
      var pos = isAirMode ? $placeholder.offset() : $placeholder.position();
      var height = $placeholder.outerHeight(true); // include margin

      // popover below placeholder.
      return {
        left: pos.left,
        top: pos.top + height
      };
    };

    /**
     * show popover
     * @param {jQuery} popover
     * @param {Position} pos
     */
    var showPopover = function ($popover, pos) {
      $popover.css({
        display: 'block',
        left: pos.left,
        top: pos.top
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
        var href = $(oStyle.anchor).attr('href');
        $anchor.attr('href', href).html(href);
        showPopover($linkPopover, posFromPlaceholder(oStyle.anchor, isAirMode));
      } else {
        $linkPopover.hide();
      }

      var $imagePopover = $popover.find('.note-image-popover');
      if (oStyle.image) {
        showPopover($imagePopover, posFromPlaceholder(oStyle.image, isAirMode));
      } else {
        $imagePopover.hide();
      }

      var $airPopover = $popover.find('.note-air-popover');
      if (isAirMode && !oStyle.range.isCollapsed()) {
        var bnd = func.rect2bnd(list.last(oStyle.range.getClientRects()));
        showPopover($airPopover, {
          left: Math.max(bnd.left + bnd.width / 2 - PX_POPOVER_ARROW_OFFSET_X, 0),
          top: bnd.top + bnd.height
        });
      } else {
        $airPopover.hide();
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
