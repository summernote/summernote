import $ from 'jquery';
import func from './core/func';
import lists from './core/lists';
import dom from './core/dom';

export default class Context {
  /**
   * @param {jQuery} $note
   * @param {Object} options
   */
  constructor($note, options) {
    this.ui = $.summernote.ui;
    this.$note = $note;

    this.memos = {};
    this.modules = {};
    this.layoutInfo = {};
    this.options = options;

    this.initialize();
  }

  /**
   * create layout and initialize modules and other resources
   */
  initialize() {
    this.layoutInfo = this.ui.createLayout(this.$note, this.options);
    this._initialize();
    this.$note.hide();
    return this;
  }

  /**
   * destroy modules and other resources and remove layout
   */
  destroy() {
    this._destroy();
    this.$note.removeData('summernote');
    this.ui.removeLayout(this.$note, this.layoutInfo);
  }

  /**
   * destory modules and other resources and initialize it again
   */
  reset() {
    var disabled = this.isDisabled();
    this.code(dom.emptyPara);
    this._destroy();
    this._initialize();

    if (disabled) {
      this.disable();
    }
  }

  _initialize() {
    // add optional buttons
    var buttons = $.extend({}, this.options.buttons);
    Object.keys(buttons).forEach((key) => {
      this.memo('button.' + key, buttons[key]);
    });

    var modules = $.extend({}, this.options.modules, $.summernote.plugins || {});

    // add and initialize modules
    Object.keys(modules).forEach((key) => {
      this.module(key, modules[key], true);
    });

    Object.keys(this.modules).forEach((key) => {
      this.initializeModule(key);
    });
  }

  _destroy() {
    // destroy modules with reversed order
    Object.keys(this.modules).reverse().forEach((key) => {
      this.removeModule(key);
    });

    Object.keys(this.memos).forEach((key) => {
      this.removeMemo(key);
    });
    // trigger custom onDestroy callback
    this.triggerEvent('destroy', this);
  }

  code(html) {
    var isActivated = this.invoke('codeview.isActivated');

    if (html === undefined) {
      this.invoke('codeview.sync');
      return isActivated ? this.layoutInfo.codable.val() : this.layoutInfo.editable.html();
    } else {
      if (isActivated) {
        this.layoutInfo.codable.val(html);
      } else {
        this.layoutInfo.editable.html(html);
      }
      this.$note.val(html);
      this.triggerEvent('change', html);
    }
  }

  isDisabled() {
    return this.layoutInfo.editable.attr('contenteditable') === 'false';
  }

  enable() {
    this.layoutInfo.editable.attr('contenteditable', true);
    this.invoke('toolbar.activate', true);
    this.triggerEvent('disable', false);
  }

  disable() {
    // close codeview if codeview is opend
    if (this.invoke('codeview.isActivated')) {
      this.invoke('codeview.deactivate');
    }
    this.layoutInfo.editable.attr('contenteditable', false);
    this.invoke('toolbar.deactivate', true);

    this.triggerEvent('disable', true);
  }

  triggerEvent() {
    var namespace = lists.head(arguments);
    var args = lists.tail(lists.from(arguments));

    var callback = this.options.callbacks[func.namespaceToCamel(namespace, 'on')];
    if (callback) {
      callback.apply(this.$note[0], args);
    }
    this.$note.trigger('summernote.' + namespace, args);
  }

  initializeModule(key) {
    var module = this.modules[key];
    module.shouldInitialize = module.shouldInitialize || func.ok;
    if (!module.shouldInitialize()) {
      return;
    }

    // initialize module
    if (module.initialize) {
      module.initialize();
    }

    // attach events
    if (module.events) {
      dom.attachEvents(this.$note, module.events);
    }
  }

  module(key, ModuleClass, withoutIntialize) {
    if (arguments.length === 1) {
      return this.modules[key];
    }

    this.modules[key] = new ModuleClass(this);

    if (!withoutIntialize) {
      this.initializeModule(key);
    }
  }

  removeModule(key) {
    var module = this.modules[key];
    if (module.shouldInitialize()) {
      if (module.events) {
        dom.detachEvents(this.$note, module.events);
      }

      if (module.destroy) {
        module.destroy();
      }
    }

    delete this.modules[key];
  }

  memo(key, obj) {
    if (arguments.length === 1) {
      return this.memos[key];
    }
    this.memos[key] = obj;
  }

  removeMemo(key) {
    if (this.memos[key] && this.memos[key].destroy) {
      this.memos[key].destroy();
    }

    delete this.memos[key];
  }

  /**
   *Some buttons need to change their visual style immediately once they get pressed
   */
  createInvokeHandlerAndUpdateState(namespace, value) {
    return (event) => {
      this.createInvokeHandler(namespace, value)(event);
      this.invoke('buttons.updateCurrentStyle');
    };
  }

  createInvokeHandler(namespace, value) {
    return (event) => {
      event.preventDefault();
      var $target = $(event.target);
      this.invoke(namespace, value || $target.closest('[data-value]').data('value'), $target);
    };
  }

  invoke() {
    var namespace = lists.head(arguments);
    var args = lists.tail(lists.from(arguments));

    var splits = namespace.split('.');
    var hasSeparator = splits.length > 1;
    var moduleName = hasSeparator && lists.head(splits);
    var methodName = hasSeparator ? lists.last(splits) : lists.head(splits);

    var module = this.modules[moduleName || 'editor'];
    if (!moduleName && this[methodName]) {
      return this[methodName].apply(this, args);
    } else if (module && module[methodName] && module.shouldInitialize()) {
      return module[methodName].apply(module, args);
    }
  }
}
