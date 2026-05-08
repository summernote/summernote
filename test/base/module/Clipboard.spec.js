import { afterEach, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import Clipboard from '@/js/module/Clipboard';

function createClipboard(options = {}) {
  const $editable = $$('<div contenteditable="true"></div>').appendTo('body');
  const context = {
    options: {
      allowClipboardImagePasting: true,
      ...options,
    },
    layoutInfo: {
      editable: $editable,
    },
    isDisabled: vi.fn(() => false),
    invoke: vi.fn(),
  };

  return {
    clipboard: new Clipboard(context),
    context,
    $editable,
  };
}

describe('Clipboard', () => {
  afterEach(() => {
    vi.useRealTimers();
    delete window.clipboardData;
    $$('body').empty();
  });

  it('returns early when the editor is disabled', () => {
    vi.useFakeTimers();
    const { clipboard, context } = createClipboard();
    context.isDisabled.mockReturnValue(true);
    const event = {
      originalEvent: {
        clipboardData: {
          items: [],
        },
      },
      preventDefault: vi.fn(),
    };

    clipboard.pasteByEvent(event);
    vi.runAllTimers();

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(context.invoke).not.toHaveBeenCalled();
  });

  it('binds paste events, inserts clipboard images, and runs afterCommand asynchronously', () => {
    vi.useFakeTimers();
    const { clipboard, context, $editable } = createClipboard();
    const clipboardData = {
      items: [{}],
      files: ['image-file'],
      getData: vi.fn(() => ''),
    };

    clipboard.initialize();

    const event = new Event('paste', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'clipboardData', {
      configurable: true,
      value: clipboardData,
    });

    $editable[0].dispatchEvent(event);

    expect(context.invoke).toHaveBeenCalledWith('editor.insertImagesOrCallback', clipboardData.files);
    expect(event.defaultPrevented).to.be.true;

    vi.advanceTimersByTime(10);
    expect(context.invoke).toHaveBeenCalledWith('editor.afterCommand');
  });

  it('prevents text pastes that exceed the limit', () => {
    vi.useFakeTimers();
    const { clipboard, context } = createClipboard();
    const event = {
      originalEvent: {
        clipboardData: {
          items: [{}],
          files: [],
          getData: vi.fn(() => 'pasted text'),
        },
      },
      preventDefault: vi.fn(),
    };

    context.invoke.mockImplementation((method, value) => method === 'editor.isLimited' && value === 'pasted text'.length);

    clipboard.pasteByEvent(event);
    vi.runAllTimers();

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(context.invoke).toHaveBeenCalledWith('editor.isLimited', 'pasted text'.length);
    expect(context.invoke).toHaveBeenCalledWith('editor.afterCommand');
  });

  it('skips image insertion when clipboard image pasting is disabled', () => {
    vi.useFakeTimers();
    const { clipboard, context } = createClipboard({
      allowClipboardImagePasting: false,
    });
    const event = {
      originalEvent: {
        clipboardData: {
          items: [{}],
          files: ['image-file'],
          getData: vi.fn(() => 'short'),
        },
      },
      preventDefault: vi.fn(),
    };

    context.invoke.mockImplementation((method) => method === 'editor.isLimited' ? false : undefined);

    clipboard.pasteByEvent(event);
    vi.runAllTimers();

    expect(context.invoke).not.toHaveBeenCalledWith('editor.insertImagesOrCallback', ['image-file']);
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(context.invoke).toHaveBeenCalledWith('editor.afterCommand');
  });

  it('supports the legacy IE clipboardData path', () => {
    vi.useFakeTimers();
    const { clipboard, context } = createClipboard();
    const event = {
      originalEvent: {},
      preventDefault: vi.fn(),
    };

    window.clipboardData = {
      getData: vi.fn(() => 'legacy'),
    };
    context.invoke.mockImplementation((method, value) => method === 'editor.isLimited' && value === 6);

    clipboard.pasteByEvent(event);
    vi.runAllTimers();

    expect(window.clipboardData.getData).toHaveBeenCalledWith('text');
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(context.invoke).toHaveBeenCalledWith('editor.afterCommand');
  });

  it('allows legacy IE text when the editor is not limited', () => {
    vi.useFakeTimers();
    const { clipboard, context } = createClipboard();
    const event = {
      originalEvent: {},
      preventDefault: vi.fn(),
    };

    window.clipboardData = {
      getData: vi.fn(() => 'legacy'),
    };
    context.invoke.mockImplementation((method) => method === 'editor.isLimited' ? false : undefined);

    clipboard.pasteByEvent(event);
    vi.runAllTimers();

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(context.invoke).toHaveBeenCalledWith('editor.afterCommand');
  });

  it('still runs afterCommand when no clipboard data is available', () => {
    vi.useFakeTimers();
    const { clipboard, context } = createClipboard();
    const event = {
      originalEvent: {},
      preventDefault: vi.fn(),
    };

    clipboard.pasteByEvent(event);
    vi.runAllTimers();

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(context.invoke).toHaveBeenCalledWith('editor.afterCommand');
  });
});
