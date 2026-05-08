import $$, { DomQuery } from './core/dom-query.js';
import env from './core/env';
import lists from './core/lists';
import Context from './Context';

function resolveCollection(target) {
  const collection = target instanceof Context ? target.$note : $$(target);

  if (!collection.length) {
    throw new Error('Summernote target not found.');
  }

  return collection;
}

function getContexts(target, requireInitialized = true) {
  const collection = resolveCollection(target);
  const contexts = collection.map((idx, note) => $$(note).data('summernote'));

  if (requireInitialized && contexts.some((context) => !context)) {
    throw new Error('Summernote is not initialized on the target.');
  }

  return contexts;
}

function unwrapResult(results) {
  return results.length === 1 ? results[0] : results;
}

/**
 * Summernote API
 *
 * @param {Object|String}
 * @return {this}
 */
DomQuery.prototype.summernote = function() {
  const type = typeof(lists.head(arguments));
  const isExternalAPICalled = type === 'string';
  const hasInitOptions = type === 'object';
  const initOptions = hasInitOptions ? lists.head(arguments) : {};

  const options = $$.extend({}, $$.summernote.options, initOptions);

  // Update options
  options.langInfo = $$.extend(true, {}, $$.summernote.lang['en-US'], $$.summernote.lang[options.lang]);
  if (!Object.prototype.hasOwnProperty.call(initOptions, 'colorsName') && options.langInfo.color?.colorsName) {
    options.colorsName = options.langInfo.color.colorsName;
  }
  options.icons = $$.extend(true, {}, $$.summernote.options.icons, options.icons);
  options.tooltip = options.tooltip === 'auto' ? !env.isSupportTouch : options.tooltip;

  this.each((idx, note) => {
    const $note = $$(note);
    if (!$note.data('summernote')) {
      const context = new Context($note, options);
      $note.data('summernote', context);
      $note.data('summernote').triggerEvent('init', context.layoutInfo);
    }
  });

  const $note = this.first();
  if ($note.length) {
    const context = $note.data('summernote');
    if (isExternalAPICalled) {
      return context.invoke.apply(context, lists.from(arguments));
    } else if (options.focus) {
      context.invoke('editor.focus');
    }
  }

  return this;
};

Object.assign($$, {
  create(target, options = {}) {
    const collection = resolveCollection(target);
    collection.summernote(options);
    return unwrapResult(getContexts(collection));
  },

  getInstance(target) {
    return unwrapResult(getContexts(target));
  },

  destroy(target) {
    getContexts(target).forEach((context) => context.destroy());
  },

  invoke(target, method, ...args) {
    return unwrapResult(getContexts(target).map((context) => context.invoke(method, ...args)));
  },
});
