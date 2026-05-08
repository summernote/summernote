import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import LinkPopover from '@/js/module/LinkPopover';
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
    ...overrides,
  };
}

describe('LinkPopover', () => {
  beforeEach(() => {
    $$('body').empty();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    $$('body').empty();
  });

  it('initializes, positions anchors, and hides when focus or selection rules fail', () => {
    const context = createContext();
    const linkPopover = new LinkPopover(context);
    linkPopover.initialize();

    const anchor = $$('<a href="https://example.com">Example</a>').appendTo(context.layoutInfo.editable)[0];
    context.invoke.mockImplementation((command) => {
      if (command === 'editor.hasFocus') {
        return true;
      }
      if (command === 'editor.getLastRange') {
        return {
          isCollapsed() {
            return true;
          },
          isOnAnchor() {
            return true;
          },
          sc: anchor.firstChild,
        };
      }
    });

    expect(linkPopover.shouldInitialize()).to.equal(true);
    linkPopover.update();
    expect(linkPopover.$popover.css('display')).to.equal('block');
    expect(linkPopover.$popover.find('a').attr('href')).to.equal('https://example.com');
    expect(linkPopover.$popover.find('a').text()).to.equal('https://example.com');

    context.invoke.mockImplementation((command) => {
      if (command === 'editor.hasFocus') {
        return false;
      }
    });
    linkPopover.update();
    expect(linkPopover.$popover.css('display')).to.equal('none');

    context.invoke.mockImplementation((command) => {
      if (command === 'editor.hasFocus') {
        return true;
      }
      if (command === 'editor.getLastRange') {
        return {
          isCollapsed() {
            return false;
          },
          isOnAnchor() {
            return true;
          },
        };
      }
    });
    linkPopover.update();
    expect(linkPopover.$popover.css('display')).to.equal('none');

    context.invoke.mockImplementation((command) => {
      if (command === 'editor.hasFocus') {
        return true;
      }
      if (command === 'editor.getLastRange') {
        return {
          isCollapsed() {
            return true;
          },
          isOnAnchor() {
            return false;
          },
        };
      }
    });
    linkPopover.update();
    expect(linkPopover.$popover.css('display')).to.equal('none');
  });

  it('handles blur teardown and skipped initialization states', () => {
    const disabled = new LinkPopover(createContext({
      options: {
        popover: {
          link: [],
        },
      },
    }));
    expect(disabled.shouldInitialize()).to.equal(false);

    const context = createContext();
    const linkPopover = new LinkPopover(context);
    linkPopover.initialize();
    const hideSpy = vi.spyOn(linkPopover, 'hide');
    const updateSpy = vi.spyOn(linkPopover, 'update');

    linkPopover.events['summernote.blur'](null, {
      originalEvent: {
        relatedTarget: linkPopover.$popover[0],
      },
    });
    expect(hideSpy).not.toHaveBeenCalled();

    linkPopover.events['summernote.blur'](null, {
      originalEvent: {
        relatedTarget: document.body,
      },
    });
    linkPopover.events['summernote.blur'](null, {});
    linkPopover.events['summernote.keyup summernote.mouseup summernote.change summernote.scroll']();
    linkPopover.events['summernote.disable summernote.dialog.shown']();
    expect(hideSpy.mock.calls.length).to.be.greaterThanOrEqual(2);
    expect(updateSpy).toHaveBeenCalledTimes(1);

    const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    linkPopover.$popover[0].dispatchEvent(mouseDownEvent);
    expect(mouseDownEvent.defaultPrevented).to.equal(true);

    const popoverNode = linkPopover.$popover[0];
    linkPopover.destroy();
    expect(popoverNode.isConnected).to.equal(false);
  });
});
