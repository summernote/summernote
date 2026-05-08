import { describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import AutoSync from '@/js/module/AutoSync';

describe('AutoSync', () => {
  it('syncs textarea notes and skips non-textareas', () => {
    const $note = $$('<textarea></textarea>');
    const context = {
      layoutInfo: {
        note: $note,
      },
      invoke: vi.fn(() => '<p>synced</p>'),
    };
    const autoSync = new AutoSync(context);

    expect(autoSync.shouldInitialize()).to.equal(true);
    autoSync.events['summernote.change']();
    expect($note.val()).to.equal('<p>synced</p>');
    expect(context.invoke).toHaveBeenCalledWith('code');

    const nonTextarea = new AutoSync({
      layoutInfo: {
        note: $$('<div></div>'),
      },
      invoke: vi.fn(),
    });
    expect(nonTextarea.shouldInitialize()).to.equal(false);
  });
});
