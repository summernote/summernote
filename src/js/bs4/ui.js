import $ from 'jquery';
import renderer from '../base/renderer';

const editor = renderer.create('<div class="note-editor note-frame card"/>');
const toolbar = renderer.create('<div class="note-toolbar card-header" role="toolbar"></div>');
const editingArea = renderer.create('<div class="note-editing-area"/>');
const codable = renderer.create('<textarea class="note-codable" aria-multiline="true"/>');
const editable = renderer.create('<div class="note-editable card-block" contentEditable="true" role="textbox" aria-multiline="true"/>');
const statusbar = renderer.create([
  '<output class="note-status-output" role="status" aria-live="polite"/>',
  '<div class="note-statusbar" role="status">',
    '<output class="note-status-output" aria-live="polite"></output>',
    '<div class="note-resizebar" aria-label="Resize">',
      '<div class="note-icon-bar"/>',
      '<div class="note-icon-bar"/>',
      '<div class="note-icon-bar"/>',
    '</div>',
  '</div>',
].join(''));

const airEditor = renderer.create('<div class="note-editor note-airframe"/>');
const airEditable = renderer.create([
  '<div class="note-editable" contentEditable="true" role="textbox" aria-multiline="true"/>',
  '<output class="note-status-output" role="status" aria-live="polite"/>',
].join(''));

const buttonGroup = renderer.create('<div class="note-btn-group btn-group">');

const dropdown = renderer.create('<div class="note-dropdown-menu dropdown-menu" role="list">', function($node, options) {
  const markup = Array.isArray(options.items) ? options.items.map(function(item) {
    const value = (typeof item === 'string') ? item : (item.value || '');
    const content = options.template ? options.template(item) : item;
    const option = (typeof item === 'object') ? item.option : undefined;

    const dataValue = 'data-value="' + value + '"';
    const dataOption = (option !== undefined) ? ' data-option="' + option + '"' : '';
    return '<a class="dropdown-item" href="#" ' + (dataValue + dataOption) + ' role="listitem" aria-label="' + value + '">' + content + '</a>';
  }).join('') : options.items;

  $node.html(markup).attr({ 'aria-label': options.title });
});

const dropdownButtonContents = function(contents) {
  return contents;
};

const dropdownCheck = renderer.create('<div class="note-dropdown-menu dropdown-menu note-check" role="list">', function($node, options) {
  const markup = Array.isArray(options.items) ? options.items.map(function(item) {
    const value = (typeof item === 'string') ? item : (item.value || '');
    const content = options.template ? options.template(item) : item;
    return '<a class="dropdown-item" href="#" data-value="' + value + '" role="listitem" aria-label="' + item + '">' + icon(options.checkClassName) + ' ' + content + '</a>';
  }).join('') : options.items;
  $node.html(markup).attr({ 'aria-label': options.title });
});

const dialog = renderer.create('<div class="modal note-modal" aria-hidden="false" tabindex="-1" role="dialog"/>', function($node, options) {
  if (options.fade) {
    $node.addClass('fade');
  }
  $node.attr({
    'aria-label': options.title,
  });
  $node.html([
    '<div class="modal-dialog">',
      '<div class="modal-content">',
        (options.title ? '<div class="modal-header">' +
          '<h4 class="modal-title">' + options.title + '</h4>' +
          '<button type="button" class="close" data-dismiss="modal" aria-label="Close" aria-hidden="true">&times;</button>' +
        '</div>' : ''),
        '<div class="modal-body">' + options.body + '</div>',
        (options.footer ? '<div class="modal-footer">' + options.footer + '</div>' : ''),
      '</div>',
    '</div>',
  ].join(''));
});

const popover = renderer.create([
  '<div class="note-popover popover in">',
    '<div class="arrow"/>',
    '<div class="popover-content note-children-container"/>',
  '</div>',
].join(''), function($node, options) {
  const direction = typeof options.direction !== 'undefined' ? options.direction : 'bottom';

  $node.addClass(direction);

  if (options.hideArrow) {
    $node.find('.arrow').hide();
  }
});

const checkbox = renderer.create('<div class="form-check"></div>', function($node, options) {
  $node.html([
    '<label class="form-check-label"' + (options.id ? ' for="note-' + options.id + '"' : '') + '>',
      '<input type="checkbox" class="form-check-input"' + (options.id ? ' id="note-' + options.id + '"' : ''),
        (options.checked ? ' checked' : ''),
        ' aria-label="' + (options.text ? options.text : '') + '"',
        ' aria-checked="' + (options.checked ? 'true' : 'false') + '"/>',
      ' ' + (options.text ? options.text : '') +
    '</label>',
  ].join(''));
});

const icon = function(iconClassName, tagName) {
  tagName = tagName || 'i';
  return '<' + tagName + ' class="' + iconClassName + '"/>';
};

const ui = function(editorOptions) {
  return {
    editor: editor,
    toolbar: toolbar,
    editingArea: editingArea,
    codable: codable,
    editable: editable,
    statusbar: statusbar,
    airEditor: airEditor,
    airEditable: airEditable,
    buttonGroup: buttonGroup,
    dropdown: dropdown,
    dropdownButtonContents: dropdownButtonContents,
    dropdownCheck: dropdownCheck,
    dialog: dialog,
    popover: popover,
    icon: icon,
    checkbox: checkbox,
    options: editorOptions,

    palette: function($node, options) {
      return renderer.create('<div class="note-color-palette"/>', function($node, options) {
        const contents = [];
        for (let row = 0, rowSize = options.colors.length; row < rowSize; row++) {
          const eventName = options.eventName;
          const colors = options.colors[row];
          const colorsName = options.colorsName[row];
          const buttons = [];
          for (let col = 0, colSize = colors.length; col < colSize; col++) {
            const color = colors[col];
            const colorName = colorsName[col];
            buttons.push([
              '<button type="button" class="note-color-btn"',
              'style="background-color:', color, '" ',
              'data-event="', eventName, '" ',
              'data-value="', color, '" ',
              'title="', colorName, '" ',
              'aria-label="', colorName, '" ',
              'data-toggle="button" tabindex="-1"></button>',
            ].join(''));
          }
          contents.push('<div class="note-color-row">' + buttons.join('') + '</div>');
        }
        $node.html(contents.join(''));

        if (options.tooltip) {
          $node.find('.note-color-btn').tooltip({
            container: options.container || editorOptions.container,
            trigger: 'hover',
            placement: 'bottom',
          });
        }
      })($node, options);
    },

    button: function($node, options) {
      return renderer.create('<button type="button" class="note-btn btn btn-light btn-sm" tabindex="-1">', function($node, options) {
        if (options && options.tooltip) {
          $node.attr({
            title: options.tooltip,
            'aria-label': options.tooltip,
          }).tooltip({
            container: options.container || editorOptions.container,
            trigger: 'hover',
            placement: 'bottom',
          }).on('click', (e) => {
            $(e.currentTarget).tooltip('hide');
          });
        }
      })($node, options);
    },

    toggleBtn: function($btn, isEnable) {
      $btn.toggleClass('disabled', !isEnable);
      $btn.attr('disabled', !isEnable);
    },

    toggleBtnActive: function($btn, isActive) {
      $btn.toggleClass('active', isActive);
    },

    onDialogShown: function($dialog, handler) {
      $dialog.one('shown.bs.modal', handler);
    },

    onDialogHidden: function($dialog, handler) {
      $dialog.one('hidden.bs.modal', handler);
    },

    showDialog: function($dialog) {
      $dialog.modal('show');
    },

    hideDialog: function($dialog) {
      $dialog.modal('hide');
    },

    createLayout: function($note) {
      const $editor = (editorOptions.airMode ? airEditor([
        editingArea([
          codable(),
          airEditable(),
        ]),
      ]) : (editorOptions.toolbarPosition === 'bottom'
        ? editor([
          editingArea([
            codable(),
            editable(),
          ]),
          toolbar(),
          statusbar(),
        ])
        : editor([
          toolbar(),
          editingArea([
            codable(),
            editable(),
          ]),
          statusbar(),
        ])
      )).render();

      $editor.insertAfter($note);

      return {
        note: $note,
        editor: $editor,
        toolbar: $editor.find('.note-toolbar'),
        editingArea: $editor.find('.note-editing-area'),
        editable: $editor.find('.note-editable'),
        codable: $editor.find('.note-codable'),
        statusbar: $editor.find('.note-statusbar'),
      };
    },

    removeLayout: function($note, layoutInfo) {
      $note.html(layoutInfo.editable.html());
      layoutInfo.editor.remove();
      $note.show();
    },
  };
};

export default ui;
