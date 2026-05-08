import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from '/test/util';
import $$ from '@/js/core/dom-query.js';
import Context from '@/js/Context';
import env from '@/js/core/env';
import HelpDialog from '@/js/module/HelpDialog';
import '@/styles/bs5/summernote-bs5';

describe('HelpDialog', () => {
  let context;
  let dialog;
  const originalIsMac = env.isMac;

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
    env.isMac = originalIsMac;
    if (dialog?.$dialog) {
      dialog.ui.hideDialog(dialog.$dialog);
      dialog.destroy();
    }
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

  it('formats shortcuts, escapes labels, and supports body-mounted dialogs', () => {
    const manualContext = {
      layoutInfo: {
        editor: $$('<div></div>'),
      },
      options: {
        container: $$('<div></div>').appendTo('body'),
        dialogsInBody: true,
        dialogsFade: false,
        langInfo: {
          options: {
            help: 'Help',
          },
          shortcut: {
            action: 'Action',
            textFormatting: 'Formatting',
            paragraphFormatting: 'Paragraph',
            documentStyle: 'Document',
            extraKeys: 'Extra',
            shortcuts: 'Use these shortcuts',
          },
        },
        keyMap: {
          pc: {
            'CTRL+K': 'linkDialog.show',
            'CTRL+B': 'bold',
            'SHIFT+TAB': 'untab',
          },
          mac: {
            'CMD+BACKSLASH': 'removeFormat',
          },
        },
      },
      memo: vi.fn((key) => key === 'help.bold' ? 'Bold <text>' : ''),
      triggerEvent: vi.fn(),
      invoke: vi.fn(),
    };
    dialog = new HelpDialog(manualContext);

    expect(dialog.escapeHtml('<"&\'>')).to.equal('&lt;&quot;&amp;&#39;&gt;');
    expect(dialog.formatShortcutToken('BACKSLASH')).to.equal('\\');
    expect(dialog.formatShortcutToken('CTRL')).to.equal('Ctrl');
    expect(dialog.formatShortcutToken('Z')).to.equal('Z');
    expect(dialog.renderShortcut('CTRL+BACKSLASH+RIGHTBRACKET')).to.contain('<kbd>Ctrl</kbd>');
    expect(dialog.renderShortcut('CTRL+BACKSLASH+RIGHTBRACKET')).to.contain('<kbd>]</kbd>');

    env.isMac = false;
    const pcSections = dialog.getShortcutSections();
    expect(pcSections).toHaveLength(3);
    expect(pcSections[0].items[0].description).to.equal('linkDialog.show');
    expect(dialog.createDialogBody()).to.contain('Windows and Linux');

    env.isMac = true;
    expect(dialog.createDialogBody()).to.contain('macOS');
    expect(dialog.createDialogFooter()).to.contain('Summernote Next');

    dialog.initialize();
    expect(dialog.$dialog.parent()[0]).to.equal(document.body);
  });
});
