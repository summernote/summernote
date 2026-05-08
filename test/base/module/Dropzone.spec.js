import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import Dropzone from '@/js/module/Dropzone';

function defineSize(element, width, height) {
  Object.defineProperty(element, 'offsetWidth', {
    configurable: true,
    value: width,
  });
  Object.defineProperty(element, 'offsetHeight', {
    configurable: true,
    value: height,
  });
}

function createDropzone(options = {}) {
  const $editor = $$('<div class="note-editor"><div class="note-editable" contenteditable="true"></div></div>').appendTo('body');
  const $editable = $editor.find('.note-editable');
  defineSize($editor[0], 320, 180);

  const context = {
    options: {
      disableDragAndDrop: false,
      langInfo: {
        image: {
          dragImageHere: 'Drag image here',
          dropImage: 'Drop image now',
        },
      },
      ...options,
    },
    layoutInfo: {
      editor: $editor,
      editable: $editable,
    },
    invoke: vi.fn((method) => method === 'codeview.isActivated' ? false : undefined),
  };

  return {
    dropzone: new Dropzone(context),
    context,
    $editor,
    $editable,
  };
}

function dispatchWithTransfer(target, type, dataTransfer) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'dataTransfer', {
    configurable: true,
    value: dataTransfer,
  });
  target.dispatchEvent(event);
  return event;
}

describe('Dropzone', () => {
  beforeEach(() => {
    $$('body').empty();
  });

  afterEach(() => {
    $$('body').empty();
  });

  it('prevents drops when drag and drop is disabled and cleans up on destroy', () => {
    const { dropzone } = createDropzone({
      disableDragAndDrop: true,
    });

    dropzone.initialize();

    const firstDrop = new Event('drop', { bubbles: true, cancelable: true });
    dropzone.$dropzone[0].dispatchEvent(firstDrop);
    expect(firstDrop.defaultPrevented).to.be.true;

    dropzone.destroy();
    expect(dropzone.documentEventHandlers).toEqual({});

    const secondDrop = new Event('drop', { bubbles: true, cancelable: true });
    dropzone.$dropzone[0].dispatchEvent(secondDrop);
    expect(secondDrop.defaultPrevented).to.be.false;
  });

  it('tracks dragenter and dragleave state for the editor and dropzone', () => {
    const { dropzone, $editor } = createDropzone();
    const target = document.createElement('div');
    $editor[0].appendChild(target);

    dropzone.initialize();

    target.dispatchEvent(new Event('dragenter', { bubbles: true }));
    expect($editor.hasClass('dragover')).to.be.true;
    expect(dropzone.$dropzone.find('.note-dropzone-message').text()).to.equal('Drag image here');

    target.dispatchEvent(new Event('dragenter', { bubbles: true }));
    expect($editor.hasClass('dragover')).to.be.true;

    dropzone.$dropzone[0].dispatchEvent(new Event('dragenter', { bubbles: true }));
    expect(dropzone.$dropzone.hasClass('hover')).to.be.true;
    expect(dropzone.$dropzone.find('.note-dropzone-message').text()).to.equal('Drop image now');

    dropzone.$dropzone[0].dispatchEvent(new Event('dragleave', { bubbles: true }));
    expect(dropzone.$dropzone.hasClass('hover')).to.be.false;
    expect(dropzone.$dropzone.find('.note-dropzone-message').text()).to.equal('Drag image here');

    document.body.dispatchEvent(new Event('dragleave', { bubbles: true }));
    expect($editor.hasClass('dragover')).to.be.false;

    target.dispatchEvent(new Event('dragenter', { bubbles: true }));
    expect($editor.hasClass('dragover')).to.be.true;

    document.dispatchEvent(new Event('drop', { bubbles: true }));
    expect($editor.hasClass('dragover')).to.be.false;
  });

  it('drops files into the editor and focuses the editable area', () => {
    const { dropzone, context, $editable } = createDropzone();
    const focusSpy = vi.spyOn($editable[0], 'focus');

    dropzone.initialize();

    const dataTransfer = {
      files: ['image-file'],
      types: [],
      getData: vi.fn(),
    };
    const event = dispatchWithTransfer(dropzone.$dropzone[0], 'drop', dataTransfer);

    expect(event.defaultPrevented).to.be.true;
    expect(focusSpy).toHaveBeenCalledTimes(1);
    expect(context.invoke).toHaveBeenCalledWith('editor.insertImagesOrCallback', dataTransfer.files);
  });

  it('prevents default dragover behavior on the dropzone', () => {
    const { dropzone } = createDropzone();

    dropzone.initialize();

    const event = new Event('dragover', { bubbles: true, cancelable: true });
    dropzone.$dropzone[0].dispatchEvent(event);

    expect(event.defaultPrevented).to.be.true;
  });

  it('pastes text/html content, skips moz types, and inserts parsed nodes', () => {
    const { dropzone, context } = createDropzone();
    const contents = {
      '_moz_htmlcontext': '<div>ignored</div>',
      'text/plain': '<p>plain text</p>',
      'application/x-custom': '<span>one</span><span>two</span>',
    };
    const dataTransfer = {
      files: [],
      types: Object.keys(contents),
      getData: vi.fn((type) => contents[type]),
    };

    dropzone.initialize();
    const event = dispatchWithTransfer(dropzone.$dropzone[0], 'drop', dataTransfer);

    expect(event.defaultPrevented).to.be.true;
    expect(context.invoke).toHaveBeenCalledWith('editor.pasteHTML', '<p>plain text</p>');
    expect(context.invoke).toHaveBeenCalledWith('editor.insertNode', expect.any(HTMLSpanElement));
    expect(context.invoke).toHaveBeenCalledTimes(3);
    expect(dataTransfer.getData).not.toHaveBeenCalledWith('_moz_htmlcontext');

    dropzone.destroy();
    expect(dropzone.documentEventHandlers).toEqual({});
  });
});
