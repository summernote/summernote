define([
  'summernote/base/core/func',
  'summernote/base/core/list',
  'summernote/base/core/dom'
], function (func, list, dom) {
  var LinkPopover = function (summernote) {
    var self = this;
    var ui = $.summernote.ui;

    var $note = summernote.layoutInfo.note;
    var $editingArea = summernote.layoutInfo.editingArea;
    var options = summernote.options;

    var $popover = ui.popover({
      className: 'note-link-popover',
      callback: function ($node) {
        var $content = $node.find('.popover-content');
        $content.prepend('<span><a target="_blank"></a>&nbsp;</span>');
      }
    }).render().appendTo($editingArea);

    this.events = {
      'summernote.keyup summernote.mouseup summernote.change summernote.scroll': function () {
        self.update();
      }
    };

    this.initialize = function () {
      summernote.buildButtons($popover.find('.popover-content'), options.popover.link);

      dom.attachEvents($note, this.events);
    };

    this.destroy = function () {
      dom.detachEvents($note, this.events);
    };

    this.update = function () {
      var rng = summernote.invoke('editor.createRange');
      if (rng.isCollapsed() && rng.isOnAnchor()) {
        var anchor = dom.ancestor(rng.sc, dom.isAnchor);
        var href = $(anchor).attr('href');
        $popover.find('a').attr('href', href).html(href);

        var pos = dom.posFromPlaceholder(anchor);
        $popover.css({
          display: 'block',
          left: pos.left,
          top: pos.top
        });
      } else {
        $popover.hide();
      }
    };

    this.hide = function () {
      $popover.hide();
    };
  };

  return LinkPopover;
});
