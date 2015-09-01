define([
  'summernote/base/builder'
], function (builder) {
  var renderer = {
    editor: builder.create('<div class="note-editor">'),
    toolbar: builder.create('<div class="note-toolbar">'),
    editingArea: builder.create('<div class="note-editing-area">'),
    codable: builder.create('<div class="note-codable">'),
    editable: builder.create('<div class="note-editable" contentEditable="true">'),
    buttonGroup: builder.create('<span class="note-btn-group">'),
    button: builder.create('<button class="note-btn">'),

    createLayout: function ($note) {
      var $editor = renderer.editor([
        renderer.toolbar(),
        renderer.editingArea([
          renderer.codable(),
          renderer.editable()
        ])
      ]).build();

      $editor.insertAfter($note);

      return {
        editor: $editor,
        toolbar: $editor.find('.note-toolbar'),
        editable: $editor.find('.note-editable')
      };
    }
  };

  return renderer;
});
