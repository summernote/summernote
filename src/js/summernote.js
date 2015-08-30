define([
  'jquery',
  'summernote/lite/core/func'
], function ($, func) {

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
      Object.keys(this.options.modules).forEach(function (key) {
        var module = new self.options.modules[key](self);
        if (module.initialize) {
          module.initialize.apply(module);
        }
        self.addModule(key, module);
      });
      $note.hide();
      return this;
    };

    this.destroy = function () {
      Object.keys(this.modules).forEach(function (key) {
        self.removeModule(key);
      });
    };

    this.createLayout = function ($note) {
      var renderer = $.summernote.renderer;
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

    this.invoke = function (namespace, args) {
      var splits = namespace.split('.');
      var moduleName = splits[0];
      var methodName = splits[1];

      this.modules[moduleName][methodName].apply(this.modules[moduleName], args);
    };

    return this.initialize();
  };

  $.summernote = $.summernote || {};

  $.fn.extend({
    /**
     * Summernote API
     *
     * @param {Object|String}
     * @return {this}
     */
    summernote: function (options) {
      options = $.extend({}, $.summernote.options, options);
      this.each(function (idx, note) {
        var $note = $(note);
        if (!$note.data('summernote')) {
          $note.data('summernote', new Summernote($note, options));
        }
      });
    }
  });
});
