import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import Context from '@/js/Context';
import Codeview from '@/js/module/Codeview';
import '@/styles/bs5/summernote-bs5';

describe('Codeview', () => {
  let options;
  let codeview;
  let context;

  beforeEach(() => {
    $$('body').empty();
    options = $$.extend({}, $$.summernote.options, {
      codeviewFilter: true,
    });

    const $note = $$('<div><p>hello</p></div>').appendTo('body');
    context = new Context($note, options);
    codeview = new Codeview(context);
  });

  afterEach(() => {
    codeview?.destroy();
    context?.destroy();
    $$('body').empty();
  });

  it('toggles codeview mode', () => {
    expect(codeview.isActivated()).to.be.false;
    codeview.toggle();
    expect(codeview.isActivated()).to.be.true;
    codeview.toggle();
    expect(codeview.isActivated()).to.be.false;
  });

  it('activates CodeMirror when a constructor is configured', () => {
    const doc = {
      setValue: vi.fn(),
    };
    const cmEditor = {
      getDoc: () => doc,
      getValue: vi.fn(() => '<p>from cm</p>'),
      on: vi.fn(),
      setSize: vi.fn(),
      toTextArea: vi.fn(),
    };
    const CodeMirrorConstructor = {
      fromTextArea: vi.fn(() => cmEditor),
    };

    codeview?.destroy();
    context?.destroy();

    options = $$.extend({}, $$.summernote.options, {
      codeviewFilter: true,
      codemirror: {
        ...$$.summernote.options.codemirror,
        CodeMirrorConstructor,
      },
    });
    context = new Context($$('<div><p>hello</p></div>').appendTo('body'), options);
    codeview = new Codeview(context);

    codeview.toggle();

    expect(codeview.isActivated()).to.be.true;
    expect(CodeMirrorConstructor.fromTextArea).toHaveBeenCalledOnce();
    expect(context.layoutInfo.codable.data('cmEditor')).to.equal(cmEditor);

    codeview.sync('<p>updated</p>');
    expect(doc.setValue).toHaveBeenCalledWith('<p>updated</p>');

    codeview.toggle();

    expect(codeview.isActivated()).to.be.false;
    expect(cmEditor.toTextArea).toHaveBeenCalledOnce();
    expect(context.layoutInfo.editable.html()).to.equal('<p>from cm</p>');
  });

  it('purifies malicious codes', () => {
    expect(codeview.purify('<script>alert("summernote");</script>')).to.equal('alert("summernote");');
    expect(
      codeview.purify(
        '<iframe frameborder="0" src="//www.youtube.com/embed/CXgsA98krxA" width="640" height="360" class="note-video-clip"></iframe>',
      ),
    ).to.equal(
      '<iframe frameborder="0" src="//www.youtube.com/embed/CXgsA98krxA" width="640" height="360" class="note-video-clip"></iframe>',
    );
    expect(
      codeview.purify(
        '<iframe frameborder="0" src="//wwwXyoutube.com/embed/CXgsA98krxA" width="640" height="360" class="note-video-clip">',
      ),
    ).to.equal('');
    expect(
      codeview.purify(
        '<iframe frameborder="0" src="//www.fake-youtube.com/embed/CXgsA98krxA" width="640" height="360" class="note-video-clip">',
      ),
    ).to.equal('');
    expect(
      codeview.purify(
        '<iframe frameborder="0" src="//www.youtube.com/embed/CXgsA98krxA" width="640" height="360" class="note-video-clip"  src  =  "//www.fake-youtube.com/embed/CXgsA98krxA"/>',
      ),
    ).to.equal('');
  });

  it('allows customized purify behavior', () => {
    codeview.options = options;
    codeview.options.codeviewIframeFilter = false;
    expect(
      codeview.purify(
        '<iframe frameborder="0" src="//www.fake-youtube.com/embed/CXgsA98krxA" width="640" height="360" class="note-video-clip">',
      ),
    ).toEqual(
      '<iframe frameborder="0" src="//www.fake-youtube.com/embed/CXgsA98krxA" width="640" height="360" class="note-video-clip">',
    );

    codeview.options = options;
    codeview.options.codeviewFilterRegex = /\d+/;
    expect(codeview.purify('<script>alert("summernote");</script>')).to.equal(
      '<script>alert("summernote");</script>',
    );
    expect(codeview.purify('<span>Tel: 012345678</span>')).to.equal('<span>Tel: </span>');
  });
});
