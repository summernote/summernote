import $ from 'jquery';
import renderer from '../base/renderer';

const editor = renderer.create('<div class="note-editor note-frame panel"/>');
const toolbar = renderer.create('<div class="note-toolbar-wrapper panel-default"><div class="note-toolbar panel-heading"></div></div>');
const editingArea = renderer.create('<div class="note-editing-area"/>');
const codable = renderer.create('<textarea class="note-codable"/>');
const editable = renderer.create('<div class="note-editable" contentEditable="true"/>');
const statusbar = renderer.create([
  '<div class="note-statusbar">',
  '  <div class="note-resizebar">',
  '    <div class="note-icon-bar"/>',
  '    <div class="note-icon-bar"/>',
  '    <div class="note-icon-bar"/>',
  '  </div>',
  '</div>'
].join(''));

const airEditor = renderer.create('<div class="note-editor"/>');
const airEditable = renderer.create('<div class="note-editable" contentEditable="true"/>');

const buttonGroup = renderer.create('<div class="note-btn-group btn-group">');

const dropdown = renderer.create('<div class="dropdown-menu">', function($node, options) {
  const markup = $.isArray(options.items) ? options.items.map(function(item) {
    const value = (typeof item === 'string') ? item : (item.value || '');
    const content = options.template ? options.template(item) : item;
    const option = (typeof item === 'object') ? item.option : undefined;

    const dataValue = 'data-value="' + value + '"';
    const dataOption = (option !== undefined) ? ' data-option="' + option + '"' : '';
    return '<li><a href="#" ' + (dataValue + dataOption) + '>' + content + '</a></li>';
  }).join('') : options.items;

  $node.html(markup);
});

const dropdownButtonContents = function(contents, options) {
  return contents + ' ' + icon(options.icons.caret, 'span');
};

const dropdownCheck = renderer.create('<div class="dropdown-menu note-check">', function($node, options) {
  const markup = $.isArray(options.items) ? options.items.map(function(item) {
    const value = (typeof item === 'string') ? item : (item.value || '');
    const content = options.template ? options.template(item) : item;
    return '<li><a href="#" data-value="' + value + '">' + icon(options.checkClassName) + ' ' + content + '</a></li>';
  }).join('') : options.items;
  $node.html(markup);
});

const palette = renderer.create('<div class="note-color-palette"/>', function($node, options) {
  const contents = [];
  for (let row = 0, rowSize = options.colors.length; row < rowSize; row++) {
    const eventName = options.eventName;
    const colors = options.colors[row];
    const buttons = [];
    for (let col = 0, colSize = colors.length; col < colSize; col++) {
      const color = colors[col];
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

  if (options.tooltip) {
    $node.find('.note-color-btn').tooltip({
      container: options.container,
      trigger: 'hover',
      placement: 'bottom'
    });
  }
});

const dialog = renderer.create('<div class="modal" aria-hidden="false" tabindex="-1"/>', function($node, options) {
  if (options.fade) {
    $node.addClass('fade');
  }
  $node.html([
    '<div class="modal-dialog">',
    '  <div class="modal-content">',
    (options.title
      ? '    <div class="modal-header">' +
    '      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
    '      <h4 class="modal-title">' + options.title + '</h4>' +
    '    </div>' : ''
    ),
    '    <div class="modal-body">' + options.body + '</div>',
    (options.footer
      ? '    <div class="modal-footer">' + options.footer + '</div>' : ''
    ),
    '  </div>',
    '</div>'
  ].join(''));
});

const popover = renderer.create([
  '<div class="note-popover popover in">',
  '  <div class="arrow"/>',
  '  <div class="popover-content note-children-container"/>',
  '</div>'
].join(''), function($node, options) {
  const direction = typeof options.direction !== 'undefined' ? options.direction : 'bottom';

  $node.addClass(direction);

  if (options.hideArrow) {
    $node.find('.arrow').hide();
  }
});

const checkbox = renderer.create('<div class="checkbox"></div>', function($node, options) {
  $node.html([
    ' <label' + (options.id ? ' for="' + options.id + '"' : '') + '>',
    ' <input type="checkbox"' + (options.id ? ' id="' + options.id + '"' : ''),
    (options.checked ? ' checked' : '') + '/>',
    (options.text ? options.text : ''),
    '</label>'
  ].join(''));
});

const icon = function(iconClassName, tagName) {
  tagName = tagName || 'i';
  return '<' + tagName + ' class="' + iconClassName + '"/>';
};
const ui = {
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
  palette: palette,
  dialog: dialog,
  popover: popover,
  checkbox: checkbox,
  icon: icon,
  options: {},

  button: function($node, options) {
    return renderer.create('<button type="button" class="note-btn btn btn-default btn-sm" tabindex="-1">', function($node, options) {
      if (options && options.tooltip) {
        $node.attr({
          title: options.tooltip
        }).tooltip({
          container: options.container,
          trigger: 'hover',
          placement: 'bottom'
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

  createLayout: function($note, options) {
    const $editor = (options.airMode ? ui.airEditor([
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

  removeLayout: function($note, layoutInfo) {
    $note.html(layoutInfo.editable.html());
    layoutInfo.editor.remove();
    $note.show();
  }
};

export default ui;
