import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import Context from '@/js/Context';
import Fullscreen from '@/js/module/Fullscreen';
import range from '@/js/core/range';
import '@/styles/bs5/summernote-bs5';

describe('Fullscreen', () => {
  let fullscreen;
  let context;

  beforeEach(() => {
    $$('body').empty();
    const options = $$.extend({}, $$.summernote.options);
    context = new Context($$('<div><p>hello</p></div>').appendTo('body'), options);
    fullscreen = new Fullscreen(context);
  });

  afterEach(() => {
    fullscreen?.destroy();
    context?.destroy();
    $$('body').empty();
  });

  it('toggles fullscreen mode', () => {
    expect(fullscreen.isFullscreen()).to.be.false;
    fullscreen.toggle();
    expect(fullscreen.isFullscreen()).to.be.true;
    expect(context.layoutInfo.editor.hasClass('fullscreen')).to.be.true;
    expect($$('html').hasClass('note-fullscreen-body')).to.be.true;
    fullscreen.toggle();
    expect(fullscreen.isFullscreen()).to.be.false;
    expect($$('html').hasClass('note-fullscreen-body')).to.be.false;
  });

  it('hides the air popover when toggling fullscreen in air mode', () => {
    context?.destroy();
    const options = $$.extend(true, {}, $$.summernote.options, {
      airMode: true,
    });
    context = new Context($$('<div><p>hello</p></div>').appendTo('body'), options);
    fullscreen = new Fullscreen(context);
    const hideSpy = vi.spyOn(context.modules.airPopover, 'hide');

    fullscreen.toggle();

    expect(fullscreen.isFullscreen()).to.be.true;
    expect(hideSpy).toHaveBeenCalled();
  });

  it('switches between air mode and toolbar fullscreen when configured', () => {
    context?.destroy();
    const $note = $$('<div><p>functional programming</p></div>').appendTo('body');
    const options = $$.extend(true, {}, $$.summernote.options, {
      airMode: true,
      airModeFullscreen: true,
    });

    context = new Context($note, options);
    const textNode = context.layoutInfo.editable.find('p')[0].firstChild;
    const selectedRange = range.create(textNode, 0, textNode, textNode.textContent.length);
    selectedRange.select();
    context.invoke('editor.setLastRange', selectedRange);
    context.modules.airPopover.pageX = 10;
    context.modules.airPopover.pageY = 10;
    context.modules.airPopover.update(true);

    context.invoke('fullscreen.toggle');
    context = $note.data('summernote');

    expect(context.options.airMode).to.be.false;
    expect(context.layoutInfo.toolbar.length).to.equal(1);
    expect(context.layoutInfo.editor.hasClass('fullscreen')).to.be.true;
    expect($$('html').hasClass('note-fullscreen-body')).to.be.true;

    context.invoke('fullscreen.toggle');
    context = $note.data('summernote');

    expect(context.options.airMode).to.be.true;
    expect(context.layoutInfo.toolbar.length).to.equal(0);
    expect(context.layoutInfo.editor.hasClass('note-airframe')).to.be.true;
    expect(context.modules.airPopover.$popover.css('display')).to.equal('block');
  });
});
