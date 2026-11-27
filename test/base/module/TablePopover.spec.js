import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import $ from 'jquery';
import Context from '@/js/Context';
import '@/styles/lite/summernote-lite';

describe('TablePopover', () => {
  let $note, context, $editable, popover;

  beforeEach(() => {
    $note = $('<div></div>').appendTo('body');
    context = new Context($note, $.extend({}, $.summernote.options));
    $editable = context.layoutInfo.editable;
    popover = context.modules.tablePopover;
  });

  afterEach(() => {
    context.destroy();
    $note.remove();
  });

  it.each([
    ['td', 'text', 'td'],
    ['td', '<b>text</b>', 'b'],
    ['td', '<b><u>text</u></b>', 'u'],
    ['td', '<p><b><u><span>text</span></u></b></p>', 'span'],
    ['th', '<b><u>text</u></b>', 'u'],
  ])('shows controls when clicking %s content: %s', (tag, content, selector) => {
    $editable.html(`<table><tbody><tr><${tag}>${content}</${tag}></tr></tbody></table>`);
    $editable.find(selector)[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(popover.$popover.css('display')).to.equal('block');
  });

  it('hides controls when clicking outside a cell', () => {
    $editable.html('<table><tbody><tr><td>cell</td></tr></tbody></table><p><b>outside</b></p>');
    popover.update($editable.find('td')[0]);
    $editable.find('b')[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(popover.$popover.css('display')).to.equal('none');
  });

  it('hides controls when updating without a target', () => {
    $editable.html('<table><tbody><tr><td>cell</td></tr></tbody></table>');
    popover.update($editable.find('td')[0]);
    popover.update();

    expect(popover.$popover.css('display')).to.equal('none');
  });

  it('does not show controls when the editor is disabled', () => {
    $editable.html('<table><tbody><tr><td><b><u>text</u></b></td></tr></tbody></table>');
    context.disable();
    popover.update($editable.find('u')[0]);

    expect(popover.$popover.css('display')).to.equal('none');
  });

  it('does not use a table cell outside the editing area', () => {
    const $table = $('<table><tbody><tr><td></td></tr></tbody></table>').appendTo('body');
    $table.find('td').append(context.layoutInfo.editor);
    $editable.html('<p><b><u>text</u></b></p>');
    popover.update($editable.find('u')[0]);

    expect(popover.$popover.css('display')).to.equal('none');
    context.layoutInfo.editor.appendTo('body');
    $table.remove();
  });
});
