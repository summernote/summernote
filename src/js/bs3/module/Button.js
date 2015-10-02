define([
  'jquery',
  'summernote/base/core/func',
  'summernote/base/core/list',
  'summernote/base/core/agent'
], function ($, func, list, agent) {
  var Button = function (context) {
    var self = this;
    var ui = $.summernote.ui;

    var $toolbar = context.layoutInfo.toolbar;
    var options = context.options;
    var lang = options.langInfo;

    var invertedKeyMap = func.invertObject(options.keyMap[agent.isMac ? 'mac' : 'pc']);

    var representShortcut = this.representShortcut = function (editorMethod) {
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
      this.addToolbarButtons();
      this.addImagePopoverButtons();
      this.addLinkPopoverButtons();
    };

    this.addToolbarButtons = function () {
      context.addButton('style', function () {
        return ui.buttonGroup([
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
            items: context.options.styleTags,
            click: context.createInvokeHandler('editor.formatBlock')
          })
        ]).render();
      });

      context.addButton('bold', function () {
        return ui.button({
          className: 'note-btn-bold',
          contents: '<i class="fa fa-bold"/>',
          tooltip: lang.font.bold + representShortcut('bold'),
          click: context.createInvokeHandler('editor.bold')
        }).render();
      });

      context.addButton('italic', function () {
        return ui.button({
          className: 'note-btn-italic',
          contents: '<i class="fa fa-italic"/>',
          tooltip: lang.font.italic + representShortcut('italic'),
          click: context.createInvokeHandler('editor.italic')
        }).render();
      });

      context.addButton('underline', function () {
        return ui.button({
          className: 'note-btn-underline',
          contents: '<i class="fa fa-underline"/>',
          tooltip: lang.font.underline + representShortcut('underline'),
          click: context.createInvokeHandler('editor.underline')
        }).render();
      });

      context.addButton('clear', function () {
        return ui.button({
          contents: '<i class="fa fa-eraser"/>',
          tooltip: lang.font.clear + representShortcut('removeFormat'),
          click: context.createInvokeHandler('editor.removeFormat')
        }).render();
      });

      context.addButton('fontname', function () {
        return ui.buttonGroup([
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
            click: context.createInvokeHandler('editor.fontName')
          })
        ]).render();
      });

      context.addButton('fontsize', function () {
        return ui.buttonGroup([
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
            click: context.createInvokeHandler('editor.fontSize')
          })
        ]).render();
      });

      context.addButton('color', function () {
        return ui.buttonGroup({
          className: 'note-color',
          children: [
            ui.button({
              className : 'note-current-color-button',
              contents: '<i class="fa fa-font note-recent-color"/>',
              tooltip: lang.color.recent,
              click: context.createInvokeHandler('editor.color'),
              callback: function ($button) {
                var $recentColor = $button.find('.note-recent-color');
                $recentColor.css({
                  'background-color': 'yellow'
                });

                $button.data('value', {
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
                  var $currentButton = $button.closest('.note-color').find('.note-current-color-button');

                  var colorInfo = $currentButton.data('value');
                  colorInfo[eventName] = value;
                  $color.css(key, value);
                  $currentButton.data('value', colorInfo);

                  context.invoke('editor.' + eventName, value);
                }
              }
            })
          ]
        }).render();
      });

      context.addButton('ol',  function () {
        return ui.button({
          contents: '<i class="fa fa-list-ul"/>',
          tooltip: lang.lists.unordered + representShortcut('insertUnorderedList'),
          click: context.createInvokeHandler('editor.insertUnorderedList')
        }).render();
      });

      context.addButton('ul', function () {
        return ui.button({
          contents: '<i class="fa fa-list-ol"/>',
          tooltip: lang.lists.ordered + representShortcut('insertOrderedList'),
          click:  context.createInvokeHandler('editor.insertOrderedList')
        }).render();
      });

      context.addButton('paragraph', function () {
        return ui.buttonGroup([
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
                  tooltip: lang.paragraph.left + representShortcut('justifyLeft'),
                  click: context.createInvokeHandler('editor.justifyLeft')
                }),
                ui.button({
                  contents: '<i class="fa fa-align-center"/>',
                  tooltip: lang.paragraph.center + representShortcut('justifyCenter'),
                  click: context.createInvokeHandler('editor.justifyCenter')
                }),
                ui.button({
                  contents: '<i class="fa fa-align-right"/>',
                  tooltip: lang.paragraph.right + representShortcut('justifyRight'),
                  click: context.createInvokeHandler('editor.justifyRight')
                }),
                ui.button({
                  contents: '<i class="fa fa-align-justify"/>',
                  tooltip: lang.paragraph.justify + representShortcut('justifyFull'),
                  click: context.createInvokeHandler('editor.justifyFull')
                })
              ]
            }),
            ui.buttonGroup({
              className: 'note-list',
              children: [
                ui.button({
                  contents: '<i class="fa fa-outdent"/>',
                  tooltip: lang.paragraph.outdent + representShortcut('outdent'),
                  click: context.createInvokeHandler('editor.outdent')
                }),
                ui.button({
                  contents: '<i class="fa fa-indent"/>',
                  tooltip: lang.paragraph.indent + representShortcut('indent'),
                  click: context.createInvokeHandler('editor.indent')
                })
              ]
            })
          ])
        ]).render();
      });

      context.addButton('height', function () {
        return ui.buttonGroup([
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
            click: context.createInvokeHandler('editor.lineHeight')
          })
        ]).render();
      });

      context.addButton('table', function () {
        return ui.buttonGroup([
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
            }).click(context.createInvokeHandler('editor.insertTable'))
              .on('mousemove', self.tableMoveHandler);
          }
        }).render();
      });

      context.addButton('link', function () {
        return ui.button({
          contents: '<i class="fa fa-link"/>',
          tooltip: lang.link.link,
          click: context.createInvokeHandler('linkDialog.show')
        }).render();
      });

      context.addButton('picture', function () {
        return ui.button({
          contents: '<i class="fa fa-picture-o"/>',
          tooltip: lang.image.image,
          click: context.createInvokeHandler('imageDialog.show')
        }).render();
      });

      context.addButton('video', function () {
        return ui.button({
          contents: '<i class="fa fa-youtube-play"/>',
          tooltip: lang.video.video,
          click: context.createInvokeHandler('videoDialog.show')
        }).render();
      });

      context.addButton('hr', function () {
        return ui.button({
          contents: '<i class="fa fa-minus"/>',
          tooltip: lang.hr.insert + representShortcut('insertHorizontalRule'),
          click: context.createInvokeHandler('editor.insertHorizontalRule')
        }).render();
      });

      context.addButton('fullscreen', function () {
        return ui.button({
          className: 'btn-fullscreen',
          contents: '<i class="fa fa-arrows-alt"/>',
          tooltip: lang.options.fullscreen,
          click: context.createInvokeHandler('fullscreen.toggle')
        }).render();
      });

      context.addButton('codeview', function () {
        return ui.button({
          className: 'btn-codeview',
          contents: '<i class="fa fa-code"/>',
          tooltip: lang.options.codeview,
          click: context.createInvokeHandler('codeview.toggle')
        }).render();
      });

      context.addButton('help', function () {
        return ui.button({
          contents: '<i class="fa fa-question"/>',
          tooltip: lang.options.help,
          click: context.createInvokeHandler('helpDialog.show')
        }).render();
      });

      context.addButton('specialchar', function () {
        return ui.button({
          contents: '<i class="fa fa-font fa-flip-vertical"/>',
          tooltip: lang.specialChar.specialChar,
          click: context.createInvokeHandler('specialCharDialog.show')
        }).render();
      });
    };

    /**
     *  image : [
     ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
     ['float', ['floatLeft', 'floatRight', 'floatNone' ]],
     ['remove', ['removeMedia']]
     ],
     */
    this.addImagePopoverButtons = function () {
      // Image Size Buttons
      context.addButton('imageSize100', function (context) {
        return ui.button({
          contents: '<span class="note-fontsize-10">100%</span>',
          tooltip: lang.image.resizeFull,
          click: context.createInvokeHandler('editor.resize', '1')
        }).render();
      });
      context.addButton('imageSize50', function (context) {
        return  ui.button({
          contents: '<span class="note-fontsize-10">50%</span>',
          tooltip: lang.image.resizeHalf,
          click: context.createInvokeHandler('editor.resize', '0.5')
        }).render();
      });
      context.addButton('imageSize25', function (context) {
        return ui.button({
          contents: '<span class="note-fontsize-10">25%</span>',
          tooltip: lang.image.resizeQuarter,
          click: context.createInvokeHandler('editor.resize', '0.25')
        }).render();
      });

      // Float Buttons
      context.addButton('floatLeft', function (context) {
        return ui.button({
          contents: '<i class="fa fa-align-left"/>',
          tooltip: lang.image.floatLeft,
          click: context.createInvokeHandler('editor.floatMe', 'left')
        }).render();
      });

      context.addButton('floatRight', function (context) {
        return ui.button({
          contents: '<i class="fa fa-align-right"/>',
          tooltip: lang.image.floatRight,
          click: context.createInvokeHandler('editor.floatMe', 'right')
        }).render();
      });

      context.addButton('floatNone', function (context) {
        return ui.button({
          contents: '<i class="fa fa-align-justify"/>',
          tooltip: lang.image.floatNone,
          click: context.createInvokeHandler('editor.floatMe', 'none')
        }).render();
      });

      // Remove Buttons
      context.addButton('removeMedia', function (context) {
        return ui.button({
          contents: '<i class="fa fa-trash-o"/>',
          tooltip: lang.image.remove,
          click: context.createInvokeHandler('editor.removeMedia')
        }).render();
      });
    };

    this.addLinkPopoverButtons = function () {
      context.addButton('linkDialogShow', function (context) {
        return ui.button({
          contents: '<i class="fa fa-link"/>',
          tooltip: lang.link.edit,
          click: context.createInvokeHandler('linkDialog.show')
        }).render();
      });

      context.addButton('unlink', function (context) {
        return ui.button({
          contents: '<i class="fa fa-unlink"/>',
          tooltip: lang.link.unlink,
          click: context.createInvokeHandler('editor.unlink')
        }).render();
      });
    };

    this.updateCurrentStyle = function () {
      var styleInfo = context.invoke('editor.currentStyle');
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
        ui.toggleBtnActive($toolbar.find(selector), pred());
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
  };

  return Button;
});
