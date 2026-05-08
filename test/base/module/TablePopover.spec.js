import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import env from '@/js/core/env';
import TablePopover from '@/js/module/TablePopover';
import '@/styles/bs5/summernote-bs5';

function createContext(overrides = {}) {
  const $container = $$('<div style="position:relative;width:420px;height:260px"></div>').appendTo('body');
  const options = $$.extend(true, {}, $$.summernote.options, {
    container: $container,
  }, overrides.options);
  $$.summernote.ui = $$.summernote.ui_template(options);
  return {
    options,
    layoutInfo: {
      editable: $$('<div></div>').appendTo($container),
    },
    invoke: vi.fn(),
    isDisabled: vi.fn(() => false),
    ...overrides,
  };
}

describe('TablePopover', () => {
  const originalIsFF = env.isFF;
  let originalExecCommand;

  beforeEach(() => {
    $$('body').empty();
    originalExecCommand = document.execCommand;
  });

  afterEach(() => {
    env.isFF = originalIsFF;
    document.execCommand = originalExecCommand;
    vi.restoreAllMocks();
    $$('body').empty();
  });

  it('initializes with firefox table editing disabled and updates cell placement', () => {
    env.isFF = true;
    document.execCommand = vi.fn();

    const context = createContext();
    const tablePopover = new TablePopover(context);
    tablePopover.initialize();

    expect(document.execCommand).toHaveBeenCalledWith('enableInlineTableEditing', false, false);
    expect(tablePopover.shouldInitialize()).to.equal(true);

    const cell = $$('<table><tbody><tr><td id="cell"><span id="child">One</span></td></tr></tbody></table>')
      .appendTo(context.layoutInfo.editable)
      .find('#cell')[0];
    const child = cell.querySelector('#child');

    expect(tablePopover.update(child)).to.equal(true);
    expect(context.invoke).toHaveBeenCalledWith('editor.saveTarget', cell);
    expect(tablePopover.$popover.attr('data-popper-placement')).to.equal('bottom');
    expect(tablePopover.$popover.css('display')).to.equal('block');

    expect(tablePopover.update(document.createElement('div'))).to.equal(false);
    expect(tablePopover.$popover.css('display')).to.equal('none');

    const img = $$('<img>').appendTo(cell)[0];
    expect(tablePopover.update(img)).to.equal(false);

    context.isDisabled.mockReturnValue(true);
    expect(tablePopover.update(cell)).to.equal(false);
  });

  it('handles blur lifecycle, skipped configs, and teardown', () => {
    const disabled = new TablePopover(createContext({
      options: {
        popover: {
          table: [],
        },
      },
    }));
    expect(disabled.shouldInitialize()).to.equal(false);

    const context = createContext();
    const tablePopover = new TablePopover(context);
    tablePopover.initialize();
    const hideSpy = vi.spyOn(tablePopover, 'hide');
    const updateSpy = vi.spyOn(tablePopover, 'update');

    tablePopover.events['summernote.blur'](null, {
      originalEvent: {
        relatedTarget: tablePopover.$popover[0],
      },
    });
    expect(hideSpy).not.toHaveBeenCalled();

    tablePopover.events['summernote.blur'](null, {
      originalEvent: {
        relatedTarget: document.body,
      },
    });
    tablePopover.events['summernote.blur'](null, {});
    tablePopover.events['summernote.mousedown'](null, { target: document.createElement('div') });
    tablePopover.events['summernote.keyup summernote.scroll summernote.change']();
    tablePopover.events['summernote.disable summernote.dialog.shown']();
    expect(hideSpy.mock.calls.length).to.be.greaterThanOrEqual(2);
    expect(updateSpy).toHaveBeenCalledTimes(2);

    const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    tablePopover.$popover[0].dispatchEvent(mouseDownEvent);
    expect(mouseDownEvent.defaultPrevented).to.equal(true);

    const popoverNode = tablePopover.$popover[0];
    tablePopover.destroy();
    expect(popoverNode.isConnected).to.equal(false);
  });
});
