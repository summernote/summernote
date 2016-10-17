define([
  'summernote/base/renderer'
], function (renderer) {
  var ui = {
    editor: renderer.create('<div class="note-editor">'),
    toolbar: renderer.create('<div class="note-toolbar">'),
    editingArea: renderer.create('<div class="note-editing-area">'),
    codable: renderer.create('<div class="note-codable">'),
    editable: renderer.create('<div class="note-editable" contentEditable="true">'),
    buttonGroup: renderer.create('<span class="note-btn-group">'),
    button: renderer.create('<button class="note-btn">'),

    createLayout: function ($note) {
      var $editor = ui.editor([
        ui.toolbar(),
        ui.editingArea([
          ui.codable(),
          ui.editable()
        ])
      ]).render();

      $editor.insertAfter($note);

      return {
        note: $note,
        editor: $editor,
        toolbar: $editor.find('.note-toolbar'),
        editable: $editor.find('.note-editable'),
        codable: $editor.find('.note-codable')
      };
    }
  };

  return ui;
});
