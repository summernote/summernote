/**
 * Context.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */

import { describe, it, expect, vi } from 'vitest';
import $ from 'jquery';
import env from '@/js/core/env';
import Context from '@/js/Context';
import 'bootstrap';
import '@/styles/lite/summernote-lite';

describe('Context lifecycle', () => {
  it('should be initialized without calling callback', () => {
    var spy = vi.fn();
    var $note = $('<div><p>hello</p></div>');
    $note.on('summernote.change', spy);

    var context = new Context($note, $.summernote.options);
    expect(spy).not.toHaveBeenCalled();

    // [workaround]
    //  - IE8-11 can't create range in headless mode
    if (!env.isMSIE) {
      context.invoke('insertText', 'hello');
      expect(spy).toHaveBeenCalled();
    }
  });

  it('should preserve user events handler after destroy', () => {
    var spy = vi.fn();
    var $note = $('<div><p>hello</p></div>');
    $note.on('click', spy);

    var context = new Context($note, $.summernote.options);
    context.destroy();

    $note.trigger('click');
    expect(spy).toHaveBeenCalled();
  });
});

describe('Context', () => {
  var context;
  beforeEach(() => {
    context = new Context($('<div><p>hello</p></div>'), $.summernote.options);
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
});
