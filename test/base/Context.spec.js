/**
 * Context.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
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
});
