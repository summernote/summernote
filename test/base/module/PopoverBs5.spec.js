import { beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from '/test/util';
import $$ from '@/js/core/dom-query.js';
import Context from '@/js/Context';
import { IMAGE_POPOVER_GAP } from '@/js/module/ImagePopover.js';
import '@/styles/bs5/summernote-bs5';

describe('Popover BS5', () => {
  let context;
  let $editable;

  beforeEach(() => {
    $$('body').empty();

    const $note = $$('<div><p>hello</p></div>').appendTo('body');
    context = new Context($note, $$.extend({}, $$.summernote.options));
    $editable = context.layoutInfo.editable;
  });

  it('keeps the image popover next to the click point with compact BS5 layout', async() => {
    const dataUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    $editable.html(`<p><img id="test-image" src="${dataUrl}" style="display:block;width:320px;height:80px"></p>`);

    const image = $editable.find('#test-image')[0];
    const imageRect = image.getBoundingClientRect();
    const clickX = imageRect.left + 250;
    const clickY = imageRect.top + 30;

    image.dispatchEvent(new MouseEvent('mousedown', {
      bubbles: true,
      clientX: clickX,
      clientY: clickY,
      pageX: clickX + window.scrollX,
      pageY: clickY + window.scrollY,
    }));

    await nextTick();

    const $popover = $$('.note-image-popover');
    const popoverRect = $popover[0].getBoundingClientRect();
    const contentStyle = getComputedStyle($popover.find('.note-popover-content')[0]);
    const buttonLabels = $popover.find('button').map((idx, button) => button.getAttribute('title'));
    const buttonWidths = $popover.find('button').map((idx, button) => button.getBoundingClientRect().width);

    expect($popover.attr('data-popper-placement')).to.equal('bottom');
    expect(popoverRect.top).to.be.closeTo(clickY + IMAGE_POPOVER_GAP, 1);
    expect(clickX).to.be.at.least(popoverRect.left);
    expect(clickX).to.be.at.most(popoverRect.right);
    expect(contentStyle.display).to.equal('flex');
    expect(contentStyle.flexWrap).to.equal('nowrap');
    expect(buttonLabels).to.deep.equal([
      'Resize full',
      'Resize half',
      'Resize quarter',
      'Original size',
      'Float Left',
      'Float Right',
      'Remove float',
      'Remove Image',
    ]);
    expect(buttonWidths.every((width) => width > 0)).to.be.true;
    expect($popover.find('.popover-arrow').length).to.equal(0);
  });

  it('renders the table popover as one compact BS5 row', async() => {
    $editable.html('<table class="table table-bordered"><tbody><tr><td id="cell">One</td><td>Two</td></tr></tbody></table>');

    const cell = $editable.find('#cell')[0];
    const cellRect = cell.getBoundingClientRect();
    const clickX = cellRect.left + 10;
    const clickY = cellRect.top + 10;

    cell.dispatchEvent(new MouseEvent('mousedown', {
      bubbles: true,
      clientX: clickX,
      clientY: clickY,
      pageX: clickX + window.scrollX,
      pageY: clickY + window.scrollY,
    }));

    await nextTick();

    const $popover = $$('.note-table-popover');
    const popoverRect = $popover[0].getBoundingClientRect();
    const contentStyle = getComputedStyle($popover.find('.note-popover-content')[0]);
    const groupStyles = $popover.find('.note-btn-group').map((idx, group) => {
      const style = getComputedStyle(group);
      return { marginTop: style.marginTop, marginRight: style.marginRight };
    });

    expect($popover.attr('data-popper-placement')).to.equal('bottom');
    expect(popoverRect.top).to.be.at.least(cellRect.bottom);
    expect(contentStyle.display).to.equal('flex');
    expect(contentStyle.flexWrap).to.equal('nowrap');
    expect($popover.find('.popover-arrow').length).to.equal(0);
    expect(groupStyles).to.deep.equal([
      { marginTop: '0px', marginRight: '0px' },
      { marginTop: '0px', marginRight: '0px' },
    ]);
  });
});
