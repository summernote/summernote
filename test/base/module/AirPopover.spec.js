import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from '/test/util';
import $$ from '@/js/core/dom-query.js';
import range from '@/js/core/range';
import Context from '@/js/Context';
import '@/styles/bs5/summernote-bs5';

function dispatchSelectionEvent(element, type, x, y) {
  element.dispatchEvent(new MouseEvent(type, {
    bubbles: true,
    clientX: x,
    clientY: y,
    pageX: x + window.scrollX,
    pageY: y + window.scrollY,
  }));
}

describe('AirPopover', () => {
  let context;
  let $editable;

  beforeEach(() => {
    $$('body').empty();
    const $note = $$('<div><p>functional programming</p></div>').appendTo('body');

    context = new Context($note, $$.extend(true, {}, $$.summernote.options, {
      airMode: true,
      popover: {
        air: [
          ['font', ['bold', 'underline']],
          ['insert', ['link']],
        ],
      },
    }));
    $editable = context.layoutInfo.editable;
  });

  afterEach(() => {
    context?.destroy();
    $$('body').empty();
  });

  it('uses the inline air layout without the fixed toolbar or statusbar', () => {
    expect(context.layoutInfo.toolbar.length).to.equal(0);
    expect(context.layoutInfo.statusbar.length).to.equal(0);
    expect(context.layoutInfo.editor.hasClass('note-airframe')).to.be.true;
  });

  it('shows the air popover near the selected text on mouseup', async() => {
    const textNode = $editable.find('p')[0].firstChild;
    const editorRect = $editable[0].getBoundingClientRect();
    const pointX = editorRect.left + 40;
    const pointY = editorRect.top + 20;

    dispatchSelectionEvent($editable[0], 'mousedown', pointX, pointY);
    context.modules.editor.setLastRange(
      range.create(textNode, 0, textNode, 10).select(),
    );
    dispatchSelectionEvent($editable[0], 'mouseup', pointX, pointY);
    context.modules.airPopover.update(true);
    await nextTick();

    const $popover = $$('.note-air-popover');

    expect($popover.css('display')).to.equal('block');
    expect($popover.find('.note-btn-bold').length).to.equal(1);
    expect(parseFloat($popover.css('left'))).to.be.greaterThanOrEqual(0);
  });
});
