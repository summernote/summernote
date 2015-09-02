define([
  'summernote/base/builder'
], function (builder) {
  var renderer = {
    editor: builder.create('<div class="note-editor panel panel-default">'),
    toolbar: builder.create('<div class="note-toolbar panel-heading">'),
    editingArea: builder.create('<div class="note-editing-area">'),
    codable: builder.create('<div class="note-codable">'),
    editable: builder.create('<div class="note-editable panel-body" contentEditable="true">'),
    statusbar: builder.create([
      '<div class="note-statusbar">',
      '  <div class="note-resizebar">',
      '    <div class="note-icon-bar"></div>',
      '    <div class="note-icon-bar"></div>',
      '    <div class="note-icon-bar"></div>',
      '  </div>',
      '</div>'
    ].join('')),
    buttonGroup: builder.create('<div class="note-btn-group btn-group">'),
    button: builder.create('<button class="note-btn btn btn-default btn-sm">', function ($node, options) {
      if (options && options.tooltip) {
        $node.attr({
          title: options.tooltip
        }).tooltip({
          container: 'body',
          trigger: 'hover',
          placement: 'bottom'
        });
      }
    }),
    dropdownMenu: builder.create('<div class="dropdown-menu note-check">', function ($node, options) {
      $node.html(options.items.map(function (item) {
        return '<li><a href="#" data-value="' + item + '"><i class="fa fa-check"></i> ' + item + '</a></li>'
      }).join(''));
    }),

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
