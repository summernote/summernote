import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from '/test/util';
import $$ from '@/js/core/dom-query.js';
import Context from '@/js/Context';
import ImageDialog from '@/js/module/ImageDialog';
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
});
