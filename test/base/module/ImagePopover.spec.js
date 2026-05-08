import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import ImagePopover, { computeImagePopoverPlacement, IMAGE_POPOVER_ARROW_OFFSET, IMAGE_POPOVER_GAP } from '@/js/module/ImagePopover.js';
import '@/styles/bs5/summernote-bs5';

describe('ImagePopover', () => {
  let context;
  let imagePopover;

  beforeEach(() => {
    $$('body').empty();
    const $container = $$('<div style="position:relative;width:420px;height:260px"></div>').appendTo('body');
    const options = $$.extend(true, {}, $$.summernote.options, {
      container: $container,
    });
    $$.summernote.ui = $$.summernote.ui_template(options);
    context = {
      options,
      layoutInfo: {
        editable: $$('<div></div>').appendTo($container),
      },
      invoke: vi.fn(),
    };
    imagePopover = new ImagePopover(context);
  });

  afterEach(() => {
    imagePopover?.$popover?.remove();
    $$('body').empty();
  });

  it('anchors the toolbar close to the click position inside the image', () => {
    const position = computeImagePopoverPlacement({
      containerWidth: 800,
      containerHeight: 600,
      imageLeft: 240,
      imageTop: 180,
      imageHeight: 120,
      popoverWidth: 220,
      popoverHeight: 48,
      anchorLeft: 315,
      anchorTop: 215,
    });

    expect(position.left).to.equal(315 - IMAGE_POPOVER_ARROW_OFFSET);
    expect(position.top).to.equal(215 + IMAGE_POPOVER_GAP);
    expect(position.placement).to.equal('bottom');
  });

  it('keeps the toolbar fully inside the editor width', () => {
    const position = computeImagePopoverPlacement({
      containerWidth: 320,
      containerHeight: 600,
      imageLeft: 240,
      imageTop: 180,
      imageHeight: 120,
      popoverWidth: 220,
      popoverHeight: 48,
      anchorLeft: 310,
      anchorTop: 215,
    });

    expect(position.left).to.equal(100);
  });

  it('falls back above the image when there is no room near the click position', () => {
    const position = computeImagePopoverPlacement({
      containerWidth: 800,
      containerHeight: 220,
      imageTop: 180,
      imageHeight: 80,
      popoverWidth: 220,
      popoverHeight: 48,
      anchorLeft: 150,
      anchorTop: 205,
    });

    expect(position.top).to.equal(180 - 48 - IMAGE_POPOVER_GAP);
    expect(position.placement).to.equal('top');
  });

  it('keeps the fallback toolbar above the image near the top edge', () => {
    const position = computeImagePopoverPlacement({
      containerWidth: 800,
      containerHeight: 600,
      imageLeft: 120,
      imageTop: 10,
      imageHeight: 80,
      popoverWidth: 220,
      popoverHeight: 48,
      anchorLeft: 150,
      anchorTop: null,
    });

    expect(position.top).to.equal(0);
    expect(position.placement).to.equal('top');
  });

  it('computes fallback placement when size constraints are missing', () => {
    const position = computeImagePopoverPlacement({
      containerWidth: 100,
      imageTop: 10,
      popoverWidth: 220,
      popoverHeight: 48,
      anchorLeft: 5,
      anchorTop: null,
    });

    expect(position.left).to.equal(0);
    expect(position.top).to.equal(0);
    expect(position.placement).to.equal('top');
  });

  it('reads blur targets, pointer positions, and hides unsupported targets', () => {
    imagePopover.initialize();
    const hideSpy = vi.spyOn(imagePopover, 'hide');

    const button = document.createElement('button');
    imagePopover.$popover.append(button);
    const image = $$('<img style="display:block;width:160px;height:80px">').appendTo(context.layoutInfo.editable)[0];
    imagePopover.anchorState = {
      target: image,
    };

    expect(imagePopover.shouldInitialize()).to.equal(true);
    expect(new ImagePopover({
      ...context,
      options: {
        ...context.options,
        popover: {
          image: [],
        },
      },
    }).shouldInitialize()).to.equal(false);
    expect(imagePopover.getBlurRelatedTarget({ originalEvent: { relatedTarget: button } })).to.equal(button);
    expect(imagePopover.getBlurRelatedTarget({ relatedTarget: image })).to.equal(image);
    expect(imagePopover.getBlurRelatedTarget({})).to.equal(null);
    expect(imagePopover.shouldKeepVisibleOnBlur({ relatedTarget: button })).to.equal(true);
    expect(imagePopover.shouldKeepVisibleOnBlur({ relatedTarget: image })).to.equal(true);
    expect(imagePopover.shouldKeepVisibleOnBlur({ relatedTarget: document.createElement('div') })).to.equal(false);
    expect(imagePopover.shouldKeepVisibleOnBlur({ relatedTarget: 'invalid' })).to.equal(false);

    expect(imagePopover.getPointerLeft({ pageX: 999 }, 10, 50)).to.equal(60);
    expect(imagePopover.getPointerTop({ pageY: 1 }, 10, 50)).to.equal(10);
    expect(imagePopover.getPointerLeft({ clientX: 30 }, 10, 50)).to.equal(30);
    expect(imagePopover.getPointerTop({ clientY: 45 }, 10, 50)).to.equal(45);
    expect(imagePopover.getPointerLeft({}, 10, 50)).to.equal(null);
    expect(imagePopover.getPointerTop({}, 10, 50)).to.equal(null);

    imagePopover.events['summernote.blur'](null, { relatedTarget: document.body });
    imagePopover.events['summernote.disable summernote.dialog.shown']();
    expect(hideSpy).toHaveBeenCalled();

    imagePopover.hide();
    imagePopover.update(document.createElement('div'));
    expect(imagePopover.$popover.css('display')).to.equal('none');
  });

  it('updates image placement and clears anchor state on hide', () => {
    imagePopover.initialize();
    imagePopover.$popover.css({
      width: 120,
      height: 40,
    });

    const image = $$('<img style="display:block;width:160px;height:80px">').appendTo(context.layoutInfo.editable)[0];
    imagePopover.update(image, {
      originalEvent: {
        pageX: 90,
        pageY: 50,
      },
    });

    expect(imagePopover.$popover.attr('data-popper-placement')).to.equal('bottom');
    expect(imagePopover.$popover.css('visibility')).to.equal('visible');
    expect(imagePopover.anchorState.target).to.equal(image);

    imagePopover.update(image, {
      originalEvent: {
        clientX: 30,
        clientY: 25,
      },
    });
    expect(imagePopover.anchorState.offsetY).to.not.equal(null);

    const otherImage = document.createElement('img');
    imagePopover.anchorState = {
      target: otherImage,
      offsetX: 999,
      offsetY: 5,
    };
    imagePopover.update(image, {});
    expect(imagePopover.anchorState.target).to.equal(otherImage);

    imagePopover.update(image, {
      originalEvent: {
        pageY: 50,
      },
    });
    expect(imagePopover.anchorState.offsetX).to.equal(80);

    imagePopover.update(image, {
      originalEvent: {
        pageX: 90,
      },
    });
    expect(imagePopover.anchorState.offsetY).to.equal(null);

    imagePopover.$popover.trigger('mousedown');
    imagePopover.hide();
    expect(imagePopover.anchorState).to.equal(null);
  });
});
