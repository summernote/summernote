/**
 * Fullscreen.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */

import chai from 'chai';
import $ from 'jquery';
import Context from '../../../src/js/base/Context';
import Fullscreen from '../../../src/js/base/module/Fullscreen';
import '../../../src/js/bs4/settings';

describe('Fullscreen', () => {
  var expect = chai.expect;
  var fullscreen, context;

  beforeEach(() => {
    var options = $.extend({}, $.summernote.options);
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
