import { afterEach, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import key from '@/js/core/key';
import AutoLink from '@/js/module/AutoLink';

function createContext(options = {}) {
  const $editable = $$('<div contenteditable="true"></div>').appendTo('body');
  const context = {
    options: {
      showDomainOnlyForAutolink: false,
      linkTargetBlank: false,
      ...options,
    },
    layoutInfo: {
      editable: $editable,
    },
    invoke: vi.fn(),
    triggerEvent: vi.fn(),
  };

  return { context, $editable };
}

describe('AutoLink', () => {
  afterEach(() => {
    $$('body').empty();
  });

  it('initializes, destroys, and ignores empty or unsupported keywords', () => {
    const { context } = createContext();
    const autoLink = new AutoLink(context);

    autoLink.initialize();
    expect(autoLink.lastWordRange).to.equal(null);

    autoLink.replace();
    expect(context.invoke).not.toHaveBeenCalled();

    autoLink.lastWordRange = {
      toString: () => 'example.com',
      insertNode: vi.fn(),
    };

    autoLink.replace();

    expect(autoLink.lastWordRange.toString()).to.equal('example.com');
    expect(context.invoke).not.toHaveBeenCalled();

    autoLink.destroy();
    expect(autoLink.lastWordRange).to.equal(null);
  });

  it('tracks word ranges for enter and space only', () => {
    const { context } = createContext();
    const enterRange = { id: 'enter' };
    const spaceRange = { id: 'space' };
    let currentRange = enterRange;

    context.invoke.mockImplementation((method) => {
      if (method === 'editor.createRange') {
        return {
          getWordRange: () => currentRange,
        };
      }
    });

    const autoLink = new AutoLink(context);
    autoLink.handleKeydown({ keyCode: key.code.ENTER });
    expect(autoLink.lastWordRange).to.equal(enterRange);

    currentRange = spaceRange;
    autoLink.handleKeydown({ keyCode: key.code.SPACE });
    expect(autoLink.lastWordRange).to.equal(spaceRange);

    autoLink.lastWordRange = null;
    autoLink.handleKeydown({ keyCode: key.code.TAB });
    expect(autoLink.lastWordRange).to.equal(null);
  });

  it('replaces bare domains on space and ignores shift+enter', () => {
    const { context } = createContext();
    const autoLink = new AutoLink(context);
    const replaceSpy = vi.spyOn(autoLink, 'replace');
    const insertNode = vi.fn();

    autoLink.lastWordRange = {
      toString: () => 'www.example.com/path',
      insertNode,
    };

    autoLink.handleKeyup({ keyCode: key.code.ENTER, shiftKey: true });
    expect(replaceSpy).not.toHaveBeenCalled();

    autoLink.handleKeyup({ keyCode: key.code.SPACE, shiftKey: false });

    expect(replaceSpy).toHaveBeenCalledTimes(1);
    expect(insertNode).toHaveBeenCalledTimes(1);
    expect(insertNode.mock.calls[0][0].outerHTML).to.equal('<a href="http://www.example.com/path">www.example.com/path</a>');
    expect(context.invoke).toHaveBeenCalledWith('editor.focus');
    expect(context.triggerEvent).toHaveBeenCalledWith('change', '', context.layoutInfo.editable);
    expect(autoLink.lastWordRange).to.equal(null);
  });

  it('keeps protocols, trims displayed domains, and supports target blank', () => {
    const { context } = createContext({
      showDomainOnlyForAutolink: true,
      linkTargetBlank: true,
    });
    const autoLink = new AutoLink(context);
    const insertNode = vi.fn();

    autoLink.lastWordRange = {
      toString: () => 'https://www.example.com/path?x=1',
      insertNode,
    };
    autoLink.replace();

    expect(insertNode.mock.calls[0][0].outerHTML).to.equal('<a href="https://www.example.com/path?x=1" target="_blank">example.com</a>');

    autoLink.lastWordRange = {
      toString: () => 'mailto:test@example.com',
      insertNode,
    };
    autoLink.handleKeyup({ keyCode: key.code.ENTER, shiftKey: false });

    expect(insertNode.mock.calls[1][0].outerHTML).to.equal('<a href="mailto:test@example.com" target="_blank">test@example.com</a>');
  });

  it('routes summernote events through the module handlers', () => {
    const { context } = createContext();
    const autoLink = new AutoLink(context);
    const keyupSpy = vi.spyOn(autoLink, 'handleKeyup');
    const keydownSpy = vi.spyOn(autoLink, 'handleKeydown');
    context.invoke.mockImplementation((method) => {
      if (method === 'editor.createRange') {
        return {
          getWordRange: () => null,
        };
      }
    });
    const keyupEvent = {
      isDefaultPrevented: () => false,
    };

    autoLink.events['summernote.keyup']({}, keyupEvent);
    autoLink.events['summernote.keyup']({}, {
      isDefaultPrevented: () => true,
    });
    autoLink.events['summernote.keydown']({}, { keyCode: key.code.SPACE });

    expect(keyupSpy).toHaveBeenCalledTimes(1);
    expect(keyupSpy).toHaveBeenCalledWith(keyupEvent);
    expect(keydownSpy).toHaveBeenCalledTimes(1);
    expect(keydownSpy).toHaveBeenCalledWith({ keyCode: key.code.SPACE });
  });
});
