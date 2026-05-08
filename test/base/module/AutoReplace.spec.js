import { beforeEach, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import AutoReplace from '@/js/module/AutoReplace';
import key from '@/js/core/key';

describe('AutoReplace', () => {
  let context;
  let autoReplace;
  let wordRange;

  beforeEach(() => {
    wordRange = {
      toString: () => 'demo',
      insertNode: vi.fn(),
    };
    context = {
      options: {
        replace: {},
      },
      invoke: vi.fn((command) => {
        if (command === 'editor.createRange') {
          return {
            getWordRange: () => wordRange,
          };
        }
      }),
    };
    autoReplace = new AutoReplace(context);
  });

  it('only initializes when a match callback exists and resets state', () => {
    expect(autoReplace.shouldInitialize()).to.equal(false);
    autoReplace.lastWord = wordRange;
    autoReplace.initialize();
    expect(autoReplace.lastWord).to.equal(null);

    autoReplace.lastWord = wordRange;
    autoReplace.destroy();
    expect(autoReplace.lastWord).to.equal(null);

    const matchingReplace = new AutoReplace({
      ...context,
      options: {
        replace: {
          match: vi.fn(),
        },
      },
    });

    expect(matchingReplace.shouldInitialize()).to.equal(true);
  });

  it('replaces matches from strings, DomQuery nodes, and native nodes', () => {
    context.options.replace.match = vi.fn((keyword, callback) => {
      expect(keyword).to.equal('demo');
      callback('demo!');
    });

    autoReplace.lastWord = wordRange;
    autoReplace.replace();
    expect(wordRange.insertNode.mock.calls[0][0].textContent).to.equal('demo!');
    expect(context.invoke).toHaveBeenCalledWith('editor.focus');
    expect(autoReplace.lastWord).to.equal(null);

    const domQueryInsert = vi.fn();
    autoReplace.lastWord = {
      toString: () => 'demo',
      insertNode: domQueryInsert,
    };
    context.options.replace.match = vi.fn((keyword, callback) => {
      expect(keyword).to.equal('demo');
      callback($$('<strong>demo</strong>'));
    });
    autoReplace.replace();
    expect(domQueryInsert.mock.calls[0][0].outerHTML).to.equal('<strong>demo</strong>');

    const elementInsert = vi.fn();
    const elementNode = document.createElement('em');
    elementNode.textContent = 'demo';
    autoReplace.lastWord = {
      toString: () => 'demo',
      insertNode: elementInsert,
    };
    context.options.replace.match = vi.fn((keyword, callback) => {
      expect(keyword).to.equal('demo');
      callback(elementNode);
    });
    autoReplace.replace();
    expect(elementInsert).toHaveBeenCalledWith(elementNode);
  });

  it('ignores empty or unsupported replacements and exits early without a word', () => {
    context.options.replace.match = vi.fn((keyword, callback) => {
      expect(keyword).to.equal('demo');
      callback({ invalid: true });
      callback(null);
    });

    autoReplace.lastWord = wordRange;
    autoReplace.replace();
    expect(wordRange.insertNode).not.toHaveBeenCalled();
    expect(autoReplace.lastWord).to.equal(wordRange);

    autoReplace.lastWord = null;
    autoReplace.replace();
    expect(context.options.replace.match).toHaveBeenCalledTimes(1);
  });

  it('tracks terminating key presses and only replaces on supported keyup events', () => {
    context.options.replace.match = vi.fn((keyword, callback) => {
      expect(keyword).to.equal('demo');
      callback(null);
    });

    autoReplace.handleKeydown({ keyCode: key.code.ENTER });
    expect(autoReplace.lastWord).to.equal(wordRange);
    expect(autoReplace.previousKeydownCode).to.equal(key.code.ENTER);

    const createRangeCalls = context.invoke.mock.calls.filter(([command]) => command === 'editor.createRange');
    expect(createRangeCalls).toHaveLength(1);

    autoReplace.handleKeydown({ keyCode: key.code.SPACE });
    expect(autoReplace.previousKeydownCode).to.equal(key.code.SPACE);
    expect(context.invoke.mock.calls.filter(([command]) => command === 'editor.createRange')).toHaveLength(1);

    autoReplace.handleKeyup({ keyCode: key.code.UP });
    autoReplace.handleKeyup({ keyCode: key.code.SLASH });

    expect(context.options.replace.match).toHaveBeenCalledTimes(1);
  });

  it('ignores non-terminating keydown codes when capturing the last word', () => {
    autoReplace.handleKeydown({ keyCode: key.code.UP });

    expect(autoReplace.lastWord).to.equal(undefined);
    expect(autoReplace.previousKeydownCode).to.equal(key.code.UP);
    expect(context.invoke).not.toHaveBeenCalledWith('editor.createRange');
  });

  it('routes summernote events through the module handlers', () => {
    context.options.replace.match = vi.fn((keyword, callback) => callback(null));
    const keydownSpy = vi.spyOn(autoReplace, 'handleKeydown');
    const keyupSpy = vi.spyOn(autoReplace, 'handleKeyup');

    autoReplace.events['summernote.keydown'](null, { keyCode: key.code.ENTER });
    autoReplace.events['summernote.keyup'](null, {
      isDefaultPrevented() {
        return true;
      },
      keyCode: key.code.ENTER,
    });
    autoReplace.events['summernote.keyup'](null, {
      isDefaultPrevented() {
        return false;
      },
      keyCode: key.code.ENTER,
    });

    expect(keydownSpy).toHaveBeenCalledTimes(1);
    expect(keyupSpy).toHaveBeenCalledTimes(1);
  });
});
