import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from '/test/util';
import $$ from '@/js/core/dom-query.js';
import Context from '@/js/Context';
import HelpDialog from '@/js/module/HelpDialog';
import '@/styles/bs5/summernote-bs5';

describe('HelpDialog', () => {
  let context;
  let dialog;

  async function showDialog() {
    dialog.showHelpDialog().catch(() => {});
    await nextTick();
    dialog.$dialog.trigger('shown.bs.modal');
    await nextTick();
  }

  beforeEach(() => {
    $$('body').empty();

    context = new Context(
      $$('<div><p>hello</p></div>').appendTo('body'),
      $$.extend({}, $$.summernote.options, {
        toolbar: [['view', ['help']]],
      }),
    );
    dialog = new HelpDialog(context);
    dialog.initialize();
  });

  afterEach(() => {
    if (dialog?.$dialog) {
      dialog.ui.hideDialog(dialog.$dialog);
    }

    dialog?.destroy();
    context?.destroy();
    $$('body').empty();
  });

  it('renders the help modal with grouped shortcut sections and updated project links', async() => {
    await showDialog();

    expect(dialog.$dialog.hasClass('note-help-dialog-modal')).to.equal(true);
    expect(dialog.$dialog.find('.modal-header').length).to.equal(1);
    expect(dialog.$dialog.find('.modal-footer').length).to.equal(1);
    expect(dialog.$dialog.find('.note-help-dialog').length).to.equal(1);
    expect(dialog.$dialog.find('.note-help-dialog-section').length).to.be.greaterThan(1);
    expect(dialog.$dialog.find('.note-help-dialog-item').length).to.be.greaterThan(5);

    const footerHtml = dialog.$dialog.find('.modal-footer').html();
    expect(footerHtml).to.contain('https://juergen-schwind.com/summernote-next');
    expect(footerHtml).to.contain('https://github.com/jschwind/summernote-next');
    expect(footerHtml).to.contain('/issues');
  });

  it('restores the editor range after showing the modal', async() => {
    const saveRangeSpy = vi.spyOn(context, 'invoke');

    dialog.show();
    await nextTick();
    dialog.$dialog.trigger('shown.bs.modal');
    await nextTick();

    expect(saveRangeSpy).toHaveBeenCalledWith('editor.saveRange');
    expect(saveRangeSpy).toHaveBeenCalledWith('editor.restoreRange');
  });
});
