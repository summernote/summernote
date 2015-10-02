define([
  'jquery',
  'summernote/base/core/func',
  'summernote/base/core/list'
], function ($, func, list) {

  /**
   * @param {jQuery} $note
   * @param {Object} options
   * @return {Context}
   */
  var Context = function ($note, options) {
    var self = this;

    var ui = $.summernote.ui;
    this.modules = {};
    this.buttons = {};
    this.layoutInfo = {};
    this.options = options;

    this.initialize = function () {
      // create layout info
      this.layoutInfo = ui.createLayout($note, options);

      // initialize module
      Object.keys(this.options.modules).forEach(function (key) {
        var module = new self.options.modules[key](self);
        if (module.initialize) {
          module.initialize.apply(module);
        }
        self.addModule(key, module);
      });

      // add optional buttons
      Object.keys(this.options.buttons).forEach(function (key) {
        var button = self.options.buttons[key];
        self.addButton(key, button);
      });

      $note.hide();
      return this;
    };

    this.destroy = function () {
      Object.keys(this.modules).forEach(function (key) {
        self.removeModule(key);
      });

      $note.removeData('summernote');

      ui.removeLayout($note, this.layoutInfo);
    };

    this.code = function (html) {
      if (html === undefined) {
        var isActivated = this.invoke('codeview.isActivated');
        this.invoke('codeview.sync');
        return isActivated ? this.layoutInfo.codable.val() : this.layoutInfo.editable.html();
      }

      this.layoutInfo.editable.html(html);
    };

    this.triggerEvent = function () {
      var namespace = list.head(arguments);
      var args = list.tail(list.from(arguments));

      var callback = this.options.callbacks[func.namespaceToCamel(namespace, 'on')];
      if (callback) {
        callback.apply($note[0], args);
      }
      $note.trigger('summernote.' + namespace, args);
    };

    this.addModule = function (key, instance) {
      this.modules[key] = instance;
    };

    this.removeModule = function (key) {
      if (this.modules[key].destroy) {
        this.modules[key].destroy();
      }
      delete this.modules[key];
    };

    this.addButton = function (key, handler) {
      this.buttons[key] = handler;
    };

    this.removeButton = function (key) {
      if (this.buttons[key].destroy) {
        this.buttons[key].destroy();
      }
      delete this.buttons[key];
    };

    this.buildButtons = function ($container, buttonArray) {
      for (var groupIndex = 0, groupLength = buttonArray.length; groupIndex < groupLength; groupIndex++) {
        var group = buttonArray[groupIndex];
        var groupName = group[0];
        var buttonList = group[1];

        var $group = ui.buttonGroup({
          className: 'note-' + groupName
        }).render();

        for (var idx = 0, length = buttonList.length; idx < length; idx++) {
          var button = this.buttons[buttonList[idx]];
          if (button) {
            $group.append(typeof button === 'function' ? button(this) : button);
          }
        }
        $group.appendTo($container);
      }
    };

    this.createInvokeHandler = function (namespace, value) {
      return function (event) {
        event.preventDefault();
        self.invoke(namespace, value || $(event.target).data('value') || $(event.currentTarget).data('value'));
      };
    };

    this.invoke = function () {
      var namespace = list.head(arguments);
      var args = list.tail(list.from(arguments));

      var splits = namespace.split('.');
      var hasSeparator = splits.length > 1;
      var moduleName = hasSeparator && list.head(splits);
      var methodName = hasSeparator ? list.last(splits) : list.head(splits);

      var module = this.modules[moduleName || 'editor'];
      if (!moduleName && this[methodName]) {
        return this[methodName].apply(this, args);
      } else if (module && module[methodName]) {
        return module[methodName].apply(module, args);
      }
    };

    return this.initialize();
  };

  $.summernote = $.summernote || {
    lang: {}
  };

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
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);

      this.each(function (idx, note) {
        var $note = $(note);
        if (!$note.data('summernote')) {
          $note.data('summernote', new Context($note, options));
          $note.data('summernote').triggerEvent('init');
        }
      });

      var $note = this.first();
      if (isExternalAPICalled && $note.length) {
        var context = $note.data('summernote');
        return context.invoke.apply(context, list.from(arguments));
      } else {
        return this;
      }
    }
  });
});
