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
          return agent.isFontInstalled(name) ||
                 list.contains(options.fontNamesIgnoreCheck, name);
        });

        $toolbar.find('.dropdown-fontname li a').each(function () {
          // always compare string to avoid creating another func.
          var isChecked = ($(this).data('value') + '') === (fontName + '');
          this.className = isChecked ? 'checked' : '';
        });
        $toolbar.find('.note-current-fontname').text(fontName);
      }

      if (styleInfo['font-size']) {
        var fontSize = styleInfo['font-size'];
        $toolbar.find('.dropdown-fontsize li a').each(function () {
          // always compare with string to avoid creating another func.
          var isChecked = ($(this).data('value') + '') === (fontSize + '');
          this.className = isChecked ? 'checked' : '';
        });
        $toolbar.find('.note-current-fontsize').text(fontSize);
      }
    };

    this.initialize = function () {
      $note.on('summernote.keyup summernote.mouseup summernote.change', function () {
        self.updateCurrentStyle();
      });

      $toolbar.append(renderer.buttonGroup([
        renderer.button({
          className: 'dropdown-toggle',
          contents: '<i class="fa fa-magic" /> <span class="caret" />',
          tooltip: 'Style',
          data: {
            toggle: 'dropdown'
          }
        }),
        renderer.dropdown({
          className: 'dropdown-style',
          items: options.styleTags,
          click: function (event) {
            var value = $(event.target).data('value');
            summernote.invoke('editor.formatBlock', [value]);
          }
        })
      ]).build());

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
          className: 'dropdown-toggle',
          contents: '<span class="note-current-fontname" /> <span class="caret" />',
          tooltip: 'Font Family',
          data: {
            toggle: 'dropdown'
          }
        }),
        renderer.dropdownCheck({
          className: 'dropdown-fontname',
          items: options.fontNames.filter(function (name) {
            return agent.isFontInstalled(name) ||
                   list.contains(options.fontNamesIgnoreCheck, name);
          }),
          click: function (event) {
            var value = $(event.target).data('value');
            summernote.invoke('editor.fontName', [value]);
          }
        })
      ]).build());

      $toolbar.append(renderer.buttonGroup([
        renderer.button({
          className: 'dropdown-toggle',
          contents: '<span class="note-current-fontsize" /> <span class="caret" />',
          tooltip: 'Font Size',
          data: {
            toggle: 'dropdown'
          }
        }),
        renderer.dropdownCheck({
          className: 'dropdown-fontsize',
          items: options.fontSizes,
          click: function (event) {
            var value = $(event.target).data('value');
            summernote.invoke('editor.fontSize', [value]);
          }
        })
      ]).build());

      $toolbar.append(renderer.buttonGroup([
        renderer.button({
          contents: '<i class="fa fa-font note-recent-color"/>',
          tooltip: 'Recent Color',
          click: function (event) {
            summernote.invoke('editor.color', [$(event.target).data('value')]);
          },
          callback: function ($button) {
            var $recentColor = $button.find('.note-recent-color');
            $recentColor.css({
              'background-color': 'yellow'
            }).data('value', {
              backColor: 'yellow'
            });
          }
        }),
        renderer.button({
          className: 'dropdown-toggle',
          contents: '<span class="caret"/>',
          tooltip: 'More Color',
          data: {
            toggle: 'dropdown'
          }
        }),
        renderer.dropdown({
          items: [
            '<li>',
            '<div class="btn-group">',
            '  <div class="note-palette-title">background color</div>',
            '  <div class="note-color-reset" data-event="backColor" data-value="inherit">transparent</div>',
            '  <div class="note-holder" data-event="backColor"/>',
            '</div>',
            '<div class="btn-group">',
            '  <div class="note-palette-title">fore color</div>',
            '  <div class="note-color-reset" data-event="foreColor" data-value="inherit">reset to default</div>',
            '  <div class="note-holder" data-event="foreColor"/>',
            '</div>',
            '</li>'
          ].join(''),
          callback: function ($dropdown) {
            $dropdown.find('.note-holder').each(function () {
              var $holder = $(this);
              $holder.append(renderer.palette({
                colors: options.colors,
                eventName: $holder.data('event')
              }).build());
            });
          },
          click: function (event) {
            var $button = $(event.target);
            var eventName = $button.data('event');
            var value = $button.data('value');

            if (eventName && value) {
              var key = eventName === 'backColor' ? 'background-color' : 'color';
              var $color = $button.closest('.note-color').find('.note-recent-color');

              var colorInfo = $color.data('value');
              colorInfo[eventName] = value;
              $color.data('value', colorInfo)
                    .css(key, value);

              summernote.invoke('editor.' + eventName, [value]);
            }
          }
        })
      ], {
        className: 'note-color'
      }).build());

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
