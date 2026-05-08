import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import dom from '@/js/core/dom';
import key from '@/js/core/key';
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

  it('saves and restores plain textarea codeview content', () => {
    codeview.activate();
    context.layoutInfo.codable.val('<p>changed</p>');

    codeview.sync();
    expect(context.layoutInfo.codable.val()).to.equal('<p>changed</p>');

    codeview.deactivate();
    expect(context.layoutInfo.editable.html()).to.equal('<p>changed</p>');
  });

  it('syncs plain textarea html and only exits codeview on escape', () => {
    const deactivate = vi.spyOn(codeview, 'deactivate');

    codeview.initialize();
    codeview.activate();
    codeview.sync('<p>updated</p>');

    expect(context.layoutInfo.codable.val()).to.equal('<p>updated</p>');

    const keyupEvent = new Event('keyup', { bubbles: true });
    Object.defineProperty(keyupEvent, 'keyCode', { value: key.code.TAB });
    context.layoutInfo.codable[0].dispatchEvent(keyupEvent);

    expect(deactivate).not.toHaveBeenCalled();
  });

  it('binds escape, blur and input handlers when codemirror is unavailable', () => {
    const triggerEvent = vi.spyOn(context, 'triggerEvent');
    const deactivate = vi.spyOn(codeview, 'deactivate');

    codeview.initialize();
    codeview.activate();
    context.layoutInfo.codable.val('<p>typed</p>');

    context.layoutInfo.codable[0].dispatchEvent(new Event('input', { bubbles: true }));
    context.layoutInfo.codable[0].dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    const keyupEvent = new Event('keyup', { bubbles: true });
    Object.defineProperty(keyupEvent, 'keyCode', { value: key.code.ESCAPE });
    context.layoutInfo.codable[0].dispatchEvent(keyupEvent);

    expect(triggerEvent).toHaveBeenCalledWith('change.codeview', '<p>typed</p>', context.layoutInfo.codable);
    expect(deactivate).toHaveBeenCalled();
    expect(triggerEvent.mock.calls.some(([namespace]) => namespace === 'blur.codeview')).to.equal(true);
  });

  it('saves codemirror content when syncing without html and destroys active codeview', () => {
    const save = vi.fn();
    const toTextArea = vi.fn();
    const cmEditor = {
      getDoc: () => ({ setValue: vi.fn() }),
      getValue: vi.fn(() => '<p>saved</p>'),
      on: vi.fn(),
      save,
      setSize: vi.fn(),
      toTextArea,
    };
    function TernServer() {
      this.updateArgHints = vi.fn();
    }
    const CodeMirrorConstructor = {
      fromTextArea: vi.fn(() => cmEditor),
      TernServer,
    };

    codeview?.destroy();
    context?.destroy();

    options = $$.extend({}, $$.summernote.options, {
      codemirror: {
        ...$$.summernote.options.codemirror,
        tern: { defs: [] },
        CodeMirrorConstructor,
      },
    });
    context = new Context($$('<div><p>hello</p></div>').appendTo('body'), options);
    codeview = new Codeview(context);

    codeview.activate();
    codeview.sync();
    expect(save).toHaveBeenCalledOnce();

    codeview.destroy();
    expect(toTextArea).toHaveBeenCalledOnce();
    expect(context.layoutInfo.editable.html()).to.equal('<p>saved</p>');
  });

  it('emits codemirror tern, blur, and change callbacks', () => {
    const handlers = {};
    const updateArgHints = vi.fn();
    const cmEditor = {
      getDoc: () => ({ setValue: vi.fn() }),
      getValue: vi.fn(() => '<p>cm callbacks</p>'),
      on: vi.fn((name, handler) => {
        handlers[name] = handler;
      }),
      setSize: vi.fn(),
      toTextArea: vi.fn(),
    };
    function TernServer() {
      this.updateArgHints = updateArgHints;
    }
    const CodeMirrorConstructor = {
      fromTextArea: vi.fn(() => cmEditor),
      TernServer,
    };

    codeview?.destroy();
    context?.destroy();

    options = $$.extend({}, $$.summernote.options, {
      codemirror: {
        ...$$.summernote.options.codemirror,
        tern: { defs: [] },
        CodeMirrorConstructor,
      },
    });
    context = new Context($$('<div><p>hello</p></div>').appendTo('body'), options);
    codeview = new Codeview(context);

    const triggerEvent = vi.spyOn(context, 'triggerEvent');
    codeview.activate();

    handlers.cursorActivity('cursor');
    handlers.blur('blur-event');
    handlers.change();

    expect(updateArgHints).toHaveBeenCalledWith('cursor');
    expect(triggerEvent).toHaveBeenCalledWith('blur.codeview', '<p>cm callbacks</p>', 'blur-event');
    expect(triggerEvent).toHaveBeenCalledWith('change.codeview', '<p>cm callbacks</p>', cmEditor);
  });

  it('returns unfiltered values and restores empty content with explicit heights', () => {
    codeview.options.codeviewFilter = false;
    expect(codeview.purify('<script>alert("summernote");</script>')).to.equal('<script>alert("summernote");</script>');

    context.options.height = 120;
    codeview.activate();
    context.layoutInfo.codable.val('');
    context.layoutInfo.codable.height(77);
    const expectedHeight = context.layoutInfo.codable.height();

    codeview.deactivate();

    expect(context.layoutInfo.editable.html()).to.equal(dom.emptyPara);
    expect(context.layoutInfo.editable[0].style.height).to.equal(`${expectedHeight}px`);
  });
});
