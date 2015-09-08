define([
  'summernote/base/builder'
], function (builder) {
  var editor = builder.create('<div class="note-editor panel panel-default">');
  var toolbar = builder.create('<div class="note-toolbar panel-heading">');
  var editingArea = builder.create('<div class="note-editing-area">');
  var codable = builder.create('<div class="note-codable">');
  var editable = builder.create('<div class="note-editable panel-body" contentEditable="true">');
  var statusbar = builder.create([
    '<div class="note-statusbar">',
    '  <div class="note-resizebar">',
    '    <div class="note-icon-bar"></div>',
    '    <div class="note-icon-bar"></div>',
    '    <div class="note-icon-bar"></div>',
    '  </div>',
    '</div>'
  ].join(''));

  var buttonGroup = builder.create('<div class="note-btn-group btn-group">');
  var button = builder.create('<button class="note-btn btn btn-default btn-sm">', function ($node, options) {
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

  var dropdown = builder.create('<div class="dropdown-menu">', function ($node, options) {
    var markup = $.isArray(options.items) ? options.items.map(function (item) {
      return '<li><a href="#" data-value="' + item + '">' + item + '</a></li>';
    }).join('') : options.items;

    $node.html(markup);
  });

  var dropdownCheck = builder.create('<div class="dropdown-menu note-check">', function ($node, options) {
    var markup = $.isArray(options.items) ? options.items.map(function (item) {
      return '<li><a href="#" data-value="' + item + '"><i class="fa fa-check" /> ' + item + '</a></li>';
    }).join('') : options.items;
    $node.html(markup);
  });

  var palette = builder.create('<div class="note-color-palette">', function ($node, options) {
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

  var renderer = {
    editor: editor,
    toolbar: toolbar,
    editingArea: editingArea,
    codable: codable,
    editable: editable,
    statusbar: statusbar,
    buttonGroup: buttonGroup,
    button: button,
    dropdown: dropdown,
    dropdownCheck: dropdownCheck,
    palette: palette,

    createLayout: function ($note) {
      var $editor = renderer.editor([
        renderer.toolbar(),
        renderer.editingArea([
          renderer.codable(),
          renderer.editable()
        ]),
        renderer.statusbar()
      ]).build();

      $editor.insertAfter($note);

      return {
        note: $note,
        editor: $editor,
        toolbar: $editor.find('.note-toolbar'),
        editable: $editor.find('.note-editable'),
        statusbar: $editor.find('.note-statusbar')
      };
    }
  };

  return renderer;
});
