define([
  'jquery',
  'summernote/base/core/func',
  'summernote/base/core/list',
  'summernote/base/core/agent'
], function ($, func, list, agent) {
  var Toolbar = function (summernote) {
    var self = this;
    var ui = $.summernote.ui;

    var $note = summernote.layoutInfo.note;
    var $toolbar = summernote.layoutInfo.toolbar;
    var options = summernote.options;
    var lang = options.langInfo;

    var invertedKeyMap = func.invertObject(options.keyMap[agent.isMac ? 'mac' : 'pc']);

    this.representShortcut = function (editorMethod) {
      var shortcut = invertedKeyMap[editorMethod];
      if (agent.isMac) {
        shortcut = shortcut.replace('CMD', '⌘').replace('SHIFT', '⇧');
      }

      shortcut = shortcut.replace('BACKSLASH', '\\')
                         .replace('SLASH', '/')
                         .replace('LEFTBRACKET', '[')
                         .replace('RIGHTBRACKET', ']');

      return ' (' + shortcut + ')';
    };

    this.initialize = function () {
      $note.on('summernote.keyup summernote.mouseup summernote.change', function () {
        self.updateCurrentStyle();
      });

      $toolbar.append(ui.buttonGroup([
        ui.button({
          className: 'dropdown-toggle',
          contents: '<i class="fa fa-magic"/> <span class="caret"/>',
          tooltip: lang.style.style,
          data: {
            toggle: 'dropdown'
          }
        }),
        ui.dropdown({
          className: 'dropdown-style',
          items: options.styleTags,
          click: summernote.createInvokeHandler('editor.formatBlock')
        })
      ]).render());

      $toolbar.append(ui.buttonGroup([
        ui.button({
          className: 'note-btn-bold',
          contents: '<i class="fa fa-bold"/>',
          tooltip: lang.font.bold + this.representShortcut('bold'),
          click: summernote.createInvokeHandler('editor.bold')
        }),
        ui.button({
          className: 'note-btn-italic',
          contents: '<i class="fa fa-italic"/>',
          tooltip: lang.font.italic + this.representShortcut('italic'),
          click: summernote.createInvokeHandler('editor.italic')
        }),
        ui.button({
          className: 'note-btn-underline',
          contents: '<i class="fa fa-underline"/>',
          tooltip: lang.font.underline + this.representShortcut('underline'),
          click: summernote.createInvokeHandler('editor.underline')
        }),
        ui.button({
          contents: '<i class="fa fa-eraser"/>',
          tooltip: lang.font.clear + this.representShortcut('removeFormat'),
          click: summernote.createInvokeHandler('editor.removeFormat')
        })
      ]).render());

      $toolbar.append(ui.buttonGroup([
        ui.button({
          className: 'dropdown-toggle',
          contents: '<span class="note-current-fontname"/> <span class="caret"/>',
          tooltip: lang.font.name,
          data: {
            toggle: 'dropdown'
          }
        }),
        ui.dropdownCheck({
          className: 'dropdown-fontname',
          items: options.fontNames.filter(function (name) {
            return agent.isFontInstalled(name) ||
                   list.contains(options.fontNamesIgnoreCheck, name);
          }),
          click: summernote.createInvokeHandler('editor.fontName')
        })
      ]).render());

      $toolbar.append(ui.buttonGroup([
        ui.button({
          className: 'dropdown-toggle',
          contents: '<span class="note-current-fontsize"/> <span class="caret"/>',
          tooltip: lang.font.size,
          data: {
            toggle: 'dropdown'
          }
        }),
        ui.dropdownCheck({
          className: 'dropdown-fontsize',
          items: options.fontSizes,
          click: summernote.createInvokeHandler('editor.fontSize')
        })
      ]).render());

      $toolbar.append(ui.buttonGroup({
        className: 'note-color',
        children: [
          ui.button({
            contents: '<i class="fa fa-font note-recent-color"/>',
            tooltip: lang.color.recent,
            click: summernote.createInvokeHandler('editor.color'),
            callback: function ($button) {
              var $recentColor = $button.find('.note-recent-color');
              $recentColor.css({
                'background-color': 'yellow'
              }).data('value', {
                backColor: 'yellow'
              });
            }
          }),
          ui.button({
            className: 'dropdown-toggle',
            contents: '<span class="caret"/>',
            tooltip: lang.color.more,
            data: {
              toggle: 'dropdown'
            }
          }),
          ui.dropdown({
            items: [
              '<li>',
              '<div class="btn-group">',
              '  <div class="note-palette-title">' + lang.color.background + '</div>',
              '  <div class="note-color-reset" data-event="backColor" data-value="inherit">' + lang.color.transparent + '</div>',
              '  <div class="note-holder" data-event="backColor"/>',
              '</div>',
              '<div class="btn-group">',
              '  <div class="note-palette-title">' + lang.color.foreground + '</div>',
              '  <div class="note-color-reset" data-event="foreColor" data-value="inherit">' + lang.color.resetToDefault + '</div>',
              '  <div class="note-holder" data-event="foreColor"/>',
              '</div>',
              '</li>'
            ].join(''),
            callback: function ($dropdown) {
              $dropdown.find('.note-holder').each(function () {
                var $holder = $(this);
                $holder.append(ui.palette({
                  colors: options.colors,
                  eventName: $holder.data('event')
                }).render());
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
                $color.data('value', colorInfo).css(key, value);

                summernote.invoke('editor.' + eventName, value);
              }
            }
          })
        ]
      }).render());

      $toolbar.append(ui.buttonGroup({
        className: 'note-para',
        children: [
          ui.button({
            contents: '<i class="fa fa-list-ul"/>',
            tooltip: lang.lists.unordered + this.representShortcut('insertUnorderedList'),
            click: summernote.createInvokeHandler('editor.insertUnorderedList')
          }),
          ui.button({
            contents: '<i class="fa fa-list-ol"/>',
            tooltip: lang.lists.ordered + this.representShortcut('insertOrderedList'),
            click: summernote.createInvokeHandler('editor.insertOrderedList')
          }),
          ui.buttonGroup([
            ui.button({
              className: 'dropdown-toggle',
              contents: '<i class="fa fa-align-left"/> <span class="caret"/>',
              tooltip: lang.paragraph.paragraph,
              data: {
                toggle: 'dropdown'
              }
            }),
            ui.dropdown([
              ui.buttonGroup({
                className: 'note-align',
                children: [
                  ui.button({
                    contents: '<i class="fa fa-align-left"/>',
                    tooltip: lang.paragraph.left + this.representShortcut('justifyLeft'),
                    click: summernote.createInvokeHandler('editor.justifyLeft')
                  }),
                  ui.button({
                    contents: '<i class="fa fa-align-center"/>',
                    tooltip: lang.paragraph.center + this.representShortcut('justifyCenter'),
                    click: summernote.createInvokeHandler('editor.justifyCenter')
                  }),
                  ui.button({
                    contents: '<i class="fa fa-align-right"/>',
                    tooltip: lang.paragraph.right + this.representShortcut('justifyRight'),
                    click: summernote.createInvokeHandler('editor.justifyRight')
                  }),
                  ui.button({
                    contents: '<i class="fa fa-align-justify"/>',
                    tooltip: lang.paragraph.justify + this.representShortcut('justifyFull'),
                    click: summernote.createInvokeHandler('editor.justifyFull')
                  })
                ]
              }),
              ui.buttonGroup({
                className: 'note-list',
                children: [
                  ui.button({
                    contents: '<i class="fa fa-outdent"/>',
                    tooltip: lang.paragraph.outdent + this.representShortcut('outdent'),
                    click: summernote.createInvokeHandler('editor.outdent')
                  }),
                  ui.button({
                    contents: '<i class="fa fa-indent"/>',
                    tooltip: lang.paragraph.indent + this.representShortcut('indent'),
                    click: summernote.createInvokeHandler('editor.indent')
                  })
                ]
              })
            ])
          ])
        ]
      }).render());

      $toolbar.append(ui.buttonGroup([
        ui.button({
          className: 'dropdown-toggle',
          contents: '<i class="fa fa-text-height"/> <span class="caret"/>',
          tooltip: lang.font.height,
          data: {
            toggle: 'dropdown'
          }
        }),
        ui.dropdownCheck({
          items: options.lineHeights,
          className: 'dropdown-line-height',
          click: summernote.createInvokeHandler('editor.lineHeight')
        })
      ]).render());

      $toolbar.append(ui.buttonGroup([
        ui.button({
          className: 'dropdown-toggle',
          contents: '<i class="fa fa-table"/> <span class="caret"/>',
          tooltip: lang.table.table,
          data: {
            toggle: 'dropdown'
          }
        }),
        ui.dropdown({
          className: 'note-table',
          items: [
            '<div class="note-dimension-picker">',
            '  <div class="note-dimension-picker-mousecatcher" data-event="insertTable" data-value="1x1"/>',
            '  <div class="note-dimension-picker-highlighted"/>',
            '  <div class="note-dimension-picker-unhighlighted"/>',
            '</div>',
            '<div class="note-dimension-display">1 x 1</div>'
          ].join('')
        })
      ], {
        callback: function ($node) {
          var $catcher = $node.find('.note-dimension-picker-mousecatcher');
          $catcher.css({
            width: options.insertTableMaxSize.col + 'em',
            height: options.insertTableMaxSize.row + 'em'
          }).click(summernote.createInvokeHandler('editor.insertTable'))
            .on('mousemove', self.tableMoveHandler);
        }
      }).render());

      $toolbar.append(ui.buttonGroup([
        ui.button({
          contents: '<i class="fa fa-link"/>',
          tooltip: lang.link.link,
          click: summernote.createInvokeHandler('linkDialog.show')
        }),
        ui.button({
          contents: '<i class="fa fa-picture-o"/>',
          tooltip: lang.image.image,
          click: summernote.createInvokeHandler('imageDialog.show')
        }),
        ui.button({
          contents: '<i class="fa fa-minus"/>',
          tooltip: lang.hr.insert + this.representShortcut('insertHorizontalRule'),
          click: summernote.createInvokeHandler('editor.insertHorizontalRule')
        })
      ]).render());

      $toolbar.append(ui.buttonGroup([
        ui.button({
          className: 'btn-fullscreen',
          contents: '<i class="fa fa-arrows-alt"/>',
          tooltip: lang.options.fullscreen,
          click: summernote.createInvokeHandler('fullscreen.toggle')
        }),
        ui.button({
          className: 'btn-codeview',
          contents: '<i class="fa fa-code"/>',
          tooltip: lang.options.codeview,
          click: summernote.createInvokeHandler('codeview.toggle')
        })
      ]).render());

      this.updateCurrentStyle();
    };

    this.destroy = function () {
      $toolbar.children().remove();
    };

    this.updateCurrentStyle = function () {
      var styleInfo = summernote.invoke('editor.currentStyle');
      this.updateBtnStates({
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

      if (styleInfo['line-height']) {
        var lineHeight = styleInfo['line-height'];
        $toolbar.find('.dropdown-line-height li a').each(function () {
          // always compare with string to avoid creating another func.
          var isChecked = ($(this).data('value') + '') === (lineHeight + '');
          this.className = isChecked ? 'checked' : '';
        });
      }
    };

    this.updateBtnStates = function (infos) {
      $.each(infos, function (selector, pred) {
        $toolbar.find(selector).toggleClass('active', pred());
      });
    };

    this.tableMoveHandler = function (event) {
      var PX_PER_EM = 18;
      var $picker = $(event.target.parentNode); // target is mousecatcher
      var $dimensionDisplay = $picker.next();
      var $catcher = $picker.find('.note-dimension-picker-mousecatcher');
      var $highlighted = $picker.find('.note-dimension-picker-highlighted');
      var $unhighlighted = $picker.find('.note-dimension-picker-unhighlighted');

      var posOffset;
      // HTML5 with jQuery - e.offsetX is undefined in Firefox
      if (event.offsetX === undefined) {
        var posCatcher = $(event.target).offset();
        posOffset = {
          x: event.pageX - posCatcher.left,
          y: event.pageY - posCatcher.top
        };
      } else {
        posOffset = {
          x: event.offsetX,
          y: event.offsetY
        };
      }

      var dim = {
        c: Math.ceil(posOffset.x / PX_PER_EM) || 1,
        r: Math.ceil(posOffset.y / PX_PER_EM) || 1
      };

      $highlighted.css({ width: dim.c + 'em', height: dim.r + 'em' });
      $catcher.data('value', dim.c + 'x' + dim.r);

      if (3 < dim.c && dim.c < options.insertTableMaxSize.col) {
        $unhighlighted.css({ width: dim.c + 1 + 'em'});
      }

      if (3 < dim.r && dim.r < options.insertTableMaxSize.row) {
        $unhighlighted.css({ height: dim.r + 1 + 'em'});
      }

      $dimensionDisplay.html(dim.c + ' x ' + dim.r);
    };

    this.updateFullscreen = function (isFullscreen) {
      $toolbar.find('.btn-fullscreen').toggleClass('active', isFullscreen);
    };

    this.updateCodeview = function (isCodeview) {
      $toolbar.find('.btn-codeview').toggleClass('active', isCodeview);
      if (isCodeview) {
        this.deactivate();
      } else {
        this.activate();
      }
    };

    this.activate = function () {
      $toolbar.find('button')
              .not('.btn-codeview')
              .removeClass('disabled');
    };

    this.deactivate = function () {
      $toolbar.find('button')
              .not('.btn-codeview')
              .addClass('disabled');
    };
  };

  return Toolbar;
});
