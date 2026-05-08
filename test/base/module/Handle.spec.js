import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from '/test/util';
import $$ from '@/js/core/dom-query.js';
import Context from '@/js/Context';
import Handle from '@/js/module/Handle';
import '@/styles/bs5/summernote-bs5';

describe('Handle', () => {
  let context;
  let handle;
  let $editable;

  beforeEach(() => {
    $$('body').empty();
    context = new Context(
      $$('<div><p><img id="test-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" width="120" height="60"><iframe id="test-frame" class="note-video-clip" src="//www.youtube.com/embed/jNQXAC9IVRw" width="120" height="60"></iframe></p></div>').appendTo('body'),
      $$.extend({}, $$.summernote.options),
    );
    handle = new Handle(context);
    handle.initialize();
    $editable = context.layoutInfo.editable;

    context.layoutInfo.editingArea[0].getBoundingClientRect = () => ({ left: 0, top: 0, width: 500, height: 300 });
    Array.from($editable[0].querySelectorAll('img, iframe')).forEach((node) => {
      node.getBoundingClientRect = () => ({
        left: 20,
        top: 30,
        right: 140,
        bottom: 90,
        width: 120,
        height: 60,
      });
    });
  });

  afterEach(() => {
    handle?.destroy();
    context?.destroy();
    $$('body').empty();
  });

  it('finds media targets by point and resolves selected targets', () => {
    const image = $editable.find('#test-image')[0];
    handle.$handle.find('.note-control-selection').data('target', $$(image));

    expect(handle.findMediaTargetByPoint({ clientX: 40, clientY: 50 })).to.equal(image);
    expect(handle.findMediaTargetByPoint({})).to.equal(null);

    const insideSelection = handle.$handle.find('.note-control-selection')[0];
    expect(handle.resolveMediaTarget(insideSelection, { clientX: 40, clientY: 50 })).to.equal(image);

    context.invoke('editor.saveTarget', image);
    expect(handle.resolveMediaTarget(handle.$handle[0], { clientX: 0, clientY: 0 })).to.equal(image);
    expect(handle.resolveMediaTarget(document.body, { clientX: 0, clientY: 0 })).to.equal(null);
  });

  it('keeps the handle visible for related targets on blur', () => {
    const image = $editable.find('#test-image')[0];
    handle.update(image);

    expect(handle.getBlurRelatedTarget(new FocusEvent('blur', { relatedTarget: image }))).to.equal(image);
    expect(handle.shouldKeepVisibleOnBlur(new FocusEvent('blur', { relatedTarget: handle.$handle[0] }))).to.equal(true);

    const popoverButton = $$('<button class="note-image-popover"></button>').appendTo('body')[0];
    expect(handle.shouldKeepVisibleOnBlur(new FocusEvent('blur', { relatedTarget: popoverButton }))).to.equal(true);
    expect(handle.shouldKeepVisibleOnBlur(new FocusEvent('blur', { relatedTarget: image }))).to.equal(true);
    expect(handle.shouldKeepVisibleOnBlur(new FocusEvent('blur'))).to.equal(false);
  });

  it('updates and hides media selections, including disabled and no-target states', () => {
    const image = $editable.find('#test-image')[0];
    const invoke = vi.spyOn(context, 'invoke');

    expect(handle.update(image)).to.equal(true);
    expect(handle.$handle.find('.note-control-selection').css('display')).to.equal('block');
    expect(handle.$handle.find('.note-control-selection-info').text()).to.contain('120x60');

    handle.hide();
    expect(handle.$handle.children().css('display')).to.equal('none');

    context.disable();
    expect(handle.update(image)).to.equal(false);
    context.enable();

    expect(handle.update(document.body, { clientX: 0, clientY: 0 })).to.equal(false);
    expect(invoke.mock.calls.some(([namespace]) => namespace === 'editor.clearTarget')).to.equal(true);
  });

  it('routes wheel and resize drag events through the editor module', async() => {
    const image = $editable.find('#test-image')[0];
    const resizeTo = vi.spyOn(context.modules.editor, 'resizeTo');
    const afterCommand = vi.spyOn(context.modules.editor, 'afterCommand');
    handle.update(image);

    const $selection = handle.$handle.find('.note-control-selection');
    const resizeHandle = handle.$handle.find('.note-control-se')[0];
    $selection.data('target', $$(image));
    handle.$document.scrollTop = () => 0;
    $$(image).data('ratio', 0);

    resizeHandle.dispatchEvent(new MouseEvent('mousedown', {
      bubbles: true,
      clientX: 80,
      clientY: 70,
    }));
    document.dispatchEvent(new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 100,
      clientY: 90,
      shiftKey: true,
    }));
    document.dispatchEvent(new MouseEvent('mouseup', {
      bubbles: true,
    }));

    expect(resizeTo).toHaveBeenCalled();
    expect(afterCommand).toHaveBeenCalled();
    expect($$(image).data('ratio')).to.equal(0.5);

    const wheelEvent = new WheelEvent('wheel', { bubbles: true });
    const preventDefault = vi.spyOn(wheelEvent, 'preventDefault');
    handle.$handle[0].dispatchEvent(wheelEvent);
    await nextTick();

    expect(preventDefault).toHaveBeenCalled();
  });

  it('covers module event callbacks and alternate selection branches', () => {
    const image = $editable.find('#test-image')[0];
    const hide = vi.spyOn(handle, 'hide');
    const update = vi.spyOn(handle, 'update').mockReturnValue(true);

    const mouseEvent = {
      target: image,
      preventDefault: vi.fn(),
    };
    handle.events['summernote.mousedown'](null, mouseEvent);
    expect(mouseEvent.preventDefault).toHaveBeenCalled();

    update.mockRestore();
    handle.update(image);
    handle.events['summernote.blur'](null, new FocusEvent('blur'));
    expect(hide).toHaveBeenCalled();

    const refresh = vi.spyOn(handle, 'update').mockImplementation(() => true);
    handle.events['summernote.codeview.toggled']();
    expect(refresh).toHaveBeenCalled();

    const selectionTarget = handle.$handle.find('.note-control-selection');
    selectionTarget.data('target', $$(image));
    const selectionChild = document.createElement('div');
    selectionTarget[0].appendChild(selectionChild);
    expect(handle.resolveMediaTarget(selectionChild, { clientX: 0, clientY: 0 })).to.equal(image);

    const originalEditable = context.layoutInfo.editable;
    context.layoutInfo.editable = [];
    expect(handle.findMediaTargetByPoint({ clientX: 10, clientY: 10 })).to.equal(null);
    context.layoutInfo.editable = originalEditable;
  });

  it('covers non-sizing clicks, video blur targets, and disabled resize handles', () => {
    const iframe = $editable.find('#test-frame')[0];
    const source = document.createElement('source');
    iframe.appendChild(source);

    handle.update(iframe);
    const selection = handle.$handle.find('.note-control-selection');
    selection.data('target', $$(iframe));
    expect(handle.shouldKeepVisibleOnBlur(new FocusEvent('blur', { relatedTarget: source }))).to.equal(true);

    const resizeSpy = vi.spyOn(handle, 'update');
    handle.$handle[0].dispatchEvent(new MouseEvent('mousedown', {
      bubbles: true,
      clientX: 40,
      clientY: 50,
    }));
    expect(resizeSpy).toHaveBeenCalled();
    expect(handle.$handle.find('.note-control-selection-info').text()).to.contain('120x60');

    handle.destroy();
    context.destroy();

    context = new Context(
      $$('<div><p><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" width="120" height="60"></p></div>').appendTo('body'),
      $$.extend({}, $$.summernote.options, {
        disableResizeImage: true,
      }),
    );
    handle = new Handle(context);
    handle.initialize();

    expect(handle.$handle.find('.note-control-se').hasClass('note-control-holder')).to.equal(true);
    expect(handle.$handle.find('.note-control-selection-info').length).to.equal(0);
  });

  it('covers existing ratios, raw selection targets, and ignored handle clicks', () => {
    const iframe = $editable.find('#test-frame')[0];
    const selection = handle.$handle.find('.note-control-selection');
    const selectionChild = document.createElement('div');
    selection[0].appendChild(selectionChild);
    selection.data('target', iframe);

    expect(handle.getSelectedMediaTarget()).to.equal(iframe);
    expect(handle.resolveMediaTarget(selectionChild, { clientX: -10, clientY: -10 })).to.equal(iframe);

    handle.update(iframe);
    selection.data('target', $$(iframe));
    $$(iframe).data('ratio', 0.75);
    const resizeHandle = handle.$handle.find('.note-control-se')[0];
    resizeHandle.dispatchEvent(new MouseEvent('mousedown', {
      bubbles: true,
      clientX: 80,
      clientY: 70,
    }));
    expect($$(iframe).data('ratio')).to.equal(0.75);
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

    selection.removeData('target');
    context.invoke('editor.clearTarget');
    const update = vi.spyOn(handle, 'update');
    handle.$handle[0].dispatchEvent(new MouseEvent('mousedown', {
      bubbles: true,
      clientX: -10,
      clientY: -10,
    }));
    expect(update).not.toHaveBeenCalled();
  });

  it('keeps the blur event handler from hiding related selections', () => {
    const hide = vi.spyOn(handle, 'hide');
    handle.events['summernote.blur'](null, new FocusEvent('blur', {
      relatedTarget: handle.$handle[0],
    }));
    expect(hide).not.toHaveBeenCalled();
  });
});
