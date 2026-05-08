import { beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from '/test/util';
import $$ from '@/js/core/dom-query.js';
import Context from '@/js/Context';
import LinkDialog from '@/js/module/LinkDialog';
import '@/styles/bs5/summernote-bs5';

describe('Dialog promises BS5', () => {
  let context;

  beforeEach(() => {
    $$('body').empty();
    const $note = $$('<div><p>hello</p></div>').appendTo('body');
    context = new Context($note, $$.extend({}, $$.summernote.options));
  });

  it('resolves link dialog with a native promise', async() => {
    const dialog = new LinkDialog(context);
    dialog.initialize();

    const promise = dialog.showLinkDialog({
      range: null,
      text: 'Example',
      url: 'https://example.com',
      isNewWindow: true,
    });

    expect(typeof promise.then).to.equal('function');
    expect(typeof promise.catch).to.equal('function');

    await nextTick();
    dialog.$dialog.trigger('shown.bs.modal');
    dialog.$dialog.find('.note-link-text').val('Updated text');
    dialog.$dialog.find('.note-link-url').val('https://github.com');
    dialog.$dialog.find('.sn-checkbox-open-in-new-window input[type=checkbox]').prop('checked', false);
    dialog.$dialog.find('.note-link-btn').trigger('click');

    await expect(promise).resolves.toEqual({
      range: null,
      text: 'Updated text',
      url: 'https://github.com',
      isNewWindow: false,
    });
  });
});
