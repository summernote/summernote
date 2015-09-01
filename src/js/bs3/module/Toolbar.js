define([
  'jquery'
], function ($) {
  var Toolbar = function (summernote) {
    var self = this;
    var renderer = $.summernote.renderer;

    var $note = summernote.layoutInfo.note;
    var $toolbar = summernote.layoutInfo.toolbar;

    this.initialize = function () {
      $note.on('summernote.keyup summernote.mouseup', function () {
        var styleInfo = summernote.invoke('editor.currentStyle');

        self.updateBtnStates({
          '.note-btn-bold': function () {
            return styleInfo['font-bold'] === 'bold';
          },
          '.note-btn-italic': function () {
            return styleInfo['font-italic'] === 'italic';
          },
          '.note-btn-underline': function () {
            return styleInfo['font-underline'] === 'underline';
          }
        });
      });

      $toolbar.append(renderer.buttonGroup([
        renderer.button({
          className: 'note-btn-bold',
          contents: '<i class="fa fa-bold"></i>',
          tooltip: 'Bold (⌘+B)',
          click: function () {
            summernote.invoke('editor.bold');
          }
        }),
        renderer.button({
          className: 'note-btn-italic',
          contents: '<i class="fa fa-italic"></i>',
          tooltip: 'Italic (⌘+I)',
          click: function () {
            summernote.invoke('editor.italic');
          }
        }),
        renderer.button({
          className: 'note-btn-underline',
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
      ]).build());
    };

    this.destory = function () {
      $toolbar.children().remove();
    };

    this.updateBtnStates = function (infos) {
      $.each(infos, function (selector, pred) {
        $toolbar.find(selector).toggleClass('active', pred());
      });
    };
  };

  return Toolbar;
});
