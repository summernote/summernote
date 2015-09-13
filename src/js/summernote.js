define([
  'jquery',
  'summernote/base/core/func',
  'summernote/base/core/list'
], function ($, func, list) {

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

    this.triggerEvent = function () {
      var namespace = list.head(arguments);
      var args = list.tail(list.from(arguments));

      var callback = this.options.callbacks[func.namespaceToCamel(namespace, 'on')];
      if (callback) {
        callback.apply($note[0], args);
      }
      $note.trigger('summernote.' + namespace, args);
    };

    this.initialize = function () {
      var ui = $.summernote.ui;
      this.layoutInfo = ui.createLayout($note);

      Object.keys(this.options.modules).forEach(function (key) {
        var module = new self.options.modules[key](self);
        if (module.initialize) {
          module.initialize.apply(module);
        }
        self.addModule(key, module);
      });
      $note.hide();

      this.triggerEvent('ready');
      return this;
    };

    this.destroy = function () {
      Object.keys(this.modules).forEach(function (key) {
        self.removeModule(key);
      });
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

    this.createInvokeHandler = function (namespace, value) {
      return function (event) {
        event.preventDefault();
        self.invoke(namespace, value || $(event.target).data('value'));
      };
    };

    this.invoke = function () {
      var namespace = list.head(arguments);
      var args = list.tail(list.from(arguments));

      var splits = namespace.split('.');
      var moduleName = splits[0];
      var methodName = splits[1];

      var module = this.modules[moduleName];
      if (module) {
        return module[methodName].apply(module, args);
      }
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
    summernote: function () {
      var type = $.type(list.head(arguments));
      var isExternalAPICalled = type === 'string';
      var hasInitOptions = type === 'object';

      var options = hasInitOptions ? list.head(arguments) : {};

      options = $.extend({}, $.summernote.options, options);
      this.each(function (idx, note) {
        var $note = $(note);
        if (!$note.data('summernote')) {
          $note.data('summernote', new Summernote($note, options));
        }
      });

      var $note = this.first();
      if (isExternalAPICalled && $note.length) {
        var namespace = list.head(arguments);
        var params = list.tail(list.from(arguments));
        var summernote = $note.data('summernote');
        summernote.invoke(namespace, params);
      }
    }
  });
});
