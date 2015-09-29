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
        $node.find('.popover-content').prepend('<span><a target="_blank"></a>&nbsp;</span>')
      }
    }).render().appendTo($editingArea);

    this.initialize = function () {
      summernote.buildButtons($popover.find('.popover-content'), options.popover.link);
      $note.on('summernote.keyup summernote.mouseup summernote.change', function (customEvent, event) {
        self.update(event.target);
      }).on('summernote.scroll', function () {
        self.update(summernote.invoke('editor.restoreTarget'));
      });
    };

    this.update = function (targetNode) {
      if (dom.isAnchor(targetNode)) {
        var $anchor = $popover.find('a');
        var href = $(targetNode).attr('href');
        var target = $(targetNode).attr('target');
        $anchor.attr('href', href).html(href);

        var pos = dom.posFromPlaceholder(targetNode);
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
