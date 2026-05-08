import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from '/test/util';
import $$ from '@/js/core/dom-query.js';
import Context from '@/js/Context';
import LinkDialog from '@/js/module/LinkDialog';
import '@/styles/bs5/summernote-bs5';

describe('LinkDialog', () => {
  let context;
  let dialog;

  async function showDialog(linkInfo) {
    dialog.showLinkDialog(linkInfo).catch(() => {});
    await nextTick();
    dialog.$dialog.trigger('shown.bs.modal');
    await nextTick();
  }

  function dispatchBlur($input) {
    $input.trigger(new Event('blur', { bubbles: true, cancelable: true }));
  }

  beforeEach(() => {
    $$('body').empty();

    const options = $$.extend({}, $$.summernote.options, {
      toolbar: [['insert', ['link']]],
    });

    context = new Context(
      $$('<div><p>hello</p></div>').appendTo('body'),
      options,
    );

    dialog = new LinkDialog(context);
    dialog.initialize();
  });

  afterEach(() => {
    if (dialog?.$dialog) {
      dialog.ui.hideDialog(dialog.$dialog);
    }

    document.getSelection()?.removeAllRanges();
    dialog?.destroy();
    context?.destroy();
    $$('body').empty();
  });

  it('checks or unchecks new window from provided link info', async() => {
    await showDialog({
      range: null,
      text: 'hello',
      url: 'https://summernote.org/',
      isNewWindow: true,
    });

    expect(dialog.$dialog.find('.sn-checkbox-open-in-new-window input[type=checkbox]').prop('checked')).to.equal(true);

    dialog.ui.hideDialog(dialog.$dialog);
    await nextTick();

    await showDialog({
      range: null,
      text: 'world',
      url: 'https://summernote.org/',
      isNewWindow: false,
    });

    expect(dialog.$dialog.find('.sn-checkbox-open-in-new-window input[type=checkbox]').prop('checked')).to.equal(false);
  });

  it('renders the link modal with the same structured layout as the image dialog', async() => {
    await showDialog({
      range: null,
      text: 'hello',
      url: 'https://summernote.org/',
      isNewWindow: true,
    });

    expect(dialog.$dialog.hasClass('note-link-dialog-modal')).to.equal(true);
    expect(dialog.$dialog.find('.modal-header').length).to.equal(1);
    expect(dialog.$dialog.find('.modal-footer').length).to.equal(1);
    expect(dialog.$dialog.find('.note-link-dialog').length).to.equal(1);
    expect(dialog.$dialog.find('.note-link-dialog-divider').length).to.equal(1);
    expect(dialog.$dialog.find('.modal-footer .note-link-btn').length).to.equal(1);
  });

  it('keeps an existing protocol when initializing the dialog', async() => {
    await showDialog({
      range: null,
      text: 'http://summernote.org',
      url: 'http://summernote.org',
      isNewWindow: false,
    });

    expect(dialog.$dialog.find('.note-link-url').val()).to.equal('http://summernote.org');
  });

  it('adds http when initializing a plain-domain link', async() => {
    await showDialog({
      range: null,
      text: 'summernote.org',
      url: '',
      isNewWindow: false,
    });

    expect(dialog.$dialog.find('.note-link-url').val()).to.equal('http://summernote.org');
  });

  it('uses the configured link checker during initialization', async() => {
    context.options.onCreateLink = (linkUrl) => `parsed-${linkUrl}`;

    await showDialog({
      range: null,
      text: 'summernote.org',
      url: '',
      isNewWindow: false,
    });

    expect(dialog.$dialog.find('.note-link-url').val()).to.equal('parsed-summernote.org');
  });

  it('adds http during blur when the link has no scheme', async() => {
    await showDialog({
      range: null,
      text: '',
      url: '',
      isNewWindow: false,
    });

    const $input = dialog.$dialog.find('.note-link-url');
    expect($input.val()).to.equal('');

    $input.val('summernote');
    dispatchBlur($input);
    expect($input.val()).to.equal('http://summernote');
  });

  it('adds mailto during blur for email addresses', async() => {
    await showDialog({
      range: null,
      text: '',
      url: '',
      isNewWindow: false,
    });

    const $input = dialog.$dialog.find('.note-link-url');
    expect($input.val()).to.equal('');

    $input.val('email@example.com');
    dispatchBlur($input);
    expect($input.val()).to.equal('mailto:email@example.com');
  });

  it('adds tel during blur for phone numbers', async() => {
    await showDialog({
      range: null,
      text: '',
      url: '',
      isNewWindow: false,
    });

    const $input = dialog.$dialog.find('.note-link-url');
    const cases = [
      '03-1234-5678',
      '090-1234-5678',
      '03 1234 5678',
      '090 1234 5678',
      '0312345678',
      '09012345678',
      '+81-3-1234-5678',
      '81-3-1234-5678',
      '+81-90-1234-5678',
      '81-90-1234-5678',
      '+81 3 1234 5678',
      '81 3 1234 5678',
      '+81 90 1234 5678',
      '81 90 1234 5678',
      '+81 3-1234-5678',
      '81 3-1234-5678',
      '+81 90-1234-5678',
      '81 90-1234-5678',
    ];

    cases.forEach((value) => {
      $input.val(value);
      dispatchBlur($input);
      expect($input.val()).to.equal(`tel:${value}`);
    });
  });
});
