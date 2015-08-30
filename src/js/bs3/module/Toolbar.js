define([
  'jquery'
], function ($) {
  var Toolbar = function (summernote) {
    var self = this;

    var renderer = $.summernote.renderer;
    var $toolbar = summernote.layoutInfo.toolbar;

    this.initialize = function () {
      var $fontStyle = renderer.buttonGroup([
        renderer.button({
          contents: '<i class="fa fa-bold"></i>',
          tooltip: 'Bold (⌘+B)',
          click: function () {
            summernote.invoke('editor.bold');
          }
        }),
        renderer.button({
          contents: '<i class="fa fa-italic"></i>',
          tooltip: 'Italic (⌘+I)',
          click: function () {
            summernote.invoke('editor.italic');
          }
        }),
        renderer.button({
          contents: '<i class="fa fa-underline"></i>',
          tooltip: 'Underline (⌘+U)',
          click: function () {
            summernote.invoke('editor.italic');
          }
        }),
        renderer.button({
          contents: '<i class="fa fa-eraser"></i>',
          tooltip: 'Remove Font Style (⌘+\\)',
          click: function () {
            summernote.invoke('editor.removeFormat');
          }
        })
      ]).build();

      $toolbar.append($fontStyle);
    };

    this.destory = function () {
      $toolbar.children().remove();
    };
  };

  return Toolbar;
});
