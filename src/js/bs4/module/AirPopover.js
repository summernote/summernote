define([
  'summernote/base/core/func',
  'summernote/base/core/list',
  'summernote/base/core/dom'
], function (func, list, dom) {
  var AirPopover = function (context) {
    var self = this;
    var ui = $.summernote.ui;

    var $note = context.layoutInfo.note;
    var $editingArea = context.layoutInfo.editingArea;
    var options = context.options;

    var AIR_MODE_POPOVER_X_OFFSET = 20;

    this.events = {
      'summernote.keyup summernote.mouseup summernote.scroll': function () {
        self.update();
      },
      'summernote.change': function () {
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

      this.$popover = ui.popover({
        className: 'note-air-popover'
      }).render().appendTo('body');

      context.buildButtons(this.$popover.find('.popover-content'), options.popover.air);
      dom.attachEvents($note, this.events);
    };

    this.destroy = function () {
      if (!options.airMode) {
        return;
      }

      this.$popover.remove();
      dom.detachEvents($note, this.events);
    };

    this.update = function () {
      var styleInfo = context.invoke('editor.currentStyle');
      if (styleInfo.range && !styleInfo.range.isCollapsed()) {
        var rect = list.last(styleInfo.range.getClientRects());
        if (rect) {
          var bnd = func.rect2bnd(rect);
          this.$popover.css({
            display: 'block',
            left: Math.max(bnd.left + bnd.width / 2, 0) - AIR_MODE_POPOVER_X_OFFSET,
            top: bnd.top + bnd.height
          });
        }
      } else {
        this.hide();
      }
    };

    this.hide = function () {
      this.$popover.hide();
    };
  };

  return AirPopover;
});
