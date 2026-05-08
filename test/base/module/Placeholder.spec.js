/**
 * Placeholder.spec.js
 * (c) 2015-present Summernote Team
 * (c) 2026-present Jürgen Schwind
 * Summernote Next may be freely distributed under the MIT license.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import Context from '@/js/Context';
import '@/styles/bs5/summernote-bs5';

describe('Placeholder', () => {
  afterEach(() => {
    $$('body').empty();
  });

  it('should not be initialized by placeholder attribute without inheritPlaceHolder', () => {
    const options = $$.extend({}, $$.summernote.options);
    const context = new Context($$('<textarea placeholder="custom_placeholder"><p>hello</p></textarea>').appendTo('body'), options);
    const $editor = context.layoutInfo.editor;

    expect($editor.find('.note-placeholder').length).to.equal(0);
    context.destroy();
  });

  it('should be initialized by placeholder attribute with inheritPlaceHolder', () => {
    const options = $$.extend({}, $$.summernote.options);
    options.inheritPlaceholder = true;
    const context = new Context($$('<textarea placeholder="custom_placeholder"><p>hello</p></textarea>').appendTo('body'), options);
    const $editor = context.layoutInfo.editor;

    expect($editor.find('.note-placeholder').length).to.equal(1);
    expect($editor.find('.note-placeholder').html()).to.equal('custom_placeholder');
    context.destroy();
  });

  it('toggles placeholder visibility and focuses the editor on click', () => {
    const context = new Context($$('<div></div>').appendTo('body'), $$.extend({}, $$.summernote.options, {
      placeholder: 'Type here',
    }));
    const placeholder = context.modules.placeholder;
    const $placeholder = context.layoutInfo.editor.find('.note-placeholder');
    const toggleSpy = vi.spyOn(placeholder.$placeholder, 'toggle');
    const originalInvoke = context.invoke.bind(context);

    vi.spyOn(context, 'invoke').mockImplementation((command, ...args) => {
      if (command === 'codeview.isActivated') {
        return false;
      }
      if (command === 'editor.isEmpty') {
        return true;
      }

      return originalInvoke(command, ...args);
    });

    placeholder.events['summernote.init summernote.change']();
    expect(toggleSpy).toHaveBeenCalledWith(true);

    context.invoke.mockImplementation((command, ...args) => {
      if (command === 'codeview.isActivated') {
        return true;
      }
      if (command === 'editor.isEmpty') {
        return true;
      }
      if (command === 'focus') {
        return;
      }

      return originalInvoke(command, ...args);
    });

    placeholder.events['summernote.codeview.toggled']();
    expect(toggleSpy).toHaveBeenCalledWith(false);

    $placeholder.trigger('click');
    expect(context.invoke).toHaveBeenCalledWith('focus');
    context.destroy();
  });

  it('keeps an explicit placeholder when inheritPlaceholder has no source attribute', () => {
    const context = new Context($$('<textarea></textarea>').appendTo('body'), $$.extend({}, $$.summernote.options, {
      placeholder: 'Fallback placeholder',
      inheritPlaceholder: true,
    }));

    expect(context.layoutInfo.editor.find('.note-placeholder').html()).to.equal('Fallback placeholder');
    context.destroy();
  });
});
