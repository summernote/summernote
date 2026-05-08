import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import Context from '@/js/Context';
import VideoDialog from '@/js/module/VideoDialog';
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

    it('accepts multiple YouTube URL formats', () => {
      expectUrl('https://www.youtube.com/watch?v=jNQXAC9IVRw', '/embed/jNQXAC9IVRw');
      expectUrl('https://youtu.be/jNQXAC9IVRw', '/embed/jNQXAC9IVRw');
      expectUrl('https://www.youtube.com/embed/jNQXAC9IVRw', '/embed/jNQXAC9IVRw');
      expectUrl('https://www.youtube.com/shorts/SXHMnicI6Pg', '/embed/SXHMnicI6Pg');
      expectUrl('https://www.youtube.com/live/DxmRTlPv8Q4', '/embed/DxmRTlPv8Q4');
    });
  });
});
