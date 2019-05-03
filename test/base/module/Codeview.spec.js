/**
 * Codeview.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
import chai from 'chai';
import $ from 'jquery';
import Context from '../../../src/js/base/Context';
import Codeview from '../../../src/js/base/module/Codeview';
import '../../../src/js/bs4/settings';

describe('Codeview', () => {
  var expect = chai.expect;
  var options, codeview, context;

  beforeEach(() => {
    options = $.extend({}, $.summernote.options);
    options.codeviewFilter = true;
    context = new Context($('<div><p>hello</p></div>'), options);
    codeview = new Codeview(context);
  });

  it('should toggle codeview mode', () => {
    expect(codeview.isActivated()).to.be.false;
    codeview.toggle();
    expect(codeview.isActivated()).to.be.true;
    codeview.toggle();
    expect(codeview.isActivated()).to.be.false;
  });

  it('should purify malicious codes', () => {
    expect(codeview.purify('<script>alert("summernote");</script>')).to.equalsIgnoreCase(
      'alert("summernote");'
    );
    expect(codeview.purify('<iframe frameborder="0" src="//www.youtube.com/embed/CXgsA98krxA" width="640" height="360" class="note-video-clip"></iframe>')).to.equalsIgnoreCase(
      '<iframe frameborder="0" src="//www.youtube.com/embed/CXgsA98krxA" width="640" height="360" class="note-video-clip"></iframe>'
    );
    expect(codeview.purify('<iframe frameborder="0" src="//wwwXyoutube.com/embed/CXgsA98krxA" width="640" height="360" class="note-video-clip">')).to.equalsIgnoreCase(
      ''
    );
    expect(codeview.purify('<iframe frameborder="0" src="//www.fake-youtube.com/embed/CXgsA98krxA" width="640" height="360" class="note-video-clip">')).to.equalsIgnoreCase(
      ''
    );
    expect(codeview.purify('<iframe frameborder="0" src="//www.youtube.com/embed/CXgsA98krxA" width="640" height="360" class="note-video-clip"  src  =  "//www.fake-youtube.com/embed/CXgsA98krxA"/>')).to.equalsIgnoreCase(
      ''
    );
  });

  it('should purify can be customized', () => {
    codeview.options = options;
    codeview.options.codeviewIframeFilter = false;
    expect(codeview.purify('<iframe frameborder="0" src="//www.fake-youtube.com/embed/CXgsA98krxA" width="640" height="360" class="note-video-clip">')).to.equalsIgnoreCase(
      '<iframe frameborder="0" src="//www.fake-youtube.com/embed/CXgsA98krxA" width="640" height="360" class="note-video-clip">'
    );
    codeview.options = options;
    codeview.options.codeviewFilterRegex = /\d+/;
    expect(codeview.purify('<script>alert("summernote");</script>')).to.equalsIgnoreCase(
      '<script>alert("summernote");</script>'
    );
    expect(codeview.purify('<span>Tel: 012345678</span>')).to.equalsIgnoreCase(
      '<span>Tel: </span>'
    );
  });
});
