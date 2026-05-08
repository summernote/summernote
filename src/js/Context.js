import $$ from './core/dom-query.js';
import func from './core/func';
import lists from './core/lists';
import dom from './core/dom';

export default class Context {
  /**
   * @param {DomQuery} $note
   * @param {Object} options
   */
  constructor($note, options) {
    this.$note = $note;

    this.memos = {};
    this.modules = {};
    this.layoutInfo = {};
    this.explicitContainer = options.container || null;
    this.options = $$.extend(true, {}, options);
    this.options.container = this.options.container || false;

    // init ui with options
    $$.summernote.ui = $$.summernote.ui_template(this.options);
    this.ui = $$.summernote.ui;

    this.initialize();
  }

  /**
   * create layout and initialize modules and other resources
   */
  initialize() {
    this.layoutInfo = this.ui.createLayout(this.$note);
    this.applyLayoutClassNames();
    this._initialize();
    this.$note.hide();
    return this;
  }

  normalizeClassNames(classNames) {
    return typeof classNames === 'string'
      ? classNames.split(/\s+/).filter(Boolean)
      : [];
  }

  applyLayoutClassNames() {
    [
      ['editorClassName', this.layoutInfo.editor],
      ['editingAreaClassName', this.layoutInfo.editingArea],
      ['editableClassName', this.layoutInfo.editable],
      ['codableClassName', this.layoutInfo.codable],
      ['statusbarClassName', this.layoutInfo.statusbar],
    ].forEach(([optionName, $node]) => {
      const classNames = this.normalizeClassNames(this.options[optionName]);
      if ($node && $node.length && classNames.length) {
        $node.addClass(classNames.join(' '));
      }
    });
  }

  /**
   * destroy modules and other resources and remove layout
   */
  destroy() {
    this._destroy();
    this.$note.removeData('summernote');
    this.ui.removeLayout(this.$note, this.layoutInfo);
  }

  recreate(optionsOverrides = {}) {
    const disabled = this.isDisabled();
    const html = this.code();
    const options = $$.extend(true, {}, this.options, optionsOverrides);

    delete options.id;
    options.container = this.explicitContainer;

    this.destroy();
    this.$note.html(html);

    const context = new Context(this.$note, options);
    this.$note.data('summernote', context);
    context.triggerEvent('init', context.layoutInfo);

    if (disabled) {
      context.disable();
    } else if (options.focus) {
      context.invoke('editor.focus');
    }

    return context;
  }

  /**
   * destory modules and other resources and initialize it again
   */
  reset() {
    const disabled = this.isDisabled();
    this.code(dom.emptyPara);
    this._destroy();
    this._initialize();

    if (disabled) {
      this.disable();
    }
  }

  _initialize() {
    // set own id
    this.options.id = func.uniqueId(Date.now());
    // set default container for tooltips, popovers, and dialogs
    this.options.container = this.options.container || this.layoutInfo.editor;

    // add optional buttons
    const buttons = $$.extend({}, this.options.buttons);
    const buttonKeys = Object.keys(buttons);
    buttonKeys.forEach((key) => {
      this.memo('button.' + key, buttons[key]);
    });

    const modules = $$.extend({}, this.options.modules, $$.summernote.plugins || {});
    const moduleKeys = Object.keys(modules);

    // add and initialize modules
    moduleKeys.forEach((key) => {
      this.module(key, modules[key], true);
    });

    moduleKeys.forEach((key) => {
      this.initializeModule(key);
    });
  }

  _destroy() {
    // destroy modules with reversed order
    const moduleKeys = Object.keys(this.modules);
    moduleKeys
      .reverse()
      .forEach((key) => {
        this.removeModule(key);
      });

    Object.keys(this.memos).forEach((key) => {
      this.removeMemo(key);
    });
    // trigger custom onDestroy callback
    this.triggerEvent('destroy', this);
  }

  code(html) {
    const isActivated = this.invoke('codeview.isActivated');

    if (html === undefined) {
      this.invoke('codeview.sync');
      return isActivated ? this.layoutInfo.codable.val() : this.layoutInfo.editable.html();
    } else {
      if (isActivated) {
        this.invoke('codeview.sync', html);
      } else {
        this.layoutInfo.editable.html(html);
      }
      this.$note.val(html);
      this.triggerEvent('change', html, this.layoutInfo.editable);
    }
  }

  isDisabled() {
    return this.layoutInfo.editable.attr('contenteditable') === 'false';
  }

  enable() {
    this.layoutInfo.editable.attr('contenteditable', 'true');
    this.invoke('toolbar.activate', true);
    this.triggerEvent('disable', false);
    this.options.editing = true;
  }

  disable() {
    // close codeview if codeview is opend
    if (this.invoke('codeview.isActivated')) {
      this.invoke('codeview.deactivate');
    }
    this.layoutInfo.editable.attr('contenteditable', 'false');
    this.options.editing = false;
    this.invoke('toolbar.deactivate', true);

    this.triggerEvent('disable', true);
  }

  triggerEvent() {
    const namespace = lists.head(arguments);
    const args = lists.tail(lists.from(arguments));

    const callback = this.options.callbacks[func.namespaceToCamel(namespace, 'on')];
    if (callback) {
      callback.apply(this.$note[0], args);
    }
    this.$note.trigger('summernote.' + namespace, args);
  }

  initializeModule(key) {
    const module = this.modules[key];
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
    this.modules[key].shouldInitialize = this.modules[key].shouldInitialize || func.ok;

    if (!withoutIntialize) {
      this.initializeModule(key);
    }
  }

  removeModule(key) {
    const module = this.modules[key];
    if (!module) {
      return;
    }
    const shouldInitialize = typeof module.shouldInitialize === 'function' ? module.shouldInitialize() : true;
    if (shouldInitialize) {
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
   * Some buttons need to change their visual style immediately once they get pressed
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
      const $target = $$(event.target);
      this.invoke(namespace, value || $target.closest('[data-value]').data('value'), $target);
    };
  }

  invoke() {
    const namespace = lists.head(arguments);
    const args = lists.tail(lists.from(arguments));

    const splits = namespace.split('.');
    const hasSeparator = splits.length > 1;
    const moduleName = hasSeparator && lists.head(splits);
    const methodName = hasSeparator ? lists.last(splits) : lists.head(splits);

    const module = this.modules[moduleName || 'editor'];
    if (!moduleName && this[methodName]) {
      return this[methodName].apply(this, args);
    } else if (module && module[methodName] && (typeof module.shouldInitialize !== 'function' || module.shouldInitialize())) {
      return module[methodName].apply(module, args);
    }
  }
}
