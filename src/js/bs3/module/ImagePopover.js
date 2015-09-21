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
    var lang = summernote.options.langInfo;

    var $popover = ui.popover({
      className: 'note-image-popover',
      children: [
        ui.buttonGroup([
          ui.button({
            contents: '<span class="note-fontsize-10">100%</span>',
            tooltip: lang.image.resizeFull,
            click: summernote.createInvokeHandler('editor.resize', '1')
          }),
          ui.button({
            contents: '<span class="note-fontsize-10">50%</span>',
            tooltip: lang.image.resizeHalf,
            click: summernote.createInvokeHandler('editor.resize', '0.5')
          }),
          ui.button({
            contents: '<span class="note-fontsize-10">25%</span>',
            tooltip: lang.image.resizeQuarter,
            click: summernote.createInvokeHandler('editor.resize', '0.25')
          })
        ]),
        ui.buttonGroup([
          ui.button({
            contents: '<i class="fa fa-align-left"/>',
            tooltip: lang.image.floatLeft,
            click: summernote.createInvokeHandler('editor.floatMe', 'left')
          }),
          ui.button({
            contents: '<i class="fa fa-align-right"/>',
            tooltip: lang.image.floatRight,
            click: summernote.createInvokeHandler('editor.floatMe', 'right')
          }),
          ui.button({
            contents: '<i class="fa fa-align-justify"/>',
            tooltip: lang.image.floatNone,
            click: summernote.createInvokeHandler('editor.floatMe', 'none')
          })
        ]),
        ui.buttonGroup([
          ui.button({
            contents: '<i class="fa fa-trash-o"/>',
            tooltip: lang.image.remove,
            click: summernote.createInvokeHandler('editor.removeMedia')
          })
        ])
      ]
    }).render();

    $editingArea.append($popover);

    this.initialize = function () {
      $note.on('summernote.keyup summernote.mouseup summernote.change', function (customEvent, event) {
        self.update(event.target);
      }).on('summernote.scroll', function () {
        self.update(summernote.invoke('editor.restoreTarget'));
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

        summernote.invoke('editor.saveTarget', target);
      } else {
        $popover.hide();
      }
    };

    this.hide = function () {
      $popover.hide();
    };
  };

  return ImagePopover;
});
