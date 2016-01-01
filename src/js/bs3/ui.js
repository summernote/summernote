define([
  'summernote/base/renderer'
], function (renderer) {
  var editor = renderer.create('<div class="note-editor note-frame panel panel-default"/>');
  var toolbar = renderer.create('<div class="note-toolbar panel-heading"/>');
  var editingArea = renderer.create('<div class="note-editing-area"/>');
  var codable = renderer.create('<textarea class="note-codable"/>');
  var editable = renderer.create('<div class="note-editable panel-body" contentEditable="true"/>');
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

  var buttonGroup = renderer.create('<div class="note-btn-group btn-group">');
  var button = renderer.create('<button type="button" class="note-btn btn btn-default btn-sm">', function ($node, options) {
    if (options && options.tooltip) {
      $node.attr({
        title: options.tooltip
      }).tooltip({
        container: 'body',
        trigger: 'hover',
        placement: 'bottom'
      });
    }
  });

  var dropdown = renderer.create('<div class="dropdown-menu">', function ($node, options) {
    var markup = $.isArray(options.items) ? options.items.map(function (item) {

      var value = (typeof item === 'string') ? item : (item.value || '');
      var content = options.template ? options.template(item) : item;
      return '<li><a href="#" data-value="' + value + '">' + content + '</a></li>';
    }).join('') : options.items;

    $node.html(markup);
  });

  var dropdownCheck = renderer.create('<div class="dropdown-menu note-check">', function ($node, options) {
    var markup = $.isArray(options.items) ? options.items.map(function (item) {
      var value = (typeof item === 'string') ? item : (item.value || '');
      var checked = (item.checked ? ' class="checked"' : '');
      var content = options.template ? options.template(item) : item;
      return '<li><a href="#" data-value="' + value + '" ' + checked + '>' + icon(options.checkClassName) + ' ' + content + '</a></li>';
    }).join('') : options.items;
    $node.html(markup);
  });

  var dropdownButton = function (opt) {
    return buttonGroup([
      button({
        className: 'dropdown-toggle',
        contents: opt.contents + ' <span class="caret" />',
        tooltip: opt.tooltip,
        data: {
          toggle: 'dropdown'
        },
        click : opt.click,
        callback : opt.callback
      }),
      dropdown({
        className: opt.className,
        items: opt.items,
        template : opt.template,
        click: opt.dropdownClick || opt.click,
        callback : opt.dropdownCallback || opt.callback
      })
    ]);
  };

  var dropdownCheckButton = function (opt) {
    return buttonGroup([
      button({
        className: 'dropdown-toggle',
        contents: opt.contents + ' <span class="caret" />',
        tooltip: opt.tooltip,
        data: {
          toggle: 'dropdown'
        },
        click : opt.click,
        callback : opt.callback
      }),
      dropdownCheck({
        className: opt.className,
        checkClassName : opt.checkClassName,
        items: opt.items,
        template : opt.template,
        click: opt.dropdownClick || opt.click,
        callback : opt.dropdownCallback || opt.callback
      })
    ]);
  };

  var splitDropdownButton = function (opt) {
    return buttonGroup({
      className: opt.className,
      children: [
        button({
          className : opt.buttonClassName,
          contents: opt.contents,
          tooltip: opt.tooltip,
          click: opt.click,
          callback: opt.callback
        }),
        button({
          className: 'dropdown-toggle',
          contents: icon('caret', 'span'),
          data: {
            toggle: 'dropdown'
          }
        }),
        dropdown({
          items: opt.items,
          template : opt.template,
          click: opt.dropdownClick || opt.click,
          callback : opt.dropdownCallback || opt.callback
        })
      ]
    });
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
          '<button type="button" class="note-color-btn"',
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

    $node.find('.note-color-btn').tooltip({
      container: 'body',
      trigger: 'hover',
      placement: 'bottom'
    });
  });

  var colorButton = function (opt) {
    return splitDropdownButton({
      className: opt.className,
      buttonClassName : opt.buttonClassName,
      contents: opt.contents,
      tooltip: opt.tooltip,
      click: opt.click,
      callback: function ($button) {
        var $recentColor = $button.find('.note-recent-color');
        $recentColor.css({
          'background-color': opt.defaults.background
        });

        $button.data('value', {
          backColor: opt.defaults.background
        });
      },
      items : [
        '<li>',
        '<div class="btn-group">',
        '  <div class="note-palette-title">' + opt.lang.color.background + '</div>',
        '  <div>',
        '    <button type="button" class="note-color-reset btn btn-default" data-event="backColor" data-value="inherit">',
        opt.lang.color.transparent,
        '    </button>',
        '  </div>',
        '  <div class="note-holder" data-event="backColor"/>',
        '</div>',
        '<div class="btn-group">',
        '  <div class="note-palette-title">' + opt.lang.color.foreground + '</div>',
        '  <div>',
        '    <button type="button" class="note-color-reset btn btn-default" data-event="removeFormat" data-value="foreColor">',
        opt.lang.color.resetToDefault,
        '    </button>',
        '  </div>',
        '  <div class="note-holder" data-event="foreColor"/>',
        '</div>',
        '</li>'
      ].join(''),
      dropdownCallback: function ($dropdown) {
        $dropdown.find('.note-holder').each(function () {
          var $holder = $(this);
          $holder.append(palette({
            colors: opt.colors,
            eventName: $holder.data('event')
          }).render());
        });
      },
      dropdownClick: function (event) {
        var $button = $(event.target);
        var eventName = $button.data('event');
        var value = $button.data('value');

        if (eventName && value) {
          var key = eventName === 'backColor' ? 'background-color' : 'color';
          var $color = $button.closest('.' + opt.className).find('.note-recent-color');
          var $currentButton = $button.closest('.' + opt.className).find('.' + opt.buttonClassName);

          var colorInfo = $currentButton.data('value');
          colorInfo[eventName] = value;
          $color.css(key, value);
          $currentButton.data('value', colorInfo);

          if (opt.selectColor) {
            opt.selectColor(eventName, value);
          }
        }
      }
    });
  };

  var paragraphButton = function (opt) {

    return buttonGroup([
      button({
        className: 'dropdown-toggle',
        contents: icon(opt.icons.paragraph) + ' ' + icon('caret', 'span'),
        tooltip: opt.tooltip.paragraph,
        data: {
          toggle: 'dropdown'
        }
      }),
      dropdown([
        buttonGroup({
          className: 'note-align',
          children: [
            button({
              contents: icon(opt.icons.left),
              tooltip: opt.tooltip.left,
              click: function (e) {
                opt.click(e, 'justifyLeft');
              }
            }),
            button({
              contents: icon(opt.icons.center),
              tooltip: opt.tooltip.center,
              click: function (e) {
                opt.click(e, 'justifyCenter');
              }
            }),
            button({
              contents: icon(opt.icons.right),
              tooltip: opt.tooltip.right,
              click: function (e) {
                opt.click(e, 'justifyRight');
              }
            }),
            button({
              contents: icon(opt.icons.justify),
              tooltip: opt.tooltip.justify,
              click: function (e) {
                opt.click(e, 'justifyFull');
              }
            })
          ]
        }),
        buttonGroup({
          className: 'note-list',
          children: [
            button({
              contents: icon(opt.icons.outdent),
              tooltip: opt.tooltip.outdent,
              click: function (e) {
                opt.click(e, 'outdent');
              }
            }),
            button({
              contents: icon(opt.icons.indent),
              tooltip: opt.tooltip.indent,
              click: function (e) {
                opt.click(e, 'indent');
              }
            })
          ]
        })
      ])
    ]);
  };

  var dialog = renderer.create('<div class="modal" aria-hidden="false"/>', function ($node, options) {
    $node.html([
      '<div class="modal-dialog">',
      '  <div class="modal-content">',
      (options.title ?
        '    <div class="modal-header">' +
        '      <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
        '       <span aria-hidden="true">&times;</span>' +
        '      </button>' +
        '      <h4 class="modal-title">' + options.title + '</h4>' +
        '    </div>' : ''
      ),
      '    <div class="modal-body">' + options.body + '</div>',
      (options.footer ?
        '    <div class="modal-footer">' + options.footer + '</div>' : ''
      ),
      '  </div>',
      '</div>'
    ].join(''));
  });

  var helpDialog = function (opt) {
    return ui.dialog({
      title: opt.title,
      body: opt.body,
      footer: opt.footer,
      callback: function ($node) {
        $node.find('.modal-body').css({
          'max-height': opt.maxHeight || 300,
          'overflow': 'scroll'
        });
      }
    });
  };

  var imageDialog = function (opt) {

    var body = '<div class="form-group note-group-select-from-files">' +
      '<label>' + opt.lang.selectFromFiles + '</label>' +
      '<input class="note-image-input form-control" type="file" name="files" accept="image/*" multiple="multiple" />' +
      opt.imageLimitation +
      '</div>' +
      '<div class="form-group" style="overflow:auto;">' +
      '<label>' + opt.lang.url + '</label>' +
      '<input class="note-image-url form-control col-md-12" type="text" />' +
      '</div>';
    var footer = '<button href="#" class="btn btn-primary note-image-btn disabled" disabled>' + opt.lang.insert + '</button>';

    return dialog({
      title: opt.title,
      body: body,
      footer: footer
    });
  };

  var linkDialog = function (opt) {


    var body = '<div class="form-group">' +
      '<label>' + opt.lang.textToDisplay + '</label>' +
      '<input class="note-link-text form-control" type="text" />' +
      '</div>' +
      '<div class="form-group">' +
      '<label>' + opt.lang.url + '</label>' +
      '<input class="note-link-url form-control" type="text" value="http://" />' +
      '</div>' +
      (!opt.disableLinkTarget ?
        '<div class="checkbox">' +
        '<label>' + '<input type="checkbox" checked> ' + opt.lang.openInNewWindow + '</label>' +
        '</div>' : ''
      );

    var footer = '<button href="#" class="btn btn-primary note-link-btn disabled" disabled>' + opt.lang.insert + '</button>';

    return dialog({
      className: opt.className,
      title: opt.title,
      body: body,
      footer: footer
    });
  };

  var videoDialog = function (opt) {

    var body = '<div class="form-group row-fluid">' +
      '<label>' + opt.lang.url + ' <small class="text-muted">' + opt.lang.providers + '</small></label>' +
      '<input class="note-video-url form-control span12" type="text" />' +
      '</div>';
    var footer = '<button href="#" class="btn btn-primary note-video-btn disabled" disabled>' + opt.lang.insert + '</button>';

    return dialog({
      className: opt.className,
      title: opt.title,
      body: body,
      footer: footer
    });
  };

  var popover = renderer.create([
    '<div class="note-popover popover bottom in">',
    '  <div class="arrow"/>',
    '  <div class="popover-content note-children-container"/>',
    '</div>'
  ].join(''));

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
    dropdownButton: dropdownButton,
    dropdownCheck: dropdownCheck,
    dropdownCheckButton : dropdownCheckButton,
    palette: palette,
    splitDropdownButton: splitDropdownButton,
    colorButton: colorButton,
    paragraphButton: paragraphButton,
    dialog: dialog,
    helpDialog: helpDialog,
    imageDialog: imageDialog,
    linkDialog: linkDialog,
    videoDialog: videoDialog,
    popover: popover,
    icon: icon,

    toggleBtn: function ($btn, isEnable) {
      $btn.toggleClass('disabled', !isEnable);
      $btn.attr('disabled', !isEnable);
    },

    toggleBtnActive: function ($btn, isActive) {
      $btn.toggleClass('active', isActive);
    },

    onDialogShown: function ($dialog, handler) {
      $dialog.one('shown.bs.modal', handler);
    },

    onDialogHidden: function ($dialog, handler) {
      $dialog.one('hidden.bs.modal', handler);
    },

    showDialog: function ($dialog) {
      $dialog.modal('show');
    },

    hideDialog: function ($dialog) {
      $dialog.modal('hide');
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
      $note.show();
    }
  };

  return ui;
});
