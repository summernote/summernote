define([
  'jquery',
  'summernote/renderer',
  'summernote/core/func',
  'summernote/module/Editor'
], function ($, renderer, func, Editor) {

  /**
   * @class Summernote
   * @param {jQuery} $note
   * @param {Object} options
   * @return {Summernote}
   */
  var Summernote = function ($note, options) {
    var self = this;
    this.modules = {};
    this.layoutInfo = {};
    this.options = options;

    this.triggerEvent = function (namespace, args) {
      var callback = this.options.callbacks[func.namespaceToCamel(namespace, 'on')];
      if (callback) {
        callback.apply($note[0], args);
      }
      $note.trigger('summernote.' + namespace, args);
    };

    this.initialize = function () {
      this.layoutInfo = this.createLayout($note);
      this.addModule('editor', new Editor(this, this.layoutInfo.editable));
      $note.hide();
      return this;
    };

    this.destroy = function () {
      Object.keys(this.modules).forEach(function (key) {
        self.removeModule(key);
      });
    };

    this.createLayout = function ($note) {
      var $editor = renderer.editor([
        renderer.editingArea([
          renderer.codable(),
          renderer.editable()
        ])
      ]).build();

      $editor.insertAfter($note);

      return {
        editor: $editor,
        editable: $editor.find('.note-editable')
      };
    };

    this.removeLayout = function ($note) {
      $note.editor.remove();
    };

    this.addModule = function (key, instance) {
      this.modules[key] = instance;
    };

    this.removeModule = function (key) {
      this.modules[key].destroy();
      delete this.modules[key];
    };

    return this.initialize();
  };

  $.fn.extend({
    /**
     * Summernote API
     *
     * @param {Object|String}
     * @return {this}
     */
    summernote: function () {
      this.each(function (idx, note) {
        var $note = $(note);
        if (!$note.data('summernote')) {
          $note.data('summernote', new Summernote($note, {
            callbacks: {}
          }));
        }
      });
    }
  });
});
