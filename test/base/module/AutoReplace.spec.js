import { describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import AutoReplace from '@/js/module/AutoReplace';

describe('AutoReplace', () => {
  it('inserts the first node from a DomQuery match result', () => {
    const insertNode = vi.fn();
    const invoke = vi.fn();
    const context = {
      options: {
        replace: {
          match(keyword, callback) {
            expect(keyword).to.equal('demo');
            callback($$('<strong>demo</strong>'));
          },
        },
      },
      invoke,
    };
    const autoReplace = new AutoReplace(context);
    autoReplace.lastWord = {
      toString: () => 'demo',
      insertNode,
    };

    autoReplace.replace();

    expect(insertNode).toHaveBeenCalledTimes(1);
    expect(insertNode.mock.calls[0][0].outerHTML).to.equal('<strong>demo</strong>');
    expect(invoke).toHaveBeenCalledWith('editor.focus');
    expect(autoReplace.lastWord).to.equal(null);
  });
});
