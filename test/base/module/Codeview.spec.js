/**
 * Codeview.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
import $ from 'jquery';
import chai from 'chai';
import chaidom from 'test/chaidom';
import Context from 'src/js/Context';
import Codeview from 'src/js/module/Codeview';
import 'src/styles/bs4/summernote-bs4';

chai.use(chaidom);

function loadScript(url) {
  var script = document.createElement('script');
  script.src = url;
  script.async = false;
  script.type = 'text/javascript';
  document.head.appendChild(script);

  return script;
}

function unloadScript(script) {
  document.head.removeChild(script);
}

describe('Codeview', () => {
  var expect = chai.expect;
  var options, codeview, context;

  beforeEach(() => {
    $('body').empty(); // important !
    options = $.extend({}, $.summernote.options);
    options.codeviewFilter = true;

    var $note = $('<div><p>hello</p></div>').appendTo('body');
    context = new Context($note, options);
    codeview = new Codeview(context);
  });

  it('should toggle codeview mode', () => {
    expect(codeview.isActivated()).to.be.false;
    codeview.toggle();
    expect(codeview.isActivated()).to.be.true;
    codeview.toggle();
    expect(codeview.isActivated()).to.be.false;
  });

  it('should show CodeMirror if available', (done) => {
    var codemirror = loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/codemirror.js');
    codemirror.onload = function() {
      // need to reinitiate codeview
      codeview = new Codeview(context);
      expect(codeview.isActivated()).to.be.false;
      codeview.toggle();
      expect(codeview.isActivated()).to.be.true;
      expect($('.CodeMirror').length).to.be.equal(1);
      codeview.toggle();
      expect(codeview.isActivated()).to.be.false;
      expect($('.CodeMirror').length).to.be.equal(0);
      unloadScript(codemirror);
      done();
    };
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
