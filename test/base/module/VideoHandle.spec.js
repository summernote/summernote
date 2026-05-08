import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from '/test/util';
import $$ from '@/js/core/dom-query.js';
import Context from '@/js/Context';
import '@/styles/bs5/summernote-bs5';

function dispatchMediaMouseDown(element) {
  const rect = element.getBoundingClientRect();
  const clickX = rect.left + Math.max(10, rect.width / 2);
  const clickY = rect.top + Math.max(10, rect.height / 2);

  element.dispatchEvent(new MouseEvent('mousedown', {
    bubbles: true,
    clientX: clickX,
    clientY: clickY,
    pageX: clickX + window.scrollX,
    pageY: clickY + window.scrollY,
  }));
}

describe('Video handle integration', () => {
  let context;
  let $editable;

  beforeEach(() => {
    $$('body').empty();
    const $note = $$('<div><p>hello</p></div>').appendTo('body');
    context = new Context($note, $$.extend({}, $$.summernote.options));
    $editable = context.layoutInfo.editable;
  });

  afterEach(() => {
    context?.destroy();
    $$('body').empty();
  });

  it('shows the video popover when a video clip is clicked', async() => {
    $editable.html('<p><video id="test-video" class="note-video-clip" style="display:block;width:320px;height:180px"></video></p>');

    const video = $editable.find('#test-video')[0];
    dispatchMediaMouseDown(video);
    await nextTick();

    expect($$('.note-control-selection').css('display')).to.equal('block');
    expect($$('.note-video-popover').css('display')).to.equal('block');
    expect($$('.note-image-popover').css('display')).to.equal('none');
  });

  it('resizes a selected video clip from the video popover', async() => {
    $editable.html('<p><video id="test-video" class="note-video-clip" style="display:block;width:320px;height:180px"></video></p>');

    const video = $editable.find('#test-video')[0];
    dispatchMediaMouseDown(video);
    await nextTick();

    const resizeHalfButton = $$('.note-video-popover').find('button').filter((_, button) => button.textContent.trim() === '50%');
    resizeHalfButton.trigger('click');
    await nextTick();

    expect($editable.find('#test-video')[0].style.width).to.equal('50%');
  });

  it('plays the selected html5 video from the video popover', async() => {
    $editable.html('<p><video id="test-video" class="note-video-clip" style="display:block;width:320px;height:180px"></video></p>');

    const video = $editable.find('#test-video')[0];
    let playCalls = 0;
    video.play = () => {
      playCalls += 1;
      return Promise.resolve();
    };

    dispatchMediaMouseDown(video);
    await nextTick();

    const playButton = $$('.note-video-popover').find('button').filter((_, button) => button.textContent.trim() === 'Play');
    playButton.trigger('click');
    await nextTick();

    expect(playCalls).to.equal(1);
  });

  it('adds autoplay to embedded video iframes from the play button', async() => {
    $editable.html('<p><iframe id="test-frame" class="note-video-clip" src="//www.youtube.com/embed/jNQXAC9IVRw" width="320" height="180"></iframe></p>');

    const iframe = $editable.find('#test-frame')[0];
    dispatchMediaMouseDown(iframe);
    await nextTick();

    const playButton = $$('.note-video-popover').find('button').filter((_, button) => button.textContent.trim() === 'Play');
    playButton.trigger('click');
    await nextTick();

    expect(iframe.getAttribute('src')).to.contain('autoplay=1');
  });
});
