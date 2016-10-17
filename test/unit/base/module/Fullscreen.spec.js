/**
 * Fullscreen.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
define([
  'chai',
  'summernote/base/Context',
  'summernote/base/module/Fullscreen'
], function (chai, Context, Fullscreen) {
  'use strict';

  var expect = chai.expect;

  describe('Fullscreen', function () {
    var fullscreen, context;

    beforeEach(function () {
      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {
      }, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
      context = new Context($('<div><p>hello</p></div>'), options);
      fullscreen = new Fullscreen(context);
    });

    it('should toggle fullscreen mode', function () {
      expect(fullscreen.isFullscreen()).to.be.false;
      fullscreen.toggle();
      expect(fullscreen.isFullscreen()).to.be.true;
      fullscreen.toggle();
      expect(fullscreen.isFullscreen()).to.be.false;
    });
  });
});
