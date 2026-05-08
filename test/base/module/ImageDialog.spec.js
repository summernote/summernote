import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from '/test/util';
import $$ from '@/js/core/dom-query.js';
import Context from '@/js/Context';
import ImageDialog from '@/js/module/ImageDialog';
import env from '@/js/core/env';
import key from '@/js/core/key';
import '@/styles/bs5/summernote-bs5';

function createImageFile() {
  const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAF0lEQVQYGWP8////fwYsgAmLGFiIHhIAT+oECGHuN2UAAAAASUVORK5CYII=';
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  return new File([bytes], 'image.png', { type: 'image/png' });
}

async function flushAsyncWork(limit = 20) {
  for (let index = 0; index < limit; index++) {
    await nextTick();
  }
}

describe('ImageDialog', () => {
  let context;
  let dialog;
  let $editable;

  async function showDialog() {
    dialog.showImageDialog().catch(() => {});
    await nextTick();
    dialog.$dialog.trigger('shown.bs.modal');
    await nextTick();
  }

  beforeEach(() => {
    $$('body').empty();

    context = new Context(
      $$('<div><p>hello</p></div>').appendTo('body'),
      $$.extend({}, $$.summernote.options, {
        toolbar: [['insert', ['picture']]],
      }),
    );
    dialog = new ImageDialog(context);
    dialog.initialize();
    $editable = context.layoutInfo.editable;
  });

  afterEach(() => {
    if (dialog?.$dialog) {
      dialog.ui.hideDialog(dialog.$dialog);
    }

    dialog?.destroy();
    context?.destroy();
    $$('body').empty();
  });

  it('renders the image modal with a bootstrap header and footer', async() => {
    await showDialog();

    expect(dialog.$dialog.hasClass('note-image-dialog-modal')).to.equal(true);
    expect(dialog.$dialog.find('.modal-header').length).to.equal(1);
    expect(dialog.$dialog.find('.modal-footer').length).to.equal(1);
    expect(dialog.$dialog.find('.note-image-dialog').length).to.equal(1);
    expect(dialog.$dialog.find('.note-image-input').length).to.equal(1);
    expect(dialog.$dialog.find('.modal-footer .note-image-btn').length).to.equal(1);
  });

  it('renders the file picker as a bootstrap file input control', async() => {
    await showDialog();

    const imageInput = dialog.$dialog.find('.note-image-input')[0];

    expect(imageInput.type).to.equal('file');
    expect(imageInput.classList.contains('form-control')).to.equal(true);
    expect(imageInput.classList.contains('note-form-control')).to.equal(true);
    expect(imageInput.getAttribute('aria-label')).to.equal('Select from files');
  });

  it('shows the chosen file name in the dialog before inserting', async() => {
    await showDialog();

    const imageInput = dialog.$dialog.find('.note-image-input')[0];
    Object.defineProperty(imageInput, 'files', {
      configurable: true,
      value: {
        0: createImageFile(),
        length: 1,
      },
    });

    imageInput.dispatchEvent(new Event('change', { bubbles: true }));

    expect(dialog.$dialog.find('.note-image-dialog-file-name').text()).to.equal('image.png');
  });

  it('inserts an uploaded image selected from the file input', async() => {
    dialog.show();
    await nextTick();
    dialog.$dialog.trigger('shown.bs.modal');
    await nextTick();

    const imageInput = dialog.$dialog.find('.note-image-input')[0];
    Object.defineProperty(imageInput, 'files', {
      configurable: true,
      value: {
        0: createImageFile(),
        length: 1,
      },
    });

    imageInput.dispatchEvent(new Event('change', { bubbles: true }));
    await flushAsyncWork();

    const $image = $editable.find('img');
    expect($image.length).to.equal(1);
    expect($image.attr('data-filename')).to.equal('image.png');
    expect($image.attr('src')).to.match(/^data:image\/png;base64,/);
  });

  it('shows maximum file size help and supports enter-key insertion for image urls', async() => {
    dialog?.destroy();
    context?.destroy();

    context = new Context(
      $$('<div><p>hello</p></div>').appendTo('body'),
      $$.extend({}, $$.summernote.options, {
        toolbar: [['insert', ['picture']]],
        maximumImageFileSize: 2048,
      }),
    );
    dialog = new ImageDialog(context);
    dialog.initialize();

    await showDialog();

    expect(dialog.$dialog.find('.note-image-dialog-help').text()).to.contain('2 KB');

    const $url = dialog.$dialog.find('.note-image-url');
    const $button = dialog.$dialog.find('.note-image-btn');
    const clickSpy = vi.spyOn($button, 'trigger');
    $url.val('https://example.com/image.png');
    dialog.bindEnterKey($url, $button);
    const nonEnterKeypressEvent = new Event('keypress', { bubbles: true, cancelable: true });
    Object.defineProperty(nonEnterKeypressEvent, 'keyCode', { value: key.code.TAB });
    $url[0].dispatchEvent(nonEnterKeypressEvent);
    const keypressEvent = new Event('keypress', { bubbles: true, cancelable: true });
    Object.defineProperty(keypressEvent, 'keyCode', { value: key.code.ENTER });
    $url[0].dispatchEvent(keypressEvent);
    await nextTick();

    expect(clickSpy).toHaveBeenCalledWith('click');
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('routes linked-image inserts through the callback and restores range on cancel', async() => {
    const triggerEvent = vi.spyOn(context, 'triggerEvent');
    const invoke = vi.spyOn(context, 'invoke');
    context.options.callbacks.onImageLinkInsert = vi.fn();

    dialog.show();
    await nextTick();
    dialog.$dialog.trigger('shown.bs.modal');
    await nextTick();

    const $url = dialog.$dialog.find('.note-image-url');
    $url.val('https://example.com/linked.png');
    $url.trigger('input');
    dialog.$dialog.find('.note-image-btn').trigger('click');
    await flushAsyncWork();

    expect(triggerEvent).toHaveBeenCalledWith('image.link.insert', 'https://example.com/linked.png');

    dialog.show();
    await nextTick();
    dialog.$dialog.trigger('shown.bs.modal');
    await nextTick();
    dialog.$dialog.trigger('hidden.bs.modal');
    await flushAsyncWork();

    expect(invoke.mock.calls.filter(([namespace]) => namespace === 'editor.restoreRange').length).to.be.greaterThan(1);
  });

  it('clears file names when file selection is empty and when the dialog hides', async() => {
    await showDialog();

    const imageInput = dialog.$dialog.find('.note-image-input')[0];
    Object.defineProperty(imageInput, 'files', {
      configurable: true,
      value: { length: 0 },
    });

    imageInput.dispatchEvent(new Event('change', { bubbles: true }));
    expect(dialog.$dialog.find('.note-image-dialog-file-name').text()).to.equal('');

    Object.defineProperty(imageInput, 'files', {
      configurable: true,
      value: null,
    });
    imageInput.dispatchEvent(new Event('change', { bubbles: true }));
    expect(dialog.$dialog.find('.note-image-dialog-file-name').text()).to.equal('');

    dialog.$dialog.find('.note-image-dialog-file-name').text('stale.png');
    dialog.$dialog.trigger('hidden.bs.modal');
    await nextTick();

    expect(dialog.$dialog.find('.note-image-dialog-file-name').text()).to.equal('');
  });

  it('skips autofocus on touch devices', async() => {
    const originalIsSupportTouch = env.isSupportTouch;
    env.isSupportTouch = true;

    await showDialog();

    expect(dialog.$dialog.find('.note-image-url').is(':focus')).to.equal(false);
    env.isSupportTouch = originalIsSupportTouch;
  });

  it('inserts image urls directly when no callback is configured', async() => {
    const invoke = vi.spyOn(context, 'invoke');

    dialog.show();
    await nextTick();
    dialog.$dialog.trigger('shown.bs.modal');
    await nextTick();

    const $url = dialog.$dialog.find('.note-image-url');
    $url.val('https://example.com/direct.png');
    $url.trigger('input');
    dialog.$dialog.find('.note-image-btn').trigger('click');
    await flushAsyncWork();

    expect(invoke).toHaveBeenCalledWith('editor.insertImage', 'https://example.com/direct.png');
  });
});
