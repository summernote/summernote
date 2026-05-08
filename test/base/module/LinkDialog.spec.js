import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from '/test/util';
import $$ from '@/js/core/dom-query.js';
import Context from '@/js/Context';
import LinkDialog from '@/js/module/LinkDialog';
import env from '@/js/core/env';
import key from '@/js/core/key';
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

    $input.val('');
    dispatchBlur($input);
    expect($input.val()).to.equal('');
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

  it('supports dialogs without a target checkbox', async() => {
    dialog?.destroy();
    context?.destroy();

    const options = $$.extend({}, $$.summernote.options, {
      toolbar: [['insert', ['link']]],
      disableLinkTarget: true,
    });

    context = new Context(
      $$('<div><p>hello</p></div>').appendTo('body'),
      options,
    );

    dialog = new LinkDialog(context);
    dialog.initialize();

    await showDialog({
      range: null,
      text: 'hello',
      url: 'https://summernote.org/',
      isNewWindow: true,
    });

    expect(dialog.$dialog.find('.sn-checkbox-open-in-new-window').length).to.equal(0);
  });

  it('clones the entered url into the display text until the text field changes', async() => {
    await showDialog({
      range: null,
      text: '',
      url: '',
      isNewWindow: false,
    });

    const $text = dialog.$dialog.find('.note-link-text');
    const $url = dialog.$dialog.find('.note-link-url');
    const $button = dialog.$dialog.find('.note-link-btn');

    $url.val('example.com');
    $url.trigger('input');
    expect($text.val()).to.equal('example.com');

    $text.val('<unsafe>');
    $text.trigger('input');
    expect($button.prop('disabled')).to.equal(false);

    $url.val('another.example.com');
    $url.trigger('input');
    expect($text.val()).to.equal('<unsafe>');
  });

  it('submits the dialog and restores range when show is cancelled', async() => {
    const invoke = vi.spyOn(context, 'invoke');

    dialog.show();
    await nextTick();
    dialog.$dialog.trigger('shown.bs.modal');
    await nextTick();

    const $text = dialog.$dialog.find('.note-link-text');
    const $url = dialog.$dialog.find('.note-link-url');
    $text.val('Summernote');
    $text.trigger('input');
    $url.val('summernote.org');
    $url.trigger('input');
    dialog.$dialog.find('.note-link-btn').trigger('click');
    await nextTick();

    const createLinkCall = invoke.mock.calls.find(([namespace]) => namespace === 'editor.createLink');
    expect(createLinkCall).to.not.equal(undefined);
    expect(createLinkCall[1]).to.deep.include({
      url: 'summernote.org',
      text: 'Summernote',
      isNewWindow: true,
    });

    dialog.show();
    await nextTick();
    dialog.$dialog.trigger('shown.bs.modal');
    await nextTick();
    dialog.$dialog.trigger('hidden.bs.modal');
    await nextTick();

    expect(invoke.mock.calls.filter(([namespace]) => namespace === 'editor.restoreRange').length).to.be.greaterThan(1);
  });

  it('skips autofocus on touch devices', async() => {
    const originalIsSupportTouch = env.isSupportTouch;
    env.isSupportTouch = true;

    await showDialog({
      range: null,
      text: '',
      url: '',
      isNewWindow: false,
    });

    expect(dialog.$dialog.find('.note-link-url').is(':focus')).to.equal(false);
    env.isSupportTouch = originalIsSupportTouch;
  });

  it('binds enter-key submission only for enter presses', () => {
    const $input = $$('<input type="text">');
    const $button = $$('<button type="button"></button>');
    const clickSpy = vi.spyOn($button, 'trigger');

    dialog.bindEnterKey($input, $button);

    const tabKeypressEvent = new Event('keypress', { bubbles: true, cancelable: true });
    Object.defineProperty(tabKeypressEvent, 'keyCode', { value: key.code.TAB });
    $input[0].dispatchEvent(tabKeypressEvent);

    const enterKeypressEvent = new Event('keypress', { bubbles: true, cancelable: true });
    Object.defineProperty(enterKeypressEvent, 'keyCode', { value: key.code.ENTER });
    $input[0].dispatchEvent(enterKeypressEvent);

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledWith('click');
  });
});
