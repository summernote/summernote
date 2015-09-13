define([
  'summernote/base/core/func',
  'summernote/base/core/list',
  'summernote/base/core/dom'
], function (func, list, dom) {
  var ImagePopover = function (summernote) {
    var self = this;
    var ui = $.summernote.ui;

    var $note = summernote.layoutInfo.note;
    var $editingArea = summernote.layoutInfo.editingArea;

    var $popover = ui.popover({
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
            contents: '<i class="fa fa-trash-o"/>',
            click: summernote.createInvokeHandler('editor.removeMedia')
          })
        ])
      ]
    }).render();

    $editingArea.append($popover);

    this.initialize = function () {
      $note.on('summernote.keyup summernote.mouseup summernote.change', function (customEvent, event) {
        self.update(event.target);
      });
    };

    this.posFromPlaceholder = function (placeholder) {
      var $placeholder = $(placeholder);
      var pos = $placeholder.position();
      var height = $placeholder.outerHeight(true); // include margin

      // popover below placeholder.
      return {
        left: pos.left,
        top: pos.top + height
      };
    };

    this.update = function (target) {
      if (dom.isImg(target)) {
        var pos = this.posFromPlaceholder(target);
        $popover.css({
          display: 'block',
          left: pos.left,
          top: pos.top
        });

        summernote.invoke('editor.saveTarget', [target]);
      } else {
        $popover.hide();
      }
    };

    this.hide = function ($popover) {
      $popover.children().hide();
    };
  };

  return ImagePopover;
});
