define([
  'jquery',
  'summernote/base/core/func',
  'summernote/base/core/list',
  'summernote/base/core/agent'
], function ($, func, list, agent) {

  function addButton(key, obj) {
    $.summernote.buttons = $.summernote.buttons || {};
    $.summernote.buttons[key] = obj;
  }

  var Button = function (summernote) {
    var self = this;
    var ui = $.summernote.ui;

    var $toolbar = summernote.layoutInfo.toolbar;
    var options = summernote.options;
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


      addButton('style', function (summernote) {
        var ui = $.summernote.ui;

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
            items: summernote.options.styleTags,
            click: function (event) {
              summernote.invoke('editor.formatBlock', $(event.target).data('value'));
            }
          })
        ]).render();
      });

      addButton('bold', function (summernote) {
        var ui = $.summernote.ui;

        return ui.button({
          className: 'note-btn-bold',
          contents: '<i class="fa fa-bold"/>',
          tooltip: lang.font.bold + representShortcut('bold'),
          click: function () {
            summernote.invoke('editor.bold');
          }
        }).render();
      });

      addButton('italic', function (summernote) {
        var ui = $.summernote.ui;

        return ui.button({
          className: 'note-btn-italic',
          contents: '<i class="fa fa-italic"/>',
          tooltip: lang.font.italic + representShortcut('italic'),
          click: function () {
            summernote.invoke('editor.italic');
          }
        }).render();
      });

      addButton('underline', function (summernote) {
        var ui = $.summernote.ui;
        return ui.button({
          className: 'note-btn-underline',
          contents: '<i class="fa fa-underline"/>',
          tooltip: lang.font.underline + representShortcut('underline'),
          click: function () {
            summernote.invoke('editor.underline');
          }
        }).render();
      });

      addButton('clear', function (summernote) {
        var ui = $.summernote.ui;

        return ui.button({
          contents: '<i class="fa fa-eraser"/>',
          tooltip: lang.font.clear + representShortcut('removeFormat'),
          click: function () {
            summernote.invoke('editor.removeFormat');
          }
        }).render();
      });

      addButton('fontname', function (summernote) {
        var ui = $.summernote.ui;
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
            click: function (event) {
              summernote.invoke('editor.fontName', $(event.target).data('value'));
            }
          })
        ]).render();
      });

      addButton('fontsize', function (summernote) {
        var ui = $.summernote.ui;
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
            click: function () {
              summernote.invoke('editor.fontSize');
            }
          })
        ]).render();
      });

      addButton('color', function (summernote) {
        return ui.buttonGroup({
          className: 'note-color',
          children: [
            ui.button({
              contents: '<i class="fa fa-font note-recent-color"/>',
              tooltip: lang.color.recent,
              click: function (event) {
                var colorInfo = $(event.target).find('.note-recent-color').data('value');
                summernote.invoke('editor.color', colorInfo);
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
        }).render();
      });

      addButton('ol',  function (summernote) {
        var ui = $.summernote.ui;
        return ui.button({
          contents: '<i class="fa fa-list-ul"/>',
          tooltip: lang.lists.unordered + representShortcut('insertUnorderedList'),
          click: function () {
            summernote.invoke('editor.insertUnorderedList');
          }
        }).render();
      });

      addButton('ul', function (summernote) {
        var ui = $.summernote.ui;
        return ui.button({
          contents: '<i class="fa fa-list-ol"/>',
          tooltip: lang.lists.ordered + representShortcut('insertOrderedList'),
          click: function () {
            summernote.invoke('editor.insertOrderedList');
          }
        }).render();
      });

      addButton('paragraph', function (summernote) {
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
                  click: function () {
                    summernote.invoke('editor.justifyLeft');
                  }
                }),
                ui.button({
                  contents: '<i class="fa fa-align-center"/>',
                  tooltip: lang.paragraph.center + representShortcut('justifyCenter'),
                  click: function () {
                    summernote.invoke('editor.justifyCenter');
                  }
                }),
                ui.button({
                  contents: '<i class="fa fa-align-right"/>',
                  tooltip: lang.paragraph.right + representShortcut('justifyRight'),
                  click: function () {
                    summernote.invoke('editor.justifyRight');
                  }
                }),
                ui.button({
                  contents: '<i class="fa fa-align-justify"/>',
                  tooltip: lang.paragraph.justify + representShortcut('justifyFull'),
                  click: function () {
                    summernote.invoke('editor.justifyFull');
                  }
                })
              ]
            }),
            ui.buttonGroup({
              className: 'note-list',
              children: [
                ui.button({
                  contents: '<i class="fa fa-outdent"/>',
                  tooltip: lang.paragraph.outdent + representShortcut('outdent'),
                  click: function () {
                    summernote.invoke('editor.outdent');
                  }
                }),
                ui.button({
                  contents: '<i class="fa fa-indent"/>',
                  tooltip: lang.paragraph.indent + representShortcut('indent'),
                  click: function () {
                    summernote.invoke('editor.indent');
                  }
                })
              ]
            })
          ])
        ]).render();
      });


      addButton('height', function (summernote) {
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
            click: function (event) {
              summernote.invoke('editor.lineHeight', $(event.target).data('value'));
            }
          })
        ]).render();
      });

      addButton('table', function (summernote) {
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
            }).click(function (event) {
              summernote.invoke('editor.insertTable', $(event.target).data('value'));
            }).on('mousemove', self.tableMoveHandler);
          }
        }).render();
      });

      addButton('link', function (summernote) {
        var ui = $.summernote.ui;

        return ui.button({
          contents: '<i class="fa fa-link"/>',
          tooltip: lang.link.link,
          click: function () {
            summernote.invoke('linkDialog.show');
          }
        }).render();
      });

      addButton('picture', function (summernote) {
        var ui = $.summernote.ui;

        return ui.button({
          contents: '<i class="fa fa-picture-o"/>',
          tooltip: lang.image.image,
          click: function () {
            summernote.invoke('imageDialog.show');
          }
        }).render();
      });

      addButton('hr', function (summernote) {
        var ui = $.summernote.ui;
        return ui.button({
          contents: '<i class="fa fa-minus"/>',
          tooltip: lang.hr.insert + representShortcut('insertHorizontalRule'),
          click: function () {
            summernote.invoke('editor.insertHorizontalRule');
          }
        }).render();
      });

      addButton('fullscreen', function (summernote) {
        var ui = $.summernote.ui;

        return ui.button({
          className: 'btn-fullscreen',
          contents: '<i class="fa fa-arrows-alt"/>',
          tooltip: lang.options.fullscreen,
          click: function () {
            summernote.invoke('fullscreen.toggle');
          }
        }).render();
      });

      addButton('codeview', function (summernote) {
        return ui.button({
          className: 'btn-codeview',
          contents: '<i class="fa fa-code"/>',
          tooltip: lang.options.codeview,
          click: function () {
            summernote.invoke('codeview.toggle');
          }
        }).render();
      });

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

    this.updateFullscreen = function (isFullscreen) {
      ui.toggleBtnActive($toolbar.find('.btn-fullscreen'), isFullscreen);
    };

    this.updateCodeview = function (isCodeview) {
      ui.toggleBtnActive($toolbar.find('.btn-codeview'), isCodeview);
      if (isCodeview) {
        this.deactivate();
      } else {
        this.activate();
      }
    };

    this.activate = function () {
      var $btn = $toolbar.find('button').not('.btn-codeview');
      ui.toggleBtn($btn, true);
    };

    this.deactivate = function () {
      var $btn = $toolbar.find('button').not('.btn-codeview');
      ui.toggleBtn($btn, false);
    };
  };

  return Button;
});
