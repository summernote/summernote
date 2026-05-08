import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import VideoPopover from '@/js/module/VideoPopover';
import '@/styles/bs5/summernote-bs5';

function createContext(overrides = {}) {
  const $container = $$('<div style="position:relative;width:420px;height:260px"></div>').appendTo('body');
  const options = $$.extend(true, {}, $$.summernote.options, {
    container: $container,
  }, overrides.options);
  $$.summernote.ui = $$.summernote.ui_template(options);
  return {
    options,
    layoutInfo: {
      editable: $$('<div></div>').appendTo($container),
    },
    invoke: vi.fn(),
    ...overrides,
  };
}

describe('VideoPopover', () => {
  beforeEach(() => {
    $$('body').empty();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    $$('body').empty();
  });

  it('keeps focus across blur targets and reads pointer coordinates', () => {
    const context = createContext();
    const videoPopover = new VideoPopover(context);
    videoPopover.initialize();
    const hideSpy = vi.spyOn(videoPopover, 'hide');

    const button = document.createElement('button');
    videoPopover.$popover.append(button);
    const media = $$('<iframe class="note-video-clip" style="display:block;width:160px;height:90px"></iframe>')
      .appendTo(context.layoutInfo.editable)[0];
    videoPopover.anchorState = {
      target: media,
    };

    expect(videoPopover.shouldInitialize()).to.equal(true);
    expect(new VideoPopover(createContext({
      options: {
        popover: {
          video: [],
        },
      },
    })).shouldInitialize()).to.equal(false);
    expect(videoPopover.getBlurRelatedTarget({ originalEvent: { relatedTarget: button } })).to.equal(button);
    expect(videoPopover.getBlurRelatedTarget({ relatedTarget: media })).to.equal(media);
    expect(videoPopover.getBlurRelatedTarget({})).to.equal(null);
    expect(videoPopover.shouldKeepVisibleOnBlur({ relatedTarget: button })).to.equal(true);
    expect(videoPopover.shouldKeepVisibleOnBlur({ relatedTarget: media })).to.equal(true);
    expect(videoPopover.shouldKeepVisibleOnBlur({ relatedTarget: document.createElement('div') })).to.equal(false);
    expect(videoPopover.shouldKeepVisibleOnBlur({ relatedTarget: 'invalid' })).to.equal(false);

    expect(videoPopover.getPointerLeft({ pageX: 999 }, 10, 50)).to.equal(60);
    expect(videoPopover.getPointerTop({ pageY: 1 }, 10, 50)).to.equal(10);
    expect(videoPopover.getPointerLeft({ clientX: 30 }, 10, 50)).to.equal(30);
    expect(videoPopover.getPointerTop({ clientY: 45 }, 10, 50)).to.equal(45);
    expect(videoPopover.getPointerLeft({}, 10, 50)).to.equal(null);
    expect(videoPopover.getPointerTop({}, 10, 50)).to.equal(null);

    videoPopover.events['summernote.blur'](null, { relatedTarget: button });
    expect(hideSpy).not.toHaveBeenCalled();

    videoPopover.events['summernote.blur'](null, { relatedTarget: document.body });
    videoPopover.events['summernote.disable summernote.dialog.shown']();
    expect(hideSpy).toHaveBeenCalled();
  });

  it('updates media placement, hides unsupported targets, and tears down cleanly', () => {
    const context = createContext();
    const videoPopover = new VideoPopover(context);
    videoPopover.initialize();
    videoPopover.$popover.css({
      width: 120,
      height: 40,
    });

    const media = $$('<iframe class="note-video-clip" style="display:block;width:160px;height:90px"></iframe>')
      .appendTo(context.layoutInfo.editable)[0];
    videoPopover.update(media, {
      originalEvent: {
        pageX: 90,
        pageY: 50,
      },
    });

    expect(videoPopover.$popover.attr('data-popper-placement')).to.equal('bottom');
    expect(videoPopover.$popover.css('visibility')).to.equal('visible');
    expect(videoPopover.anchorState.target).to.equal(media);

    videoPopover.update(media, {
      originalEvent: {
        clientX: 30,
        clientY: 25,
      },
    });
    expect(videoPopover.anchorState.offsetY).to.not.equal(null);

    const otherMedia = document.createElement('iframe');
    otherMedia.className = 'note-video-clip';
    videoPopover.anchorState = {
      target: otherMedia,
      offsetX: 999,
      offsetY: 5,
    };
    videoPopover.update(media, {});
    expect(videoPopover.anchorState.target).to.equal(otherMedia);

    videoPopover.update(media, {
      originalEvent: {
        pageY: 50,
      },
    });
    expect(videoPopover.anchorState.offsetX).to.equal(82);

    videoPopover.update(media, {
      originalEvent: {
        pageX: 90,
      },
    });
    expect(videoPopover.anchorState.offsetY).to.equal(null);

    const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    videoPopover.$popover[0].dispatchEvent(mouseDownEvent);
    expect(mouseDownEvent.defaultPrevented).to.equal(true);

    videoPopover.update(document.createElement('div'));
    expect(videoPopover.$popover.css('display')).to.equal('none');
    expect(videoPopover.anchorState).to.equal(null);

    const popoverNode = videoPopover.$popover[0];
    videoPopover.destroy();
    expect(popoverNode.isConnected).to.equal(false);
  });
});
