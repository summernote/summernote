import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from '/test/util';
import $$ from '@/js/core/dom-query.js';
import Context from '@/js/Context';
import VideoDialog from '@/js/module/VideoDialog';
import env from '@/js/core/env';
import key from '@/js/core/key';
import '@/styles/bs5/summernote-bs5';

describe('VideoDialog', () => {
  let context;
  let videoDialog;

  function expectUrl(source, target) {
    const iframe = videoDialog.createVideoNode(source);
    expect(iframe).not.to.equal(false);
    expect(iframe.tagName).to.equal('IFRAME');
    expect(iframe.src).toContain(target);
  }

  beforeEach(() => {
    $$('body').empty();

    const $note = $$('<div></div>').appendTo('body');
    const options = $$.extend({}, $$.summernote.options, {
      toolbar: [['video', ['video']]],
    });

    context = new Context($note, options);
    videoDialog = new VideoDialog(context);
    videoDialog.initialize();
  });

  afterEach(() => {
    context?.destroy();
    $$('body').empty();
  });

  describe('#createVideoNode', () => {
    it('gets false for invalid urls', () => {
      expect(videoDialog.createVideoNode('http://www.google.com')).to.equal(false);
      expect(videoDialog.createVideoNode('http://www.youtube.com')).to.equal(false);
      expect(videoDialog.createVideoNode('http://www.facebook.com')).to.equal(false);
    });

    it('creates proper iframe src for supported providers', () => {
      expectUrl('https://www.youtube.com/watch?v=jNQXAC9IVRw', '/embed/jNQXAC9IVRw');
      expectUrl('https://www.instagram.com/p/C6y2mNwpj1k/', '/p/C6y2mNwpj1k/embed/');
      expectUrl(
        'http://v.qq.com/cover/6/640ewqy2v071ppd.html?vid=f0196y2b2cx',
        '/txp/iframe/player.html?vid=f0196y2b2cx&auto=0',
      );
      expectUrl(
        'http://v.qq.com/x/page/p0330y279lm.html',
        '/txp/iframe/player.html?vid=p0330y279lm&auto=0',
      );
      expectUrl(
        'https://www.facebook.com/Engineering/videos/631826881803/',
        '/plugins/video.php?href=www.facebook.com%2FEngineering%2Fvideos%2F631826881803',
      );
    });

    it('embeds a start parameter for YouTube t values', () => {
      expectUrl('https://youtu.be/wZZ7oFKsKzY?t=4h2m42s', '/embed/wZZ7oFKsKzY?start=14562');
    });

    it('parses numeric YouTube t values and partial timestamp groups', () => {
      expectUrl('https://youtu.be/wZZ7oFKsKzY?t=90', '/embed/wZZ7oFKsKzY?start=90');
      expectUrl('https://youtu.be/wZZ7oFKsKzY?t=2m', '/embed/wZZ7oFKsKzY?start=120');
    });

    it('accepts multiple YouTube URL formats', () => {
      expectUrl('https://www.youtube.com/watch?v=jNQXAC9IVRw', '/embed/jNQXAC9IVRw');
      expectUrl('https://youtu.be/jNQXAC9IVRw', '/embed/jNQXAC9IVRw');
      expectUrl('https://www.youtube.com/embed/jNQXAC9IVRw', '/embed/jNQXAC9IVRw');
      expectUrl('https://www.youtube.com/shorts/SXHMnicI6Pg', '/embed/SXHMnicI6Pg');
      expectUrl('https://www.youtube.com/live/DxmRTlPv8Q4', '/embed/DxmRTlPv8Q4');
    });

    it('creates nodes for the remaining supported providers and file formats', () => {
      expectUrl('https://drive.google.com/file/d/abc123/view', '/file/d/abc123/preview');
      expectUrl('https://vine.co/v/abcd1234', '/embed/simple');
      expectUrl('https://vimeo.com/123456789', '/video/123456789');
      expectUrl('https://www.dailymotion.com/video/x7tgczw', '/embed/video/x7tgczw');
      expectUrl('https://v.youku.com/v_show/id_XND.html', '/embed/XND');

      const peerTube = videoDialog.createVideoNode('https://peertube.example/videos/watch/video-id?start=5&stop=8&loop=1&autoplay=1&muted=1');
      expect(peerTube).not.to.equal(false);
      expect(peerTube.src).to.contain('/videos/embed/video-id');
      expect(peerTube.src).to.contain('autoplay=1');
      expect(peerTube.src).to.contain('start=5');
      expect(peerTube.src).to.contain('end=8');

      const peerTubeDefaults = videoDialog.createVideoNode('https://peertube.example/videos/watch/video-id');
      expect(peerTubeDefaults).not.to.equal(false);
      expect(peerTubeDefaults.src).to.contain('loop=0');
      expect(peerTubeDefaults.src).not.to.contain('start=');

      const mp4 = videoDialog.createVideoNode('https://example.com/movie.mp4');
      const ogg = videoDialog.createVideoNode('https://example.com/movie.ogg');
      const webm = videoDialog.createVideoNode('https://example.com/movie.webm');

      expect(mp4.tagName).to.equal('VIDEO');
      expect(ogg.tagName).to.equal('VIDEO');
      expect(webm.tagName).to.equal('VIDEO');
      expect(mp4.classList.contains('note-video-clip')).to.equal(true);
    });
  });

  it('binds the dialog lifecycle and inserts selected videos', async() => {
    const invoke = vi.spyOn(context, 'invoke');

    videoDialog.show();
    await nextTick();
    videoDialog.$dialog.trigger('shown.bs.modal');
    await nextTick();

    const $url = videoDialog.$dialog.find('.note-video-url');
    $url.val('https://youtu.be/jNQXAC9IVRw');
    $url.trigger('input');
    videoDialog.$dialog.find('.note-video-btn').trigger('click');
    await nextTick();

    expect(invoke.mock.calls.some(([namespace]) => namespace === 'editor.insertNode')).to.equal(true);
  });

  it('restores the saved range when the dialog is dismissed', async() => {
    const invoke = vi.spyOn(context, 'invoke');

    videoDialog.show();
    await nextTick();
    videoDialog.$dialog.trigger('shown.bs.modal');
    await nextTick();
    videoDialog.$dialog.trigger('hidden.bs.modal');
    await nextTick();

    expect(invoke.mock.calls.filter(([namespace]) => namespace === 'editor.restoreRange').length).to.be.greaterThan(0);
  });

  it('binds enter-key submission and ignores non-enter presses', () => {
    const $input = $$('<input type="text">');
    const $button = $$('<button type="button"></button>');
    const clickSpy = vi.spyOn($button, 'trigger');

    videoDialog.bindEnterKey($input, $button);

    const tabKeypressEvent = new Event('keypress', { bubbles: true, cancelable: true });
    Object.defineProperty(tabKeypressEvent, 'keyCode', { value: key.code.TAB });
    $input[0].dispatchEvent(tabKeypressEvent);

    const enterKeypressEvent = new Event('keypress', { bubbles: true, cancelable: true });
    Object.defineProperty(enterKeypressEvent, 'keyCode', { value: key.code.ENTER });
    $input[0].dispatchEvent(enterKeypressEvent);

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledWith('click');
  });

  it('does not insert a node for unsupported video urls', async() => {
    const invoke = vi.spyOn(context, 'invoke');

    videoDialog.show();
    await nextTick();
    videoDialog.$dialog.trigger('shown.bs.modal');
    await nextTick();

    const $url = videoDialog.$dialog.find('.note-video-url');
    $url.val('https://example.com/not-a-video');
    $url.trigger('input');
    videoDialog.$dialog.find('.note-video-btn').trigger('click');
    await nextTick();
    videoDialog.$dialog.trigger('hidden.bs.modal');
    await nextTick();

    expect(invoke.mock.calls.some(([namespace]) => namespace === 'editor.insertNode')).to.equal(false);
  });

  it('skips autofocus on touch devices', async() => {
    const originalIsSupportTouch = env.isSupportTouch;
    env.isSupportTouch = true;

    videoDialog.showVideoDialog().catch(() => {});
    await nextTick();
    videoDialog.$dialog.trigger('shown.bs.modal');
    await nextTick();

    expect(videoDialog.$dialog.find('.note-video-url').is(':focus')).to.equal(false);
    env.isSupportTouch = originalIsSupportTouch;
  });
});
