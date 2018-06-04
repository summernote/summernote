/**
 * VideoDialog.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
import chai from 'chai';
import $ from 'jquery';
import Context from '../../../../src/js/base/Context';
import VideoDialog from '../../../../src/js/base/module/VideoDialog';

var expect = chai.expect;

describe('bs:module.VideoDialog', () => {
  function expectUrl(source, target) {
    var iframe = $video.createVideoNode(source);
    expect(iframe).to.not.equal(false);
    expect(iframe.tagName).to.equal('IFRAME');
    expect(iframe.src).to.be.have.string(target);
  }

  var context, $video;
  beforeEach(() => {
    var $note = $('<div></div>').appendTo('body');
    var options = $.extend({}, $.summernote.options);
    options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
    options.toolbar = [
      ['video', ['video']]
    ];
    context = new Context($note, options);
    context.initialize();

    $video = new VideoDialog(context);
  });

  describe('#createVideoNode', () => {
    it('should get false when insert invalid urls', () => {
      expect($video.createVideoNode('http://www.google.com')).to.equal(false);
      expect($video.createVideoNode('http://www.youtube.com')).to.equal(false);
      expect($video.createVideoNode('http://www.facebook.com')).to.equal(false);
    });

    it('should get proper iframe src when insert valid video urls', () => {
      // YouTube
      expectUrl('https://www.youtube.com/watch?v=jNQXAC9IVRw',
        '//www.youtube.com/embed/jNQXAC9IVRw');
      // Instagram
      expectUrl('https://www.instagram.com/p/Bi9cbsxjn-F',
        '//instagram.com/p/Bi9cbsxjn-F/embed/');
      // v.qq.com
      expectUrl('http://v.qq.com/cover/6/640ewqy2v071ppd.html?vid=f0196y2b2cx',
        '//v.qq.com/iframe/player.html?vid=f0196y2b2cx&amp;auto=0');
      expectUrl('http://v.qq.com/x/page/p0330y279lm.html',
        '//v.qq.com/iframe/player.html?vid=p0330y279lm&amp;auto=0');
    });

    it('should be embedded start parameter when insert YouTube video with t', () => {
      expectUrl('https://youtu.be/wZZ7oFKsKzY?t=4h2m42s',
        '//www.youtube.com/embed/wZZ7oFKsKzY?start=14562');
    });
  });
});
