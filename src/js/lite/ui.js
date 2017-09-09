define([
  'summernote/base/renderer',
  'summernote/lite/ui/tooltip',
  'summernote/lite/ui/dropdown',
  'summernote/lite/ui/modal'
], function (renderer, TooltipUI, DropdownUI, ModalUI) {
  var editor = renderer.create('<div class="note-editor note-frame"/>');
  var toolbar = renderer.create('<div class="note-toolbar"/>');
  var editingArea = renderer.create('<div class="note-editing-area"/>');
  var codable = renderer.create('<textarea class="note-codable"/>');
  var editable = renderer.create('<div class="note-editable" contentEditable="true"/>');
  var statusbar = renderer.create([
    '<div class="note-statusbar">',
    '  <div class="note-resizebar">',
    '    <div class="note-icon-bar"/>',
    '    <div class="note-icon-bar"/>',
    '    <div class="note-icon-bar"/>',
    '  </div>',
    '</div>'
  ].join(''));

  var airEditor = renderer.create('<div class="note-editor"/>');
  var airEditable = renderer.create('<div class="note-editable" contentEditable="true"/>');

  var buttonGroup = renderer.create('<div class="note-btn-group">');
  var button = renderer.create('<button type="button" class="note-btn">', function ($node, options) {
    // set button type
    if (options && options.tooltip) {
      TooltipUI.create($node, {
        title: options.tooltip
      });
    }
    if (options.contents) {
      $node.html(options.contents);
    }
    
    if (options && options.data && options.data.toggle === 'dropdown') {
      DropdownUI.create($node);
    }
  });

  var dropdown = renderer.create('<div class="note-dropdown-menu">', function ($node, options) {
    var markup = $.isArray(options.items) ? options.items.map(function (item) {
      var value = (typeof item === 'string') ? item : (item.value || '');
      var content = options.template ? options.template(item) : item;
      var $temp = $('<a class="note-dropdown-item" href="#" data-value="' + value + '"></a>');

      $temp.html(content).data('item', item); 

      return $temp;
    }) : options.items;

    $node.html(markup);

    $node.on('click', '> .note-dropdown-item', function (e) {
      var $a = $(this);

      var item = $a.data('item');
      var value = $a.data('value');

      if (item.click) {
        item.click($a);
      } else if (options.itemClick) {
        options.itemClick(e, item, value);
      }

    });
  });

  var dropdownCheck = renderer.create('<div class="note-dropdown-menu note-check">', function ($node, options) {
    var markup = $.isArray(options.items) ? options.items.map(function (item) {
      var value = (typeof item === 'string') ? item : (item.value || '');
      var content = options.template ? options.template(item) : item;

      var $temp = $('<a class="note-dropdown-item" href="#" data-value="' + value + '"></a>');
      $temp.html([icon(options.checkClassName), ' ', content]).data('item', item);
      return $temp;
    }) : options.items;

    $node.html(markup);

    $node.on('click', '> .note-dropdown-item', function (e) {
      var $a = $(this);

      var item = $a.data('item');
      var value = $a.data('value');

      if (item.click) {
        item.click($a);
      } else if (options.itemClick) {
        options.itemClick(e, item, value);
      }
    });
  });

  var dropdownButtonContents = function (contents, options) {
    return contents + ' ' + icon(options.icons.caret, 'span');
  };

  var dropdownButton = function (opt, callback) {
    return buttonGroup([
      button({
        className: 'dropdown-toggle',
        contents: opt.title + ' ' + icon('note-icon-caret'),
        tooltip: opt.tooltip,
        data: {
          toggle: 'dropdown'
        }
      }),
      dropdown({
        className: opt.className,
        items: opt.items,
        template: opt.template,
        itemClick: opt.itemClick
      })
    ], { callback: callback }).render();
  };

  var dropdownCheckButton = function (opt, callback) {
    return buttonGroup([
      button({
        className: 'dropdown-toggle',
        contents: opt.title + ' ' + icon('note-icon-caret'),
        tooltip: opt.tooltip,
        data: {
          toggle: 'dropdown'
        }
      }),
      dropdownCheck({
        className: opt.className,
        checkClassName: opt.checkClassName,
        items: opt.items,
        template: opt.template,
        itemClick: opt.itemClick
      })
    ], { callback: callback }).render();
  };

  var paragraphDropdownButton = function (opt) {

    return buttonGroup([
      button({
        className: 'dropdown-toggle',
        contents: opt.title + ' ' + icon('note-icon-caret'),
        tooltip: opt.tooltip,
        data: {
          toggle: 'dropdown'
        }
      }),
      dropdown([
        buttonGroup({
          className: 'note-align',
          children: opt.items[0]
        }),
        buttonGroup({
          className: 'note-list',
          children: opt.items[1]
        })
      ])
    ]).render();
  };

  var tableMoveHandler = function (event, col, row) {
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

    if (3 < dim.c && dim.c < col) {
      $unhighlighted.css({ width: dim.c + 1 + 'em'});
    }

    if (3 < dim.r && dim.r < row) {
      $unhighlighted.css({ height: dim.r + 1 + 'em'});
    }

    $dimensionDisplay.html(dim.c + ' x ' + dim.r);
  };

  var tableDropdownButton = function (opt) {

    return buttonGroup([
      button({
        className: 'dropdown-toggle',
        contents: opt.title + ' ' + icon('note-icon-caret'),
        tooltip: opt.tooltip,
        data: {
          toggle: 'dropdown'
        }
      }),
      dropdown({
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
          width: opt.col + 'em',
          height: opt.row + 'em'
        })
        .mousedown(opt.itemClick)
        .mousemove(function (e) {
          tableMoveHandler(e, opt.col, opt.row);
        });
      }
    }).render();
  };

  var palette = renderer.create('<div class="note-color-palette"/>', function ($node, options) {
    var contents = [];
    for (var row = 0, rowSize = options.colors.length; row < rowSize; row++) {
      var eventName = options.eventName;
      var colors = options.colors[row];
      var buttons = [];
      for (var col = 0, colSize = colors.length; col < colSize; col++) {
        var color = colors[col];
        buttons.push([
          '<button type="button" class="note-btn note-color-btn"',
          'style="background-color:', color, '" ',
          'data-event="', eventName, '" ',
          'data-value="', color, '" ',
          'title="', color, '" ',
          'data-toggle="button" tabindex="-1"></button>'
        ].join(''));
      }
      contents.push('<div class="note-color-row">' + buttons.join('') + '</div>');
    }
    $node.html(contents.join(''));

    $node.find('.note-color-btn').each(function () {
      TooltipUI.create($(this));
    });

  });

  var colorDropdownButton = function (opt, type) {

    return buttonGroup({
      className: 'note-color',
      children: [
        button({
          className: 'note-current-color-button',
          contents: opt.title,
          tooltip: opt.lang.color.recent,
          click: opt.currentClick,
          callback: function ($button) {
            var $recentColor = $button.find('.note-recent-color');

            if (type !== 'foreColor') {
              $recentColor.css('background-color', '#FFFF00');
              $button.attr('data-backColor', '#FFFF00');
            }

          }
        }),
        button({
          className: 'dropdown-toggle',
          contents: icon('note-icon-caret'),
          tooltip: opt.lang.color.more,
          data: {
            toggle: 'dropdown'
          }
        }),
        dropdown({
          items: [
            '<div>',
            '<div class="note-btn-group btn-background-color">',
            '  <div class="note-palette-title">' + opt.lang.color.background + '</div>',
            '  <div>',
            '<button type="button" class="note-color-reset note-btn note-btn-block" ' +
            ' data-event="backColor" data-value="inherit">',
            opt.lang.color.transparent,
            '    </button>',
            '  </div>',
            '  <div class="note-holder" data-event="backColor"/>',
            '</div>',
            '<div class="note-btn-group btn-foreground-color">',
            '  <div class="note-palette-title">' + opt.lang.color.foreground + '</div>',
            '  <div>',
            '<button type="button" class="note-color-reset note-btn note-btn-block" ' +
            ' data-event="removeFormat" data-value="foreColor">',
            opt.lang.color.resetToDefault,
            '    </button>',
            '  </div>',
            '  <div class="note-holder" data-event="foreColor"/>',
            '</div>',
            '</div>'
          ].join(''),
          callback: function ($dropdown) {
            $dropdown.find('.note-holder').each(function () {
              var $holder = $(this);
              $holder.append(palette({
                colors: opt.colors,
                eventName: $holder.data('event')
              }).render());
            });

            if (type === 'fore') {
              $dropdown.find('.btn-background-color').hide();
              $dropdown.css({ 'min-width': '210px' });
            } else if (type === 'back') {
              $dropdown.find('.btn-foreground-color').hide();
              $dropdown.css({ 'min-width': '210px' });
            }
          },
          click: function (event) {
            var $button = $(event.target);
            var eventName = $button.data('event');
            var value = $button.data('value');

            if (eventName && value) {
              var key = eventName === 'backColor' ? 'background-color': 'color';
              var $color = $button.closest('.note-color').find('.note-recent-color');
              var $currentButton = $button.closest('.note-color').find('.note-current-color-button');

              $color.css(key, value);
              $currentButton.attr('data-' + eventName, value);

              if (type === 'fore') {
                opt.itemClick('foreColor', value);
              } else if (type === 'back') {
                opt.itemClick('backColor', value);
              } else {
                opt.itemClick(eventName, value);
              }
            }
          }
        })
      ]
    }).render();
  };

  var dialog = renderer.create('<div class="note-modal" tabindex="-1"/>', function ($node, options) {
    if (options.fade) {
      $node.addClass('fade');
    }
    $node.html([
      '  <div class="note-modal-content">',
      (options.title ?
      '    <div class="note-modal-header">' +
      '      <button type="button" class="close"><i class="note-icon-close"></i></button>' +
      '      <h4 class="note-modal-title">' + options.title + '</h4>' +
      '    </div>' : ''
      ),
      '    <div class="note-modal-body">' + options.body + '</div>',
      (options.footer ?
      '    <div class="note-modal-footer">' + options.footer + '</div>' : ''
      ),
      '  </div>'
    ].join(''));

    $node.data('modal', ModalUI.create($node, options));
  });

  var videoDialog = function (opt) {

    var body = '<div class="note-form-group">' +
      '<label class="note-form-label">' +
      opt.lang.video.url + ' <small class="text-muted">' +
      opt.lang.video.providers + '</small>' +
      '</label>' +
      '<input class="note-video-url note-input" type="text" />' +
      '</div>';
    var footer = [
      '<button type="button" href="#" class="note-btn note-btn-primary note-video-btn disabled" disabled>',
      opt.lang.video.insert,
      '</button>'
    ].join('');

    return dialog({
      title: opt.lang.video.insert,
      fade: opt.fade,
      body: body,
      footer: footer
    }).render();
  };

  var imageDialog = function (opt) {
    var body = '<div class="note-form-group note-group-select-from-files">' +
      '<label class="note-form-label">' + opt.lang.image.selectFromFiles + '</label>' +
      '<input class="note-note-image-input note-input" type="file" name="files" accept="image/*" multiple="multiple" />' +
      opt.imageLimitation +
      '</div>' +
      '<div class="note-form-group" style="overflow:auto;">' +
      '<label class="note-form-label">' + opt.lang.image.url + '</label>' +
      '<input class="note-image-url note-input" type="text" />' +
      '</div>';
    var footer = [
      '<button href="#" type="button" class="note-btn note-btn-primary note-btn-large note-image-btn disabled" disabled>',
      opt.lang.image.insert,
      '</button>'
    ].join('');

    return dialog({
      title: opt.lang.image.insert,
      fade: opt.fade,
      body: body,
      footer: footer
    }).render();
  };

  var linkDialog = function (opt) {
    var body = '<div class="note-form-group">' +
      '<label class="note-form-label">' + opt.lang.link.textToDisplay + '</label>' +
      '<input class="note-link-text note-input" type="text" />' +
      '</div>' +
      '<div class="note-form-group">' +
      '<label class="note-form-label">' + opt.lang.link.url + '</label>' +
      '<input class="note-link-url note-input" type="text" value="http://" />' +
      '</div>' +
      (!opt.disableLinkTarget ?
        '<div class="checkbox">' +
        '<label>' + '<input type="checkbox" checked> ' + opt.lang.link.openInNewWindow + '</label>' +
        '</div>' : ''
      );
    var footer = [
      '<button href="#" type="button" class="note-btn note-btn-primary note-link-btn disabled" disabled>',
      opt.lang.link.insert,
      '</button>'
    ].join('');

    return dialog({
      className: 'link-dialog',
      title: opt.lang.link.insert,
      fade: opt.fade,
      body: body,
      footer: footer
    }).render();
  };

  var popover = renderer.create([
    '<div class="note-popover bottom">',
    '  <div class="note-popover-arrow"/>',
    '  <div class="note-popover-content note-children-container"/>',
    '</div>'
  ].join(''), function ($node, options) {
    var direction = typeof options.direction !== 'undefined' ? options.direction : 'bottom';

    $node.addClass(direction).hide();

    if (options.hideArrow) {
      $node.find('.note-popover-arrow').hide();
    }
  });

  var checkbox = renderer.create('<div class="checkbox"></div>', function ($node, options) {
    $node.html([
      ' <label' + (options.id ? ' for="' + options.id + '"' : '') + '>',
      ' <input type="checkbox"' + (options.id ? ' id="' + options.id + '"' : ''),
      (options.checked ? ' checked' : '') + '/>',
      (options.text ? options.text : ''),
      '</label>'
    ].join(''));
  });

  var icon = function (iconClassName, tagName) {
    tagName = tagName || 'i';
    return '<' + tagName + ' class="' + iconClassName + '"/>';
  };

  var ui = {
    editor: editor,
    toolbar: toolbar,
    editingArea: editingArea,
    codable: codable,
    editable: editable,
    statusbar: statusbar,
    airEditor: airEditor,
    airEditable: airEditable,
    buttonGroup: buttonGroup,
    button: button,
    dropdown: dropdown,
    dropdownCheck: dropdownCheck,
    dropdownButton: dropdownButton,
    dropdownButtonContents: dropdownButtonContents,
    dropdownCheckButton: dropdownCheckButton,
    paragraphDropdownButton: paragraphDropdownButton,
    tableDropdownButton: tableDropdownButton,
    colorDropdownButton: colorDropdownButton,
    palette: palette,
    dialog: dialog,
    videoDialog: videoDialog,
    imageDialog: imageDialog,
    linkDialog: linkDialog,
    popover: popover,
    checkbox: checkbox,
    icon: icon,

    toggleBtn: function ($btn, isEnable) {
      $btn.toggleClass('disabled', !isEnable);
      $btn.attr('disabled', !isEnable);
    },

    toggleBtnActive: function ($btn, isActive) {
      $btn.toggleClass('active', isActive);
    },

    check: function ($dom, value) {
      $dom.find('.checked').removeClass('checked');
      $dom.find('[data-value="' + value + '"]').addClass('checked');
    },

    onDialogShown: function ($dialog, handler) {
      $dialog.one('note.modal.show', handler);
    },

    onDialogHidden: function ($dialog, handler) {
      $dialog.one('note.modal.hide', handler);
    },

    showDialog: function ($dialog) {
      $dialog.data('modal').show();
    },

    hideDialog: function ($dialog) {
      $dialog.data('modal').hide();
    },

    /**
     * get popover content area
     *
     * @param $popover
     * @returns {*}
     */
    getPopoverContent: function ($popover) {
      return $popover.find('.note-popover-content');
    },

    /**
     * get dialog's body area
     *
     * @param $dialog
     * @returns {*}
     */
    getDialogBody: function ($dialog) {
      return $dialog.find('.note-modal-body');
    },

    createLayout: function ($note, options) {
      var $editor = (options.airMode ? ui.airEditor([
        ui.editingArea([
          ui.airEditable()
        ])
      ]) : ui.editor([
        ui.toolbar(),
        ui.editingArea([
          ui.codable(),
          ui.editable()
        ]),
        ui.statusbar()
      ])).render();

      $editor.insertAfter($note);

      return {
        note: $note,
        editor: $editor,
        toolbar: $editor.find('.note-toolbar'),
        editingArea: $editor.find('.note-editing-area'),
        editable: $editor.find('.note-editable'),
        codable: $editor.find('.note-codable'),
        statusbar: $editor.find('.note-statusbar')
      };
    },

    removeLayout: function ($note, layoutInfo) {
      $note.html(layoutInfo.editable.html());
      layoutInfo.editor.remove();
      $note.off('summernote');      // remove summernote custom event
      $note.show();
    }
  };

  return ui;
});
