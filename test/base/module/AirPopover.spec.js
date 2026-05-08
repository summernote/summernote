import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from '/test/util';
import $$ from '@/js/core/dom-query.js';
import range from '@/js/core/range';
import Context from '@/js/Context';
import AirPopover from '@/js/module/AirPopover';
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

  it('updates coordinates from events and hides only when allowed', () => {
    const airPopover = context.modules.airPopover;
    const originalInvoke = context.invoke.bind(context);
    vi.spyOn(context, 'invoke').mockImplementation((command, ...args) => {
      if (command === 'editor.getLastRange') {
        return {
          getWordRange() {
            return {
              getClientRects() {
                return [new DOMRect(35, 45, 10, 5)];
              },
            };
          },
        };
      }

      return originalInvoke(command, ...args);
    });

    const updateSpy = vi.spyOn(airPopover, 'update');
    const hideSpy = vi.spyOn(airPopover, 'hide');

    airPopover.events['summernote.contextmenu']({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    });
    expect(updateSpy).toHaveBeenCalledWith(true);
    airPopover.onContextmenu = false;

    airPopover.events['summernote.mousedown'](null, { pageX: 11, pageY: 12 });
    expect(airPopover.pageX).to.equal(11);
    expect(airPopover.pageY).to.equal(12);

    airPopover.events['summernote.keyup summernote.mouseup summernote.scroll'](null, {
      type: 'keyup',
      pageX: 1,
      pageY: 2,
    });
    expect(airPopover.pageX).to.equal(35);
    expect(airPopover.pageY).to.equal(45);

    airPopover.events['summernote.keyup summernote.mouseup summernote.scroll'](null, {
      type: 'mouseup',
      pageX: 18,
      pageY: 28,
    });
    expect(airPopover.pageX).to.equal(18);
    expect(airPopover.pageY).to.equal(28);

    airPopover.events['summernote.disable summernote.change summernote.dialog.shown summernote.blur']();
    expect(hideSpy).toHaveBeenCalled();

    airPopover.$popover.is = vi.fn(() => true);
    hideSpy.mockClear();
    airPopover.events['summernote.focusout']();
    expect(hideSpy).not.toHaveBeenCalled();

    airPopover.$popover.is = vi.fn(() => false);
    airPopover.events['summernote.focusout']();
    expect(hideSpy).toHaveBeenCalledTimes(1);

    airPopover.$popover.trigger('mousedown');
    expect(airPopover.hidable).to.equal(false);
    airPopover.$popover.show();
    airPopover.hide();
    expect(airPopover.$popover.css('display')).to.equal('block');
    airPopover.$popover.trigger('mouseup');
    expect(airPopover.hidable).to.equal(true);
    airPopover.hide();
    expect(airPopover.$popover.css('display')).to.equal('none');
  });

  it('updates codeview state, hides collapsed selections, and skips empty configs', () => {
    const airPopover = context.modules.airPopover;
    const toggleSpy = vi.spyOn(airPopover.ui, 'toggleBtnActive');
    const hideSpy = vi.spyOn(airPopover, 'hide');
    const originalInvoke = context.invoke.bind(context);
    vi.spyOn(context, 'invoke').mockImplementation((command, ...args) => {
      if (command === 'editor.currentStyle') {
        return {
          range: {
            isCollapsed() {
              return true;
            },
          },
        };
      }

      return originalInvoke(command, ...args);
    });

    airPopover.update(false);
    expect(hideSpy).toHaveBeenCalled();

    airPopover.updateCodeview(false);
    airPopover.updateCodeview(true);
    expect(toggleSpy).toHaveBeenCalledWith(airPopover.$popover.find('.btn-codeview'), false);
    expect(toggleSpy).toHaveBeenCalledWith(airPopover.$popover.find('.btn-codeview'), true);

    const disabledAirPopover = new AirPopover({
      options: {
        airMode: false,
        popover: {
          air: [],
        },
      },
    });
    expect(disabledAirPopover.shouldInitialize()).to.equal(false);
  });

  it('ignores editing-disabled context menus and deferred contextmenu mouse events', () => {
    const airPopover = context.modules.airPopover;
    const updateSpy = vi.spyOn(airPopover, 'update');
    const event = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    };

    context.options.editing = false;
    airPopover.events['summernote.contextmenu'](event);
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(updateSpy).not.toHaveBeenCalled();

    context.options.editing = true;
    airPopover.onContextmenu = true;
    airPopover.events['summernote.keyup summernote.mouseup summernote.scroll'](null, {
      type: 'mouseup',
      pageX: 4,
      pageY: 5,
    });
    expect(updateSpy).not.toHaveBeenCalled();
    expect(airPopover.onContextmenu).to.equal(false);
  });
});
