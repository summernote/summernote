define([
  'jquery',
  'summernote/base/core/list',
  'summernote/base/core/agent'
], function ($, list, agent) {
  var Toolbar = function (summernote) {
    var self = this;
    var ui = $.summernote.ui;

    var $note = summernote.layoutInfo.note;
    var $toolbar = summernote.layoutInfo.toolbar;
    var options = summernote.options;

    this.createInvokeHandler = function (namespace) {
      return function (event) {
        event.preventDefault();
        var value = $(event.target).data('value');
        summernote.invoke(namespace, [value]);
      };
    };

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

    this.initialize = function () {
      $note.on('summernote.keyup summernote.mouseup summernote.change', function () {
        self.updateCurrentStyle();
      });

      $toolbar.append(ui.buttonGroup([
        ui.button({
          className: 'dropdown-toggle',
          contents: '<i class="fa fa-magic" /> <span class="caret" />',
          tooltip: 'Style',
          data: {
            toggle: 'dropdown'
          }
        }),
        ui.dropdown({
          className: 'dropdown-style',
          items: options.styleTags,
          click: this.createInvokeHandler('editor.formatBlock')
        })
      ]).render());

      $toolbar.append(ui.buttonGroup([
        ui.button({
          className: 'note-btn-bold',
          contents: '<i class="fa fa-bold" />',
          tooltip: 'Bold (⌘+B)',
          click: this.createInvokeHandler('editor.bold')
        }),
        ui.button({
          className: 'note-btn-italic',
          contents: '<i class="fa fa-italic" />',
          tooltip: 'Italic (⌘+I)',
          click: this.createInvokeHandler('editor.italic')
        }),
        ui.button({
          className: 'note-btn-underline',
          contents: '<i class="fa fa-underline" />',
          tooltip: 'Underline (⌘+U)',
          click: this.createInvokeHandler('editor.underline')
        }),
        ui.button({
          contents: '<i class="fa fa-eraser" />',
          tooltip: 'Remove Font Style (⌘+\\)',
          click: this.createInvokeHandler('editor.removeFormat')
        })
      ]).render());

      $toolbar.append(ui.buttonGroup([
        ui.button({
          className: 'dropdown-toggle',
          contents: '<span class="note-current-fontname" /> <span class="caret" />',
          tooltip: 'Font Family',
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
          click: this.createInvokeHandler('editor.fontName')
        })
      ]).render());

      $toolbar.append(ui.buttonGroup([
        ui.button({
          className: 'dropdown-toggle',
          contents: '<span class="note-current-fontsize" /> <span class="caret" />',
          tooltip: 'Font Size',
          data: {
            toggle: 'dropdown'
          }
        }),
        ui.dropdownCheck({
          className: 'dropdown-fontsize',
          items: options.fontSizes,
          click: this.createInvokeHandler('editor.fontSize')
        })
      ]).render());

      $toolbar.append(ui.buttonGroup([
        ui.button({
          contents: '<i class="fa fa-font note-recent-color"/>',
          tooltip: 'Recent Color',
          click: this.createInvokeHandler('editor.color'),
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
          tooltip: 'More Color',
          data: {
            toggle: 'dropdown'
          }
        }),
        ui.dropdown({
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
              $color.data('value', colorInfo)
                    .css(key, value);

              summernote.invoke('editor.' + eventName, [value]);
            }
          }
        })
      ], {
        className: 'note-color'
      }).render());

      $toolbar.append(ui.buttonGroup([
        ui.button({
          contents: '<i class="fa fa-list-ul"/>',
          tooltip: 'Unordered list (⌘+⇧+NUM7)',
          click: this.createInvokeHandler('editor.insertUnorderedList')
        }),
        ui.button({
          contents: '<i class="fa fa-list-ol"/>',
          tooltip: 'Ordered list (⌘+⇧+NUM8)',
          click: this.createInvokeHandler('editor.insertOrderedList')
        }),
        ui.buttonGroup([
          ui.button({
            className: 'dropdown-toggle',
            contents: '<i class="fa fa-align-left"/> <span class="caret"/>',
            tooltip: 'More paragraph style',
            data: {
              toggle: 'dropdown'
            }
          }),
          ui.dropdown([
            ui.buttonGroup([
              ui.button({
                contents: '<i class="fa fa-align-left"/>',
                click: this.createInvokeHandler('editor.justifyLeft')
              }),
              ui.button({
                contents: '<i class="fa fa-align-center"/>',
                click: this.createInvokeHandler('editor.justifyCenter')
              }),
              ui.button({
                contents: '<i class="fa fa-align-right"/>',
                click: this.createInvokeHandler('editor.justifyRight')
              }),
              ui.button({
                contents: '<i class="fa fa-align-justify"/>',
                click: this.createInvokeHandler('editor.justifyFull')
              })
            ], {
              className: 'note-align'
            }),
            ui.buttonGroup([
              ui.button({
                contents: '<i class="fa fa-outdent"/>',
                click: this.createInvokeHandler('editor.outdent')
              }),
              ui.button({
                contents: '<i class="fa fa-indent"/>',
                click: this.createInvokeHandler('editor.indent')
              })
            ], {
              className: 'note-list'
            })
          ])
        ])
      ], {
        className: 'note-para'
      }).render());

      $toolbar.append(ui.buttonGroup([
        ui.button({
          className: 'dropdown-toggle',
          contents: '<i class="fa fa-text-height"/> <span class="caret"/>',
          data: {
            toggle: 'dropdown'
          }
        }),
        ui.dropdownCheck({
          items: options.lineHeights,
          className: 'dropdown-line-height',
          click: this.createInvokeHandler('editor.lineHeight')
        })
      ]).render());

      $toolbar.append(ui.buttonGroup([
        ui.button({
          className: 'dropdown-toggle',
          contents: '<i class="fa fa-table"/> <span class="caret"/>',
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
            var $target = $(event.target);
            summernote.invoke('editor.insertTable', [$target.data('value')]);
          }).on('mousemove', self.tableMoveHandler);
        }
      }).render());

      $toolbar.append(ui.buttonGroup([
        ui.button({
          contents: '<i class="fa fa-link"/>',
          click: this.createInvokeHandler('linkDialog.show')
        }),
        ui.button({
          contents: '<i class="fa fa-picture-o"/>',
          click: this.createInvokeHandler('imageDialog.show')
        }),
        ui.button({
          contents: '<i class="fa fa-minus"/>',
          click: this.createInvokeHandler('editor.insertHorizontalRule')
        })
      ]).render());

      $toolbar.append(ui.buttonGroup([
        ui.button({
          className: 'btn-fullscreen',
          contents: '<i class="fa fa-arrows-alt"/>',
          click: this.createInvokeHandler('fullscreen.toggle')
        }),
        ui.button({
          className: 'btn-codeview',
          contents: '<i class="fa fa-code"/>',
          click: this.createInvokeHandler('codeview.toggle')
        })
      ]).render());

      this.updateCurrentStyle();
    };

    this.destory = function () {
      $toolbar.children().remove();
    };
  };

  return Toolbar;
});
