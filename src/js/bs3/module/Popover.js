define([
  'summernote/base/core/func',
  'summernote/base/core/list',
  'summernote/base/core/dom',
], function (func, list, dom) {
  var Popover = function (summernote) {
    var self = this;
    var ui = $.summernote.ui;

    var $note = summernote.layoutInfo.note;
    var $editingArea = summernote.layoutInfo.editingArea;

    var $popover = $('<div class="note-popover">');

    $popover.append(ui.popover({
      className: 'note-link-popover',
      children: [
        ui.buttonGroup([
          ui.button({
            contents: '<i class="fa fa-link"/>',
            click: summernote.createInvokeHandler('linkDialog.show')
          }),
          ui.button({
            contents: '<i class="fa fa-unlink"/>',
            click: summernote.createInvokeHandler('editor.unlink')
          })
        ])
      ]
    }).render());

    $popover.append(ui.popover({
      className: 'note-image-popover',
      children: [
        ui.buttonGroup([
          ui.button({
            contents: '<span class="note-fontsize-10">100%</span>',
            click: summernote.createInvokeHandler('editor.resize', '1')
          }),
          ui.button({
            contents: '<span class="note-fontsize-10">50%</span>',
            click: summernote.createInvokeHandler('editor.resize', '0.5')
          }),
          ui.button({
            contents: '<span class="note-fontsize-10">25%</span>',
            click: summernote.createInvokeHandler('editor.resize', '0.25')
          })
        ]),
        ui.buttonGroup([
          ui.button({
            contents: '<i class="fa fa-align-left"/>',
            click: summernote.createInvokeHandler('editor.floatMe', 'left')
          }),
          ui.button({
            contents: '<i class="fa fa-align-right"/>',
            click: summernote.createInvokeHandler('editor.floatMe', 'right')
          }),
          ui.button({
            contents: '<i class="fa fa-align-justify"/>',
            click: summernote.createInvokeHandler('editor.floatMe', 'none')
          })
        ]),
        ui.buttonGroup([
          ui.button({
            contents: '<i class="fa fa-square"/>'
          }),
          ui.button({
            contents: '<i class="fa fa-circle-o"/>'
          }),
          ui.button({
            contents: '<i class="fa fa-picture-o"/>'
          }),
          ui.button({
            contents: '<i class="fa fa-times"/>'
          })
        ]),
        ui.buttonGroup([
          ui.button({
            contents: '<i class="fa fa-trash-o"/>',
            click: summernote.createInvokeHandler('editor.removeMedia')
          })
        ])
      ]
    }).render());

    $editingArea.append($popover);

    this.initialize = function () {
      $note.on('summernote.keyup summernote.mouseup summernote.change', function (customEvent, event) {
        self.update(event.target);
      });
    };

    this.posFromPlaceholder = function (placeholder, isLeftTop) {
      var $placeholder = $(placeholder);
      var pos = $placeholder.position();
      var height = isLeftTop ? 0 : $placeholder.outerHeight(true); // include margin

      // popover below placeholder.
      return {
        left: pos.left,
        top: pos.top + height
      };
    };

    this.showPopover = function ($popover, pos) {
      $popover.css({
        display: 'block',
        left: pos.left,
        top: pos.top
      });
    };

    var PX_POPOVER_ARROW_OFFSET_X = 20;

    this.update = function (targetNode) {
      var $linkPopover = $popover.find('.note-link-popover');
      if (dom.isAnchor(targetNode)) {
        var $anchor = $linkPopover.find('a');
        var href = $(targetNode).attr('href');
        var target = $(targetNode).attr('target');
        $anchor.attr('href', href).html(href);
        if (!target) {
          $anchor.removeAttr('target');
        } else {
          $anchor.attr('target', '_blank');
        }
        this.showPopover($linkPopover, this.posFromPlaceholder(targetNode));
      } else {
        $linkPopover.hide();
      }

      var $imagePopover = $popover.find('.note-image-popover');
      if (dom.isImg(targetNode)) {
        this.showPopover($imagePopover, this.posFromPlaceholder(targetNode));
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
