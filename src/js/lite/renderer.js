define([
  'summernote/base/builder',
  'summernote/base/core/ui',
  'summernote/lite/ui'
], function (builder, ui, LiteUI) {


  ui = new LiteUI(ui);

  var renderer = {
    editor: builder.create('<div class="note-editor">'),
    editingArea: builder.create('<div class="note-editing-area">'),
    codable: builder.create('<div class="note-codable">'),
    editable: builder.create('<div class="note-editable" contentEditable="true">'),

    createLayout: function ($note) {
      var $editor = renderer.editor([
        renderer.editingArea([
          renderer.codable(),
          renderer.editable()
        ])
      ]).build();

      $editor.insertAfter($note);

      return {
        ui : ui,
        editor: $editor,
        editable: $editor.find('.note-editable')
      };
    }
  };

  return renderer;
});
