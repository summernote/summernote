/**
 * Fullscreen.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */

import chai from 'chai';
import $ from 'jquery';
import Context from '../../../../src/js/base/Context';
import Fullscreen from '../../../../src/js/base/module/Fullscreen';

var expect = chai.expect;

describe('Fullscreen', () => {
  var fullscreen, context;

  beforeEach(() => {
    var options = $.extend({}, $.summernote.options);
    options.langInfo = $.extend(true, {
    }, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
    context = new Context($('<div><p>hello</p></div>'), options);
    fullscreen = new Fullscreen(context);
  });

  it('should toggle fullscreen mode', () => {
    expect(fullscreen.isFullscreen()).to.be.false;
    fullscreen.toggle();
    expect(fullscreen.isFullscreen()).to.be.true;
    fullscreen.toggle();
    expect(fullscreen.isFullscreen()).to.be.false;
  });
});
