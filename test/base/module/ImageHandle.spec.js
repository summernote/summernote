import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from '/test/util';
import $$ from '@/js/core/dom-query.js';
import Context from '@/js/Context';
import ImageDialog from '@/js/module/ImageDialog';
import range from '@/js/core/range';
import '@/styles/bs5/summernote-bs5';

const DATA_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

async function flushAsyncWork(limit = 20) {
  for (let index = 0; index < limit; index++) {
    await nextTick();
  }
}

async function showImageDialog(dialog) {
  const $editable = dialog.context.layoutInfo.editable;
  const textNode = $editable.find('p')[0]?.firstChild;
  if (textNode) {
    dialog.context.modules.editor.setLastRange(
      range.create(textNode, textNode.textContent.length).select(),
    );
  }
  dialog.show();
  await nextTick();
  dialog.$dialog.trigger('shown.bs.modal');
  await nextTick();
}

async function insertImageViaDialog(dialog) {
  await showImageDialog(dialog);
  const $url = dialog.$dialog.find('.note-image-url');
  $url.val(DATA_URL);
  $url.trigger('input');
  dialog.$dialog.find('.note-image-btn').trigger('click');
  await flushAsyncWork();
}

function dispatchImageMouseDown(image) {
  const imageRect = image.getBoundingClientRect();
  const clickX = imageRect.left + Math.max(10, imageRect.width / 2);
  const clickY = imageRect.top + Math.max(10, imageRect.height / 2);

  image.dispatchEvent(new MouseEvent('mousedown', {
    bubbles: true,
    clientX: clickX,
    clientY: clickY,
    pageX: clickX + window.scrollX,
    pageY: clickY + window.scrollY,
  }));
}

describe('Image handle integration', () => {
  let context;
  let dialog;
  let $editable;

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

  it('keeps the image handle visible when focus moves onto the inserted image', async() => {
    await insertImageViaDialog(dialog);

    const image = $editable.find('img')[0];
    dispatchImageMouseDown(image);
    await nextTick();

    context.triggerEvent('blur', new FocusEvent('blur', { relatedTarget: image }));
    await nextTick();

    expect($$('.note-control-selection').css('display')).to.equal('block');
    expect($$('.note-image-popover').css('display')).to.equal('block');
  });

  it('keeps the selected target when using the image resize popover buttons', async() => {
    await insertImageViaDialog(dialog);

    const image = $editable.find('img')[0];
    image.style.width = '100%';
    dispatchImageMouseDown(image);
    await nextTick();

    const $popover = $$('.note-image-popover');
    const resizeHalfButton = $popover.find('button').filter((_, button) => button.textContent.trim() === '50%');

    context.triggerEvent('blur', new FocusEvent('blur', { relatedTarget: resizeHalfButton[0] }));
    resizeHalfButton.trigger('click');
    await nextTick();

    expect($editable.find('img')[0].style.width).to.equal('50%');
  });
});
