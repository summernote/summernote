define([
  'jquery',
  'summernote/base/core/list',
  'summernote/base/core/agent'
], function ($, list, agent) {
  var Toolbar = function (summernote) {
    var self = this;
    var renderer = $.summernote.renderer;

    var $note = summernote.layoutInfo.note;
    var $toolbar = summernote.layoutInfo.toolbar;
    var options = summernote.options;

    this.updateCurrentStyle = function () {
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

      if (styleInfo['font-family']) {
        var fontNames = styleInfo['font-family'].split(',').map(function (name) {
          return name.replace(/[\'\"]/g, '')
                     .replace(/\s+$/, '')
                     .replace(/^\s+/, '');
        });
        var fontName = list.find(fontNames, function (name) {
          return agent.isFontInstalled(name);
        });

        $toolbar.find('.dropdown-fontname li a').each(function () {
          // always compare string to avoid creating another func.
          var isChecked = ($(this).data('value') + '') === (fontName + '');
          this.className = isChecked ? 'checked' : '';
        });
        $toolbar.find('.note-current-fontname').text(fontName);
      }
    };

    this.initialize = function () {
      $note.on('summernote.keyup summernote.mouseup', function () {
        self.updateCurrentStyle();
      });

      $toolbar.append(renderer.buttonGroup([
        renderer.button({
          className: 'note-btn-bold',
          contents: '<i class="fa fa-bold" />',
          tooltip: 'Bold (⌘+B)',
          click: function () {
            summernote.invoke('editor.bold');
          }
        }),
        renderer.button({
          className: 'note-btn-italic',
          contents: '<i class="fa fa-italic" />',
          tooltip: 'Italic (⌘+I)',
          click: function () {
            summernote.invoke('editor.italic');
          }
        }),
        renderer.button({
          className: 'note-btn-underline',
          contents: '<i class="fa fa-underline" />',
          tooltip: 'Underline (⌘+U)',
          click: function () {
            summernote.invoke('editor.italic');
          }
        }),
        renderer.button({
          contents: '<i class="fa fa-eraser" />',
          tooltip: 'Remove Font Style (⌘+\\)',
          click: function () {
            summernote.invoke('editor.removeFormat');
          }
        })
      ]).build());

      $toolbar.append(renderer.buttonGroup([
        renderer.button({
          contents: '<span class="note-current-fontname" /> <span class="caret" />',
          className: 'dropdown-toggle',
          data: {
            toggle: 'dropdown'
          }
        }),
        renderer.dropdownMenu({
          className: 'dropdown-fontname',
          items: options.fontNames,
          click: function (event) {
            var value = $(event.target).data('value');
            summernote.invoke('editor.fontName', [value]);
          }
        })
      ]).build());

      this.updateCurrentStyle();
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
