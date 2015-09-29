define([
  'summernote/base/core/func',
  'summernote/base/core/list'
], function (func, list) {
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

    this.initialize = function () {
      if (!options.airMode) {
        return;
      }
      summernote.buildButtons($popover.find('.popover-content'), options.popover.air);

      $note.on('summernote.keyup summernote.mouseup summernote.change', function () {
        self.update();
      }).on('summernote.scroll', function () {
        self.update();
      });
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
            left: Math.max(bnd.left + bnd.width / 2, 0) - AIR_MODE_POPOVER_X_OFFSET,
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
