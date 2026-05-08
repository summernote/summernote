/**
 * Placeholder.spec.js
 * (c) 2015-present Summernote Team
 * (c) 2026-present Jürgen Schwind
 * Summernote Next may be freely distributed under the MIT license.
 */

import { afterEach, describe, expect, it } from 'vitest';
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
});
