define([
  'summernote/base/core/func',
  'summernote/base/core/list',
  'summernote/base/core/dom'
], function (func, list, dom) {
  var AirPopover = function (summernote) {
    var self = this;
    var ui = $.summernote.ui;

    var $note = summernote.layoutInfo.note;
    var $editingArea = summernote.layoutInfo.editingArea;
    var options = summernote.options;

    var $popover = ui.popover({
      className: 'note-air-popover'
    }).render().appendTo($editingArea);

    var AIR_MODE_POPOVER_X_OFFSET = 20;

    this.events = {
      'summernote.keyup summernote.mouseup summernote.scroll': function () {
        self.update();
      },
      'summernote.change': function (we, e) {
        self.hide();
      },
      'summernote.focusout': function (we, e) {
        if (!e.relatedTarget || !dom.ancestor(e.relatedTarget, func.eq($editingArea[0]))) {
          self.hide();
        }
      }
    };

    this.initialize = function () {
      if (!options.airMode) {
        return;
      }

      summernote.buildButtons($popover.find('.popover-content'), options.popover.air);
      dom.attachEvents($note, this.events);
    };

    this.destroy = function () {
      dom.detachEvents($note, this.events);
    };

    this.update = function () {
      var styleInfo = summernote.invoke('editor.currentStyle');
      if (styleInfo.range && !styleInfo.range.isCollapsed()) {
        var rect = list.last(styleInfo.range.getClientRects());
        if (rect) {
          var bnd = func.rect2bnd(rect);
          var posEditingArea = $editingArea.offset();
          $popover.css({
            display: 'block',
            left: Math.max(bnd.left + bnd.width / 2, 0) - posEditingArea.left - AIR_MODE_POPOVER_X_OFFSET,
            top: bnd.top + bnd.height - posEditingArea.top
          });
        }
      } else {
        $popover.hide();
      }
    };

    this.hide = function () {
      $popover.hide();
    };
  };

  return AirPopover;
});
