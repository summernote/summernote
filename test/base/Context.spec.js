/**
 * Context.spec.js
 * (c) 2015-present Summernote Team
 * (c) 2026-present Jürgen Schwind
 * Summernote Next may be freely distributed under the MIT license.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import $$, { DomQuery } from '@/js/core/dom-query.js';
import dom from '@/js/core/dom';
import env from '@/js/core/env';
import Context from '@/js/Context';
import '@/styles/bs5/summernote-bs5';

describe('Context lifecycle', () => {
  afterEach(() => {
    $$('body').empty();
  });

  it('should be initialized without calling callback', () => {
    const spy = vi.fn();
    const $note = $$('<div><p>hello</p></div>').appendTo('body');
    $note.on('summernote.change', spy);

    const context = new Context($note, $$.summernote.options);
    expect(spy).not.toHaveBeenCalled();

    if (!env.isMSIE) {
      context.invoke('insertText', 'hello');
      expect(spy).toHaveBeenCalled();
    }

    context.destroy();
  });

  it('should preserve user events handler after destroy', () => {
    const spy = vi.fn();
    const $note = $$('<div><p>hello</p></div>').appendTo('body');
    $note.on('click', spy);

    const context = new Context($note, $$.summernote.options);
    context.destroy();

    $note.trigger('click');
    expect(spy).toHaveBeenCalled();
  });
});

describe('Context', () => {
  let context;

  beforeEach(() => {
    $$('body').empty();
    context = new Context($$('<div><p>hello</p></div>').appendTo('body'), $$.summernote.options);
  });

  afterEach(() => {
    context?.destroy();
    $$('body').empty();
  });

  it('should get or set contents with code', () => {
    expect(context.code()).to.equalsIgnoreCase('<p>hello</p>');
    context.code('<p>hello2</p>');
    expect(context.code()).to.equalsIgnoreCase('<p>hello2</p>');
  });

  it('should enable or disable editor', () => {
    expect(context.isDisabled()).to.be.false;
    context.disable();
    expect(context.isDisabled()).to.be.true;
    context.enable();
    expect(context.isDisabled()).to.be.false;
  });

  it('should preserve disabled status after reset', () => {
    expect(context.isDisabled()).to.be.false;
    context.disable();
    expect(context.isDisabled()).to.be.true;
    context.reset();
    expect(context.isDisabled()).to.be.true;
  });

  it('keeps the editor enabled when resetting an enabled instance', () => {
    context.reset();

    expect(context.isDisabled()).to.be.false;
  });

  it('inherits the Bootstrap card radius on the frame and status bar', () => {
    const $card = $$([
      '<div class="card">',
      '  <div class="card-body"></div>',
      '</div>',
    ].join('')).appendTo('body');
    const editorStyle = getComputedStyle(context.layoutInfo.editor[0]);
    const toolbarStyle = getComputedStyle(context.layoutInfo.toolbar[0]);
    const statusbarStyle = getComputedStyle(context.layoutInfo.statusbar[0]);
    const cardStyle = getComputedStyle($card[0]);

    expect(editorStyle.borderTopWidth).to.equal(cardStyle.borderTopWidth);
    expect(editorStyle.borderRightWidth).to.equal(cardStyle.borderRightWidth);
    expect(editorStyle.borderBottomWidth).to.equal(cardStyle.borderBottomWidth);
    expect(editorStyle.borderLeftWidth).to.equal(cardStyle.borderLeftWidth);
    expect(editorStyle.borderTopLeftRadius).to.equal(cardStyle.borderTopLeftRadius);
    expect(toolbarStyle.borderTopLeftRadius).to.equal(cardStyle.borderTopLeftRadius);
    expect(toolbarStyle.borderTopRightRadius).to.equal(cardStyle.borderTopRightRadius);
    expect(statusbarStyle.borderBottomLeftRadius).to.equal(cardStyle.borderBottomLeftRadius);
    expect(statusbarStyle.borderBottomRightRadius).to.equal(cardStyle.borderBottomRightRadius);
    expect(context.layoutInfo.editor.hasClass('note-editor-toolbar-top')).to.be.true;
  });

  it('marks bottom-toolbar layouts and rounds the toolbar outer corners there', () => {
    context.destroy();
    context = new Context($$('<div><p>hello</p></div>').appendTo('body'), $$.extend({}, $$.summernote.options, {
      toolbarPosition: 'bottom',
    }));

    const $card = $$([
      '<div class="card">',
      '  <div class="card-body"></div>',
      '</div>',
    ].join('')).appendTo('body');
    const toolbarStyle = getComputedStyle(context.layoutInfo.toolbar[0]);
    const cardStyle = getComputedStyle($card[0]);

    expect(context.layoutInfo.editor.hasClass('note-editor-toolbar-bottom')).to.be.true;
    expect(toolbarStyle.borderBottomLeftRadius).to.equal(cardStyle.borderBottomLeftRadius);
    expect(toolbarStyle.borderBottomRightRadius).to.equal(cardStyle.borderBottomRightRadius);
  });

  it('applies Bootstrap utility classes to editor layout sections', () => {
    context.destroy();

    const options = $$.extend({}, $$.summernote.options, {
      editorClassName: 'shadow-lg border-0',
      editingAreaClassName: 'overflow-hidden',
      editableClassName: 'px-4',
      codableClassName: 'text-bg-dark',
      statusbarClassName: '',
    });

    context = new Context($$('<div><p>hello</p></div>').appendTo('body'), options);

    expect(context.layoutInfo.editor.hasClass('shadow-lg')).to.be.true;
    expect(context.layoutInfo.editor.hasClass('border-0')).to.be.true;
    expect(context.layoutInfo.editingArea.hasClass('overflow-hidden')).to.be.true;
    expect(context.layoutInfo.editable.hasClass('px-4')).to.be.true;
    expect(context.layoutInfo.codable.hasClass('text-bg-dark')).to.be.true;
    expect(context.layoutInfo.statusbar.hasClass('border-top-0')).to.be.true;
    expect(context.layoutInfo.statusbar.hasClass('shadow-sm')).to.be.true;
  });

  it('returns an empty list when class names are not provided as a string', () => {
    expect(context.normalizeClassNames(null)).to.deep.equal([]);
  });

  it('recreates the editor with preserved disabled state and explicit container', () => {
    const $container = $$('<div class="container"></div>').appendTo('body');

    context.destroy();
    context = new Context($$('<div><p>hello</p></div>').appendTo('body'), $$.extend({}, $$.summernote.options, {
      container: $container,
    }));
    context.disable();

    const recreated = context.recreate({
      focus: true,
      editableClassName: 'recreated-editable',
    });

    expect(recreated).not.to.equal(context);
    expect(recreated.$note.data('summernote')).to.equal(recreated);
    expect(recreated.isDisabled()).to.be.true;
    expect(recreated.options.container[0]).to.equal($container[0]);
    expect(recreated.layoutInfo.editable.hasClass('recreated-editable')).to.be.true;

    context = recreated;
  });

  it('focuses the recreated editor when the editor stays enabled', () => {
    const invokeSpy = vi.spyOn(Context.prototype, 'invoke');

    const recreated = context.recreate({
      focus: true,
    });

    expect(recreated).not.to.equal(context);
    expect(invokeSpy).toHaveBeenCalledWith('editor.focus');

    context = recreated;
  });

  it('recreates the editor without overrides', () => {
    const recreated = context.recreate();

    expect(recreated).not.to.equal(context);
    expect(recreated.code()).to.equalsIgnoreCase('<p>hello</p>');

    context = recreated;
  });

  it('deactivates codeview before disabling the editor', () => {
    const deactivate = vi.fn();

    context.modules.codeview = {
      isActivated: () => true,
      deactivate,
      shouldInitialize: () => true,
    };

    context.disable();

    expect(deactivate).toHaveBeenCalledTimes(1);
    expect(context.isDisabled()).to.be.true;
  });

  it('supports module access, eager initialization, and memo cleanup', () => {
    const initialize = vi.fn();
    const destroy = vi.fn();

    class TestModule {
      constructor(instance) {
        this.context = instance;
      }

      shouldInitialize() {
        return true;
      }

      initialize() {
        initialize();
      }
    }

    context.module('testModule', TestModule);

    expect(initialize).toHaveBeenCalledTimes(1);
    expect(context.module('testModule')).to.equal(context.modules.testModule);

    context.memo('cleanup', { destroy });
    context.removeMemo('cleanup');

    expect(destroy).toHaveBeenCalledTimes(1);
    expect(context.memo('cleanup')).to.equal(undefined);
  });

  it('registers optional buttons as memos during initialization', () => {
    const buttonFactory = vi.fn();

    context.destroy();
    context = new Context($$('<div><p>hello</p></div>').appendTo('body'), $$.extend({}, $$.summernote.options, {
      buttons: {
        customButton: buttonFactory,
      },
    }));

    expect(context.memo('button.customButton')).to.equal(buttonFactory);
  });

  it('registers plugin modules contributed through the global plugin registry', () => {
    const previousPlugins = $$.summernote.plugins;

    class PluginModule {
      constructor(instance) {
        this.context = instance;
      }
    }

    $$.summernote.plugins = {
      pluginModule: PluginModule,
    };

    context.destroy();
    context = new Context($$('<div><p>hello</p></div>').appendTo('body'), $$.summernote.options);

    expect(context.module('pluginModule')).toBeInstanceOf(PluginModule);

    $$.summernote.plugins = previousPlugins;
  });

  it('initializes cleanly when no global plugins are registered', () => {
    const previousPlugins = $$.summernote.plugins;

    $$.summernote.plugins = null;

    context.destroy();
    context = new Context($$('<div><p>hello</p></div>').appendTo('body'), $$.summernote.options);

    expect(context.module('editor')).to.exist;

    $$.summernote.plugins = previousPlugins;
  });

  it('reads from the codable element when codeview is active', () => {
    context.modules.codeview = {
      isActivated: () => true,
      sync: vi.fn(),
      shouldInitialize: () => true,
    };
    context.layoutInfo.codable.val('<p>from-codeview</p>');

    expect(context.code()).to.equal('<p>from-codeview</p>');
  });

  it('creates invoke handlers that resolve values from data attributes and refresh styles', () => {
    const invokeSpy = vi.spyOn(context, 'invoke');
    const event = {
      preventDefault: vi.fn(),
      target: $$('<button type="button" data-value="paragraph"><span></span></button>')[0].firstChild,
    };

    context.createInvokeHandler('editor.formatBlock')(event);
    context.createInvokeHandlerAndUpdateState('editor.formatBlock')(event);

    expect(event.preventDefault).toHaveBeenCalledTimes(2);
    expect(invokeSpy).toHaveBeenCalledWith('editor.formatBlock', 'paragraph', expect.any(DomQuery));
    expect(invokeSpy).toHaveBeenCalledWith('buttons.updateCurrentStyle');
  });

  it('syncs codeview content when setting code while codeview is active', () => {
    const sync = vi.fn();

    context.modules.codeview = {
      isActivated: () => true,
      sync,
      shouldInitialize: () => true,
    };

    context.code('<p>updated</p>');

    expect(sync).toHaveBeenCalledWith('<p>updated</p>');
    expect(context.$note.val()).to.equal('<p>updated</p>');
  });

  it('skips initialization and destruction for modules that opt out', () => {
    const initialize = vi.fn();
    const destroy = vi.fn();

    class DeferredModule {
      shouldInitialize() {
        return false;
      }

      initialize() {
        initialize();
      }

      destroy() {
        destroy();
      }
    }

    context.module('deferred', DeferredModule);
    context.removeModule('deferred');

    expect(initialize).not.toHaveBeenCalled();
    expect(destroy).not.toHaveBeenCalled();
    expect(context.module('deferred')).to.equal(undefined);
  });

  it('defaults module initialization and destruction behavior when no shouldInitialize hook exists', () => {
    const initialize = vi.fn();
    const destroy = vi.fn();

    context.modules.loose = {
      initialize,
      destroy,
    };

    context.initializeModule('loose');
    context.removeModule('loose');

    expect(initialize).toHaveBeenCalledTimes(1);
    expect(destroy).toHaveBeenCalledTimes(1);
  });

  it('defaults removeModule initialization checks when a module has no shouldInitialize hook', () => {
    const destroy = vi.fn();

    context.modules.looseRemoval = {
      destroy,
    };

    context.removeModule('looseRemoval');

    expect(destroy).toHaveBeenCalledTimes(1);
    expect(context.module('looseRemoval')).to.equal(undefined);
  });

  it('detaches registered module events before destroying the module', () => {
    const detachEvents = vi.spyOn(dom, 'detachEvents');
    const destroy = vi.fn();
    const events = {
      click: vi.fn(),
    };

    context.modules.eventful = {
      shouldInitialize: () => true,
      events,
      destroy,
    };

    context.removeModule('eventful');

    expect(detachEvents).toHaveBeenCalledWith(context.$note, events);
    expect(destroy).toHaveBeenCalledTimes(1);
  });

  it('ignores removing modules that are not registered', () => {
    expect(() => context.removeModule('missing-module')).not.to.throw();
  });
});
