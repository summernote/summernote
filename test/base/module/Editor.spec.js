import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from '/test/util';
import $$ from '@/js/core/dom-query.js';
import env from '@/js/core/env';
import key from '@/js/core/key';
import range from '@/js/core/range';
import Context from '@/js/Context';
import '@/styles/bs5/summernote-bs5';

describe('Editor', () => {
  let editor;
  let context;
  let $editable;

  async function expectContents(markup) {
    await nextTick();
    expect($editable.html()).toEqual(markup);
  }

  beforeEach(() => {
    $$('body').empty();
    const options = $$.extend({}, $$.summernote.options, {
      historyLimit: 5,
    });
    context = new Context($$('<div><p>hello</p></div>').appendTo('body'), options);
    editor = context.modules.editor;
    $editable = context.layoutInfo.editable;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    context?.destroy();
    $$('body').empty();
  });

  it('supports undo and redo for inserted text', async() => {
    editor.insertText(' world');
    await expectContents('<p>hello world</p>');

    editor.undo();
    await expectContents('<p>hello</p>');

    editor.redo();
    await expectContents('<p>hello world</p>');
  });

  it('inserts paragraphs and horizontal rules', async() => {
    editor.insertParagraph();
    await expectContents('<p>hello</p><p><br></p>');

    editor.insertHorizontalRule();
    await expectContents('<p>hello</p><p><br></p><hr><p><br></p>');
  });

  it('inserts images as data URLs', async() => {
    const source =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAF0lEQVQYGWP8////fwYsgAmLGFiIHhIAT+oECGHuN2UAAAAASUVORK5CYII=';

    await editor.insertImage(source, 'image');

    expect($editable.find('img').attr('src')).toEqual(source);
  });

  it('toggles ordered and unordered lists', async() => {
    editor.insertOrderedList();
    await expectContents('<ol><li>hello</li></ol>');

    editor.insertUnorderedList();
    await expectContents('<ul><li>hello</li></ul>');

    editor.insertUnorderedList();
    await expectContents('<p>hello</p>');
  });

  it('indents and outdents paragraphs', async() => {
    editor.indent();
    await expectContents('<p style="margin-left: 25px;">hello</p>');

    editor.outdent();
    await nextTick();
    expect($editable.find('p').css('margin-left')).to.equal('0px');
  });

  it('pastes sanitized html and inserts tables', async() => {
    editor.pasteHTML('<span> world</span>');
    await expectContents('<p>hello<span> world</span></p>');

    editor.insertTable('2x2');
    await expectContents([
      '<p>hello<span> world</span></p>',
      '<table class="table table-bordered"><tbody>',
      '<tr><td><br></td><td><br></td></tr>',
      '<tr><td><br></td><td><br></td></tr>',
      '</tbody></table>',
      '<p><span><br></span></p>',
    ].join(''));
  });

  it('applies basic format blocks', async() => {
    $editable.appendTo('body');
    const textNode = $editable.find('p')[0].firstChild;
    editor.setLastRange(range.create(textNode, 0, textNode, 0).select());

    editor.formatBlock('h1');

    await expectContents('<h1>hello</h1>');
  });

  it('creates normal, relative, and escaped links', async() => {
    const textNode = $editable.find('p')[0].firstChild;

    editor.createLink({
      url: 'http://summernote.org',
      text: 'summernote',
      range: range.create(textNode, 5, textNode, 5),
    });
    await expectContents('<p>hello<a href="http://summernote.org">summernote</a></p>');

    context.invoke('code', '<p>hello</p>');
    const resetTextNode = $editable.find('p')[0].firstChild;
    editor.createLink({
      url: '/relative/url',
      text: 'summernote',
      range: range.create(resetTextNode, 5, resetTextNode, 5),
      isNewWindow: true,
    });
    await expectContents('<p>hello<a href="/relative/url" target="_blank">summernote</a></p>');

    context.invoke('code', '<p>hello</p>');
    const safeTextNode = $editable.find('p')[0].firstChild;
    editor.createLink({
      url: '/relative/url',
      text: '<iframe src="hackme.com"></iframe>',
      range: range.create(safeTextNode, 5, safeTextNode, 5),
      isNewWindow: true,
    });
    await expectContents('<p>hello<a href="/relative/url" target="_blank">&lt;iframe src="hackme.com"&gt;&lt;/iframe&gt;</a></p>');
  });

  it('respects max text length when inserting text', async() => {
    context.destroy();
    const options = $$.extend({}, $$.summernote.options, {
      maxTextLength: 5,
    });

    context = new Context($$('<div><p>hello</p></div>').appendTo('body'), options);
    editor = context.modules.editor;
    $editable = context.layoutInfo.editable;

    editor.insertText(' world');

    await expectContents('<p>hello</p>');
  });

  it('returns the current text selection when it starts in a text node', () => {
    context.invoke('code', '<p><a href="https://example.com">hello</a> world</p>');

    const textNode = $editable.find('a')[0].firstChild;
    const selection = window.getSelection();
    const nativeRange = document.createRange();
    nativeRange.setStart(textNode, 0);
    nativeRange.setEnd(textNode, textNode.textContent.length);
    selection.removeAllRanges();
    selection.addRange(nativeRange);

    const currentRange = editor.getLastRange();

    expect(currentRange.sc).to.equal(textNode);
    expect(currentRange.ec).to.equal(textNode);
    expect(currentRange.isCollapsed()).to.be.false;
    expect(currentRange.toString()).to.equal('hello');
  });

  it('supports additional link creation branches and command helpers', async() => {
    context.invoke('code', '<p>hello</p>');
    const textNode = $editable.find('p')[0].firstChild;
    context.options.linkAddNoReferrer = true;
    context.options.linkAddNoOpener = true;

    editor.createLink({
      url: ' email@example.com ',
      text: 'hello',
      range: range.create(textNode, 0, textNode, textNode.textContent.length),
      isNewWindow: true,
    });
    await expectContents('<p><a href="mailto:email@example.com" target="_blank" rel="noreferrer noopener">hello</a></p>');

    context.invoke('code', '<p>hello</p>');
    const plainTextNode = $editable.find('p')[0].firstChild;
    context.options.onCreateLink = (linkUrl) => `custom:${linkUrl}`;
    editor.createLink({
      url: 'summernote.org',
      text: 'summernote',
      range: range.create(plainTextNode, 5, plainTextNode, 5),
      isNewWindow: false,
    });
    await expectContents('<p>hello<a href="custom:summernote.org">summernote</a></p>');

    expect(editor.checkLinkUrl('020 1234 5678')).to.equal('tel:020 1234 5678');
    expect(editor.checkLinkUrl('summernote.org')).to.equal('http://summernote.org');
    expect(editor.checkLinkUrl('/docs')).to.equal('/docs');
  });

  it('supports media removal, float, resize, and playback helpers', async() => {
    context.invoke('code', '<figure><img id="image" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" width="120" height="60"></figure><p><br></p>');
    const mediaDelete = vi.fn();
    context.options.callbacks.onMediaDelete = mediaDelete;
    const image = $editable.find('#image')[0];
    editor.saveTarget(image);

    editor.floatMe('left');
    expect(image.classList.contains('note-float-left')).to.equal(true);

    editor.resize('0.5');
    expect(() => editor.resize('0.5')).not.to.throw();

    editor.resize('0');
    expect(() => editor.resize('0')).not.to.throw();

    vi.spyOn(editor, 'afterCommand').mockImplementation(() => {});
    vi.spyOn(range, 'createFromSelection').mockReturnValue({
      select: vi.fn(),
    });
    editor.saveTarget(image);
    editor.removeMedia();
    await nextTick();
    expect($editable.find('figure').length).to.equal(0);

    context.invoke('code', '<p><video id="video" class="note-video-clip"></video><iframe id="frame" class="note-video-clip" src="//www.youtube.com/embed/jNQXAC9IVRw"></iframe></p>');
    const video = $editable.find('#video')[0];
    const frame = $editable.find('#frame')[0];
    let playCalls = 0;
    video.play = () => {
      playCalls += 1;
      return Promise.resolve();
    };

    editor.saveTarget(video);
    editor.playMedia();
    expect(playCalls).to.equal(1);

    editor.saveTarget(frame);
    editor.playMedia();
    expect(frame.getAttribute('src')).to.contain('autoplay=1');

    editor.clearTarget();
    editor.playMedia();
    expect(mediaDelete).toHaveBeenCalled();
  });

  it('handles focus, range, and basic lifecycle helpers', () => {
    const select = vi.fn();
    const preservedRange = { select };
    const focusTrigger = vi.spyOn($editable, 'trigger');

    editor.lastRange = preservedRange;
    editor.focus();
    expect(focusTrigger).toHaveBeenCalledWith('focus');
    expect(select).toHaveBeenCalled();

    expect(editor.createRange()).to.exist;

    editor.saveTarget('marker');
    expect(editor.restoreTarget()).to.equal('marker');
    editor.clearTarget();
    expect(editor.restoreTarget()).to.equal(undefined);

    editor.saveRange(true);
    editor.restoreRange();

    expect(editor.hasFocus()).to.equal(true);
    expect(editor.isEmpty()).to.equal(false);
    context.invoke('code', '<p><br></p>');
    expect(editor.isEmpty()).to.equal(true);
  });

  it('handles unlink, getLinkInfo, and anchor-aware selected text', () => {
    context.invoke('code', '<p><a href="https://example.com" target="_blank">hello</a> world</p>');
    const anchorText = $editable.find('a')[0].firstChild;
    const selection = range.create(anchorText, 0, anchorText, anchorText.textContent.length).select();
    editor.setLastRange(selection);

    expect(editor.getSelectedText()).to.equal('hello');
    expect(editor.getLinkInfo()).to.deep.include({
      text: 'hello',
      url: 'https://example.com',
      isNewWindow: true,
    });

    editor.unlink();
    expect($editable.find('a').length).to.equal(0);
  });

  it('handles image upload callbacks and upload errors', async() => {
    const upload = vi.fn();
    context.options.callbacks.onImageUpload = upload;
    const file = new File([new Uint8Array([1, 2, 3])], 'tiny.png', { type: 'image/png' });

    editor.insertImagesOrCallback([file]);
    expect(upload).toHaveBeenCalledOnce();

    const errorSpy = vi.fn();
    context.options.callbacks.onImageUploadError = errorSpy;
    context.options.maximumImageFileSize = 1;
    const largeFile = new File([new Uint8Array([1, 2, 3, 4])], 'large.png', { type: 'image/png' });

    editor.insertImagesAsDataURL([largeFile]);
    await nextTick();

    expect(errorSpy).toHaveBeenCalled();
    editor.insertImagesOrCallback([]);
  });

  it('delegates table commands only when a table range is available', () => {
    const cell = document.createElement('td');
    const rng = {
      isCollapsed: () => true,
      isOnCell: () => true,
    };

    vi.spyOn(editor, 'getLastRange').mockReturnValue(rng);
    expect(editor.getTableCommandRange()).to.equal(rng);

    const fallbackRange = {
      isCollapsed: () => false,
      isOnCell: () => false,
    };
    vi.spyOn(editor, 'getLastRange').mockReturnValue(fallbackRange);
    editor.saveTarget(cell);
    expect(editor.getTableCommandRange()).to.equal(null);

    vi.spyOn(editor, 'beforeCommand').mockImplementation(() => {});
    vi.spyOn(editor, 'afterCommand').mockImplementation(() => {});
    const addRow = vi.spyOn(editor.table, 'addRow').mockImplementation(() => {});
    const addCol = vi.spyOn(editor.table, 'addCol').mockImplementation(() => {});
    const deleteRow = vi.spyOn(editor.table, 'deleteRow').mockImplementation(() => {});
    const deleteCol = vi.spyOn(editor.table, 'deleteCol').mockImplementation(() => {});
    const deleteTable = vi.spyOn(editor.table, 'deleteTable').mockImplementation(() => {});
    vi.spyOn(editor, 'getTableCommandRange').mockReturnValue({
      isCollapsed: () => true,
      isOnCell: () => true,
    });

    editor.addRow('top');
    editor.addCol('left');
    editor.deleteRow();
    editor.deleteCol();
    editor.deleteTable();

    expect(addRow.mock.calls[0][1]).to.equal('top');
    expect(addCol.mock.calls[0][1]).to.equal('left');
    expect(deleteRow).toHaveBeenCalled();
    expect(deleteCol).toHaveBeenCalled();
    expect(deleteTable).toHaveBeenCalled();
  });

  it('covers tab handling, keyboard helpers, and no-selection font styling', async() => {
    const beforeCommand = vi.spyOn(editor, 'beforeCommand').mockImplementation(() => {});
    const afterCommand = vi.spyOn(editor, 'afterCommand').mockImplementation(() => {});
    const insertTab = vi.spyOn(editor.typing, 'insertTab').mockImplementation(() => {});
    const tableTab = vi.spyOn(editor.table, 'tab').mockImplementation(() => {});

    vi.spyOn(editor, 'getLastRange').mockReturnValue({
      isCollapsed: () => true,
      isOnCell: () => false,
    });
    editor.tab();
    expect(insertTab).toHaveBeenCalled();

    vi.spyOn(editor, 'getLastRange').mockReturnValue({
      isCollapsed: () => true,
      isOnCell: () => true,
    });
    editor.tab();
    editor.untab();
    expect(tableTab).toHaveBeenCalledTimes(2);

    const prevented = vi.fn();
    editor.preventDefaultEditableShortCuts({
      ctrlKey: true,
      metaKey: false,
      keyCode: key.code.B,
      preventDefault: prevented,
    });
    expect(prevented).toHaveBeenCalledOnce();

    const removed = vi.spyOn(editor, 'removed').mockImplementation(() => {});
    const eventPrevented = vi.fn();
    const invoke = vi.spyOn(context, 'invoke');
    editor.handleKeyMap({
      metaKey: false,
      ctrlKey: true,
      altKey: false,
      shiftKey: false,
      keyCode: key.code.B,
      preventDefault: eventPrevented,
    });
    expect(eventPrevented).toHaveBeenCalled();

    editor.handleKeyMap({
      metaKey: false,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      keyCode: key.code.DELETE,
      preventDefault: vi.fn(),
    });
    expect(removed).toHaveBeenCalled();
    expect(invoke.mock.calls.some(([namespace]) => namespace === 'removed')).to.equal(true);

    vi.spyOn(editor, 'getLastRange').mockReturnValue('');
    editor.fontStyling('font-size', '12px');
    expect(context.layoutInfo.editor.find('.note-status-output').text()).to.contain(context.options.langInfo.output.noSelection);

    await nextTick();
    expect(beforeCommand).toHaveBeenCalled();
    expect(afterCommand).toHaveBeenCalled();
  });

  it('handles editor DOM events and configuration branches during initialization', async() => {
    context.destroy();
    const onContextMenu = vi.fn();
    const onFocusIn = vi.fn();
    const onFocusOut = vi.fn();
    const onDisable = vi.fn();
    context = new Context($$('<div><p>hello</p></div>').appendTo('body'), $$.extend({}, $$.summernote.options, {
      airMode: true,
      overrideContextMenu: true,
      shortcuts: false,
      disableGrammar: true,
      width: 320,
      height: 160,
      maxHeight: 240,
      minHeight: 80,
      callbacks: {
        onContextmenu: onContextMenu,
        onFocusin: onFocusIn,
        onFocusout: onFocusOut,
        onDisable: onDisable,
      },
    }));
    editor = context.modules.editor;
    $editable = context.layoutInfo.editable;

    $editable.trigger('focusin');
    $editable.trigger('focusout');
    context.layoutInfo.editor.trigger('contextmenu');
    context.disable();
    context.enable();

    const keydownEvent = new Event('keydown', { bubbles: true });
    Object.defineProperty(keydownEvent, 'keyCode', { value: key.code.B });
    Object.defineProperty(keydownEvent, 'ctrlKey', { value: true });
    $editable[0].dispatchEvent(keydownEvent);
    $editable.trigger('keyup');
    $editable[0].dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    $editable.trigger('mousedown');
    $editable.trigger('mouseup');
    $editable.trigger('scroll');
    $editable.trigger('paste');
    $editable.trigger('copy');
    $editable.trigger('input');

    await nextTick();

    expect(onFocusIn).toHaveBeenCalled();
    expect(onFocusOut).toHaveBeenCalled();
    expect(onContextMenu).toHaveBeenCalled();
    expect(onDisable).toHaveBeenCalled();
    expect($editable.attr('spellcheck')).to.equal('true');

    context.destroy();
    context = new Context($$('<div><p>hello</p></div>').appendTo('body'), $$.extend({}, $$.summernote.options, {
      width: 320,
      height: 160,
      maxHeight: 240,
      minHeight: 80,
    }));
    editor = context.modules.editor;
    $editable = context.layoutInfo.editable;

    expect($editable[0].style.maxHeight).to.equal('240px');
    expect($editable[0].style.minHeight).to.equal('80px');
  });

  it('supports formatting helpers and resize calculations', () => {
    context.invoke('code', '<p class="lead">hello</p>');
    const paragraph = $editable.find('p');
    const textNode = paragraph[0].firstChild;
    editor.setLastRange(range.create(textNode, 0, textNode, textNode.textContent.length).select());

    vi.spyOn(editor, 'createRange').mockReturnValue({
      sc: paragraph[0],
      ec: paragraph[0],
    });
    editor.onFormatBlock('P', $$('<p class="callout"></p>'));
    expect($editable.find('p').attr('class')).to.equal('callout');

    editor.formatPara();
    expect($editable.find('p').length).to.equal(1);

    paragraph.data('ratio', 0.5);
    editor.resizeTo({ x: 200, y: 100 }, paragraph, true);
    expect(paragraph[0].style.width).to.equal('200px');

    editor.resizeTo({ x: 150, y: 80 }, paragraph, false);
    expect(paragraph[0].style.height).to.equal('80px');

    editor.empty();
    expect($editable.html()).to.equal('<p><br></p>');
    editor.normalizeContent();
  });

  it('covers command helpers, link limits, and direct styling fallbacks', async() => {
    const textNode = $editable.find('p')[0].firstChild;
    editor.setLastRange(range.create(textNode, 0, textNode, textNode.textContent.length).select());

    const fontStyling = vi.spyOn(editor, 'fontStyling').mockImplementation(() => {});
    const formatBlock = vi.spyOn(editor, 'formatBlock').mockImplementation(() => {});
    editor.fontSizeUnit('pt');
    editor.formatH1();
    expect(fontStyling).toHaveBeenCalledWith('font-size', expect.stringMatching(/pt$/));
    expect(formatBlock).toHaveBeenCalledWith('H1');

    fontStyling.mockRestore();
    formatBlock.mockRestore();

    editor.insertNode($$('<span>!</span>')[0]);
    await nextTick();
    expect($editable.html()).to.contain('<span>!</span>');

    context.destroy();
    context = new Context($$('<div><p>hello</p></div>').appendTo('body'), $$.extend({}, $$.summernote.options, {
      maxTextLength: 5,
      callbacks: {
        onApplyCustomStyle($target, ctx, callback) {
          callback('BLOCKQUOTE', $target);
        },
      },
    }));
    editor = context.modules.editor;
    $editable = context.layoutInfo.editable;

    const limitedTextNode = $editable.find('p')[0].firstChild;
    editor.setLastRange(range.create(limitedTextNode, 5, limitedTextNode, 5).select());
    editor.insertNode($$('<span>!</span>')[0]);
    editor.pasteHTML('<span>!</span>');
    editor.createLink({
      url: 'summernote.org',
      text: 'hello!',
      range: range.create(limitedTextNode, 0, limitedTextNode, limitedTextNode.textContent.length),
    });
    expect($editable.html()).to.equal('<p>hello</p>');

    const customStyle = $$('<blockquote class="callout"></blockquote>');
    const onFormatBlock = vi.spyOn(editor, 'onFormatBlock').mockImplementation(() => {});
    editor.formatBlock('blockquote', customStyle);
    expect(onFormatBlock).toHaveBeenCalledWith('BLOCKQUOTE', customStyle);

    const execCommand = vi.spyOn(document, 'execCommand');
    editor.color({ foreColor: '#123456' });
    editor.color({ backColor: '#654321' });
    expect(execCommand).toHaveBeenCalledWith('foreColor', false, '#123456');
    expect(execCommand).toHaveBeenCalledWith('backColor', false, '#654321');

    vi.spyOn(editor, 'getLastRange').mockReturnValue(null);
    expect(editor.currentStyle()).to.deep.equal(editor.style.fromNode($editable));
    expect(editor.styleFromNode($editable[0])).to.deep.equal(editor.style.fromNode($editable[0]));
  });

  it('covers media insertion helpers and upload fallbacks', async() => {
    const source =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAF0lEQVQYGWP8////fwYsgAmLGFiIHhIAT+oECGHuN2UAAAAASUVORK5CYII=';

    const imageCallback = vi.fn();
    await editor.insertImage(source, imageCallback);
    expect(imageCallback).toHaveBeenCalledOnce();

    context.invoke('code', '<p><br></p>');
    vi.spyOn(editor.$editable, 'width').mockReturnValue(2);
    await editor.insertImage(source, 'tiny.png');
    const insertedImage = $editable.find('img').last();
    expect(insertedImage.attr('data-filename')).to.equal('tiny.png');
    expect(insertedImage[0].style.width).to.equal('2px');

    const uploadError = vi.spyOn(context, 'triggerEvent');
    await editor.insertImage('data:text/plain,broken', 'broken.png');
    expect(uploadError).toHaveBeenCalledWith('image.upload.error', expect.anything());

    const insertImage = vi.spyOn(editor, 'insertImage').mockResolvedValue();
    const file = new File([new Uint8Array([1, 2, 3])], 'tiny.png', { type: 'image/png' });
    const originalFileReader = globalThis.FileReader;
    globalThis.FileReader = class {
      readAsDataURL() {
        this.onload({
          target: {
            result: source,
          },
        });
      }
    };
    editor.insertImagesAsDataURL([file]);
    await nextTick();
    expect(insertImage).toHaveBeenCalledWith(source, 'tiny.png');

    globalThis.FileReader = class {
      readAsDataURL() {
        this.onerror(new Error('bad-file'));
      }
    };
    editor.insertImagesAsDataURL([file]);
    await nextTick();
    expect(uploadError.mock.calls.some(([namespace]) => namespace === 'image.upload.error')).to.equal(true);
    globalThis.FileReader = originalFileReader;

    delete context.options.callbacks.onImageUpload;
    const insertImagesAsDataURL = vi.spyOn(editor, 'insertImagesAsDataURL').mockImplementation(() => {});
    editor.insertImagesOrCallback([file]);
    expect(insertImagesAsDataURL).toHaveBeenCalledWith([file]);
  });

  it('covers target-based table ranges, commits, and keyboard edge cases', () => {
    context.invoke('code', '<table><tbody><tr><td><span id="cell-child">x</span></td></tr></tbody></table>');
    const span = $editable.find('#cell-child')[0];

    const getLastRange = vi.spyOn(editor, 'getLastRange').mockReturnValue({
      isCollapsed: () => false,
      isOnCell: () => false,
    });
    editor.saveTarget(span);
    const tableRange = editor.getTableCommandRange();
    expect(tableRange).to.exist;
    expect(editor.lastRange).to.equal(tableRange);
    getLastRange.mockRestore();

    const triggerEvent = vi.spyOn(context, 'triggerEvent');
    const commit = vi.spyOn(editor.history, 'commit').mockImplementation(() => {});
    editor.commit();
    expect(commit).toHaveBeenCalledOnce();
    expect(triggerEvent.mock.calls.some(([namespace]) => namespace === 'change')).to.equal(true);

    const afterCommand = vi.spyOn(editor, 'afterCommand').mockImplementation(() => {});
    const preventDefault = vi.fn();
    editor.handleKeyMap({
      metaKey: true,
      ctrlKey: false,
      altKey: false,
      shiftKey: true,
      keyCode: key.code.TAB,
      preventDefault,
    });
    expect(afterCommand).toHaveBeenCalled();
    expect(preventDefault).not.toHaveBeenCalled();

    expect(editor.handleKeyMap({
      metaKey: false,
      ctrlKey: true,
      altKey: true,
      shiftKey: false,
      keyCode: 0,
      preventDefault: vi.fn(),
    })).to.equal(false);

    context.options.tabSize = 0;
    vi.spyOn(editor, 'getLastRange').mockReturnValue({
      isCollapsed: () => true,
      isOnCell: () => false,
    });
    expect(editor.tab()).to.equal(false);
    expect(editor.untab()).to.equal(false);

    expect(editor.isLimited(1, { keyCode: key.code.LEFT, ctrlKey: false, metaKey: false })).to.equal(false);
    expect(editor.isLimited(1, { keyCode: key.code.HOME, ctrlKey: false, metaKey: false })).to.equal(false);
    expect(editor.isLimited(1, { keyCode: key.code.DELETE, ctrlKey: false, metaKey: false })).to.equal(false);
    expect(editor.isLimited(1, { keyCode: key.code.B, ctrlKey: true, metaKey: false })).to.equal(false);
  });

  it('covers removed nodes, playMedia fallbacks, and bogus font styling spans', () => {
    const paragraph = $$('<p><br></p>')[0];
    const cell = $$('<td><br></td>')[0];
    vi.spyOn(range, 'create')
      .mockReturnValueOnce({
        isCollapsed: () => true,
        isOnCell: () => true,
        ec: paragraph,
      })
      .mockReturnValueOnce({
        isCollapsed: () => true,
        isOnCell: () => true,
        ec: cell,
      });

    editor.removed();
    editor.removed();
    expect(paragraph.isConnected).to.equal(false);
    expect(cell.innerHTML).to.equal('');

    const bogusSpan = document.createElement('span');
    const select = vi.fn();
    vi.spyOn(editor, 'getLastRange').mockReturnValue({
      isCollapsed: () => true,
      select,
    });
    vi.spyOn(editor.style, 'styleNodes').mockReturnValue([bogusSpan]);
    vi.spyOn(range, 'createFromNode').mockReturnValue({ select });
    const setLastRange = vi.spyOn(editor, 'setLastRange').mockImplementation(() => {});
    editor.fontStyling('font-size', '12px');
    expect(bogusSpan.innerHTML).not.to.equal('');
    expect(setLastRange).toHaveBeenCalled();
    editor.getLastRange.mockRestore();

    context.invoke('code', [
      '<p>',
      '<img id="plain-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==">',
      '<iframe id="plain-frame" class="note-video-clip"></iframe>',
      '<iframe id="https-frame" class="note-video-clip" src="https://www.youtube.com/embed/jNQXAC9IVRw"></iframe>',
      '<video id="silent-video" class="note-video-clip"></video>',
      '</p>',
    ].join(''));

    const image = $editable.find('#plain-image')[0];
    vi.spyOn(range, 'createFromSelection').mockReturnValue({ select: vi.fn() });
    vi.spyOn(editor, 'afterCommand').mockImplementation(() => {});
    editor.saveTarget(image);
    editor.removeMedia();
    expect($editable.find('#plain-image').length).to.equal(0);

    const plainFrame = $editable.find('#plain-frame')[0];
    editor.saveTarget(plainFrame);
    editor.playMedia();
    expect(plainFrame.getAttribute('src')).to.equal(null);

    const httpsFrame = $editable.find('#https-frame')[0];
    editor.saveTarget(httpsFrame);
    editor.playMedia();
    expect(httpsFrame.getAttribute('src')).to.contain('autoplay=1');

    const silentVideo = $editable.find('#silent-video')[0];
    Object.defineProperty(silentVideo, 'play', {
      value: undefined,
      configurable: true,
    });
    editor.saveTarget(silentVideo);
    expect(() => editor.playMedia()).not.to.throw();
  });

  it('covers focus restoration, no-selection cleanup, and initialization events', async() => {
    vi.useFakeTimers();

    editor.lastRange = null;
    expect(editor.getLastRange()).to.exist;

    const hasFocus = vi.spyOn(editor, 'hasFocus')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false);
    const focusTrigger = vi.spyOn($editable, 'trigger');
    editor.focus();
    expect(hasFocus).toHaveBeenCalled();
    expect(focusTrigger).toHaveBeenCalledWith('focus');

    vi.spyOn(editor, 'getLastRange').mockReturnValue('');
    editor.fontStyling('font-size', '11px');
    expect(context.layoutInfo.editor.find('.note-status-output').text()).to.contain(context.options.langInfo.output.noSelection);
    vi.advanceTimersByTime(5000);
    expect(context.layoutInfo.editor.find('.note-status-output').text()).to.equal('');
    vi.useRealTimers();

    context.destroy();
    context = new Context($$('<div></div>').appendTo('body'), $$.extend({}, $$.summernote.options, {
      recordEveryKeystroke: true,
    }));
    editor = context.modules.editor;
    $editable = context.layoutInfo.editable;

    const triggerEvent = vi.spyOn(context, 'triggerEvent');
    vi.spyOn(editor, 'handleKeyMap').mockReturnValue(false);
    const isLimited = vi.spyOn(editor, 'isLimited').mockReturnValue(false);
    const recordUndo = vi.spyOn(editor.history, 'recordUndo').mockImplementation(() => {});
    editor.snapshot = { contents: 'before' };
    const applySnapshot = vi.spyOn(editor.history, 'applySnapshot').mockImplementation(() => {});
    context.modules.autoLink.handleKeydown = vi.fn();

    const keydownEvent = new KeyboardEvent('keydown', { bubbles: true, keyCode: key.code.ENTER });
    Object.defineProperty(keydownEvent, 'keyCode', { value: key.code.ENTER });
    $editable[0].dispatchEvent(keydownEvent);
    isLimited.mockImplementation((pad) => pad === 0);
    $editable.trigger('input');
    await nextTick();

    expect(triggerEvent.mock.calls.some(([namespace]) => namespace === 'enter')).to.equal(true);
    expect(recordUndo).toHaveBeenCalled();
    expect(applySnapshot).toHaveBeenCalled();
  });

  it('covers MSIE format blocks, focus-driven link info, and ratio resizing', () => {
    context.invoke('code', '<h2>hello</h2>');
    const heading = $editable.find('h2');
    const originalIsMSIE = env.isMSIE;
    env.isMSIE = true;

    vi.spyOn(editor, 'createRange').mockReturnValue({
      sc: heading[0],
      ec: heading[0],
    });
    editor.onFormatBlock('H2', $$('<div><h2></h2></div>'));
    expect(heading.attr('class') || '').to.equal('');

    const focus = vi.spyOn(editor, 'focus').mockImplementation(() => {});
    vi.spyOn(editor, 'hasFocus').mockReturnValue(false);
    editor.setLastRange(range.createFromNode(heading[0]).select());
    expect(editor.getLinkInfo()).to.deep.include({ text: 'hello', url: '' });
    expect(focus).toHaveBeenCalled();

    heading.data('ratio', 2);
    editor.resizeTo({ x: 100, y: 300 }, heading, true);
    expect(heading[0].style.height).to.equal('300px');

    env.isMSIE = originalIsMSIE;
  });

  it('covers command fallbacks and null table command guards', async() => {
    const setLastRange = vi.spyOn(editor, 'setLastRange');
    vi.spyOn(editor, 'beforeCommand').mockImplementation(() => {});
    vi.spyOn(editor, 'afterCommand').mockImplementation(() => {});
    vi.spyOn(editor, 'getLastRange').mockReturnValue({
      insertNode: () => document.createElement('hr'),
    });
    editor.insertHorizontalRule();
    expect(setLastRange).not.toHaveBeenCalled();
    editor.getLastRange.mockRestore();

    context.invoke('code', '<p>hello</p>');
    const textNode = $editable.find('p')[0].firstChild;
    editor.setLastRange(range.create(textNode, 0, textNode, textNode.textContent.length).select());
    context.options.onCreateLink = () => 'custom://object';
    editor.createLink({
      url: { href: 'summernote.org' },
      text: 'hello',
    });
    await expectContents('<p><a href="custom://object">hello</a></p>');

    context.invoke('code', '<p><img id="plain-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="></p>');
    const image = $editable.find('#plain-image')[0];
    editor.saveTarget(image);
    editor.floatMe('none');
    editor.playMedia();
    expect(image.style.float).to.equal('');
    expect(image.classList.contains('note-video-interactive')).to.equal(true);

    editor.lastRange = null;
    expect(() => editor.restoreRange()).not.to.throw();

    const execCommand = vi.spyOn(document, 'execCommand');
    vi.spyOn(editor, 'getLastRange').mockReturnValue({
      isOnAnchor: () => false,
    });
    editor.unlink();
    expect(execCommand).not.toHaveBeenCalledWith('unlink');
    editor.getLastRange.mockRestore();

    const addRow = vi.spyOn(editor.table, 'addRow').mockImplementation(() => {});
    const addCol = vi.spyOn(editor.table, 'addCol').mockImplementation(() => {});
    const deleteRow = vi.spyOn(editor.table, 'deleteRow').mockImplementation(() => {});
    const deleteCol = vi.spyOn(editor.table, 'deleteCol').mockImplementation(() => {});
    const deleteTable = vi.spyOn(editor.table, 'deleteTable').mockImplementation(() => {});
    vi.spyOn(editor, 'getTableCommandRange').mockReturnValue(null);

    editor.addRow('top');
    editor.addCol('left');
    editor.deleteRow();
    editor.deleteCol();
    editor.deleteTable();

    expect(addRow).not.toHaveBeenCalled();
    expect(addCol).not.toHaveBeenCalled();
    expect(deleteRow).not.toHaveBeenCalled();
    expect(deleteCol).not.toHaveBeenCalled();
    expect(deleteTable).not.toHaveBeenCalled();
  });

  it('covers keyboard guard branches and limited keydown handling', async() => {
    context.destroy();
    context = new Context($$('<div><p>hello</p></div>').appendTo('body'), $$.extend({}, $$.summernote.options, {
      maxTextLength: 10,
      recordEveryKeystroke: true,
    }));
    editor = context.modules.editor;
    $editable = context.layoutInfo.editable;

    const recordUndo = vi.spyOn(editor.history, 'recordUndo').mockImplementation(() => {});
    context.modules.autoLink.handleKeydown = vi.fn();
    const handleKeyMap = vi.spyOn(editor, 'handleKeyMap').mockReturnValue(true);
    const shortcutEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true });
    Object.defineProperty(shortcutEvent, 'keyCode', { value: key.code.B });
    $editable[0].dispatchEvent(shortcutEvent);
    expect(recordUndo).not.toHaveBeenCalled();
    handleKeyMap.mockRestore();

    const preventedEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true });
    Object.defineProperty(preventedEvent, 'keyCode', { value: key.code.B });
    preventedEvent.preventDefault();
    $editable[0].dispatchEvent(preventedEvent);

    context.options.maxTextLength = 5;
    recordUndo.mockClear();
    const textNode = $editable.find('p')[0].firstChild;
    editor.setLastRange(range.create(textNode, textNode.textContent.length, textNode, textNode.textContent.length).select());
    const limitedEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true });
    Object.defineProperty(limitedEvent, 'keyCode', { value: key.code.B });
    $editable[0].dispatchEvent(limitedEvent);
    expect(recordUndo).not.toHaveBeenCalled();

    editor.setLastRange(range.create(textNode, 0, textNode, textNode.textContent.length).select());
    const selectedTextEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true });
    Object.defineProperty(selectedTextEvent, 'keyCode', { value: key.code.B });
    $editable[0].dispatchEvent(selectedTextEvent);

    const originalIsMac = env.isMac;
    env.isMac = true;
    const invoke = vi.spyOn(context, 'invoke').mockImplementation((namespace) => {
      return namespace === 'bold' ? false : undefined;
    });
    const shortcutPrevent = vi.fn();
    expect(editor.handleKeyMap({
      metaKey: true,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      keyCode: key.code.B,
      preventDefault: shortcutPrevent,
    })).to.equal(false);
    expect(shortcutPrevent).not.toHaveBeenCalled();
    invoke.mockRestore();
    env.isMac = originalIsMac;

    const removed = vi.spyOn(editor, 'removed').mockImplementation(() => {});
    const afterCommand = vi.spyOn(editor, 'afterCommand').mockImplementation(() => {});
    editor.handleKeyMap({
      metaKey: false,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      keyCode: key.code.SPACE,
      preventDefault: vi.fn(),
    });
    expect(afterCommand).toHaveBeenCalled();
    expect(removed).not.toHaveBeenCalled();

    const prevented = vi.fn();
    editor.preventDefaultEditableShortCuts({
      ctrlKey: false,
      metaKey: true,
      keyCode: key.code.I,
      preventDefault: prevented,
    });
    expect(prevented).toHaveBeenCalledOnce();

    context.options.maxTextLength = 10;
    expect(editor.isLimited(0, {
      keyCode: key.code.B,
      ctrlKey: false,
      metaKey: false,
    })).to.equal(false);

    context.options.tabSize = 2;
    vi.spyOn(editor, 'getLastRange').mockReturnValue({
      isCollapsed: () => true,
      isOnCell: () => false,
    });
    const insertTab = vi.spyOn(editor.typing, 'insertTab').mockImplementation(() => {});
    vi.spyOn(editor, 'isLimited').mockReturnValue(true);
    editor.tab();
    expect(insertTab).not.toHaveBeenCalled();
    expect(editor.untab()).to.equal(undefined);
  });

  it('covers image sizing, styling, and focus fallbacks', async() => {
    const source =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAF0lEQVQYGWP8////fwYsgAmLGFiIHhIAT+oECGHuN2UAAAAASUVORK5CYII=';
    const naturalWidthDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'naturalWidth');
    const widthDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'width');

    Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', {
      configurable: true,
      get() {
        return 0;
      },
    });
    Object.defineProperty(HTMLImageElement.prototype, 'width', {
      configurable: true,
      get() {
        return 5;
      },
    });

    vi.spyOn(editor.$editable, 'width').mockReturnValue(2);
    await editor.insertImage(source, 'wide.png');
    expect($editable.find('img').last()[0].style.width).to.equal('2px');

    Object.defineProperty(HTMLImageElement.prototype, 'width', {
      configurable: true,
      get() {
        return 0;
      },
    });
    await editor.insertImage(source, 'zero.png');
    expect($editable.find('img').last()[0].style.width).to.equal('');

    if (naturalWidthDescriptor) {
      Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', naturalWidthDescriptor);
    }
    if (widthDescriptor) {
      Object.defineProperty(HTMLImageElement.prototype, 'width', widthDescriptor);
    }

    expect(() => editor.insertImagesOrCallback()).not.to.throw();

    const filledSpan = document.createElement('span');
    filledSpan.textContent = 'filled';
    vi.spyOn(editor, 'getLastRange').mockReturnValue({
      isCollapsed: () => true,
      select: vi.fn(),
    });
    vi.spyOn(editor.style, 'styleNodes').mockReturnValue([filledSpan]);
    const setLastRange = vi.spyOn(editor, 'setLastRange').mockImplementation(() => {});
    editor.fontStyling('font-size', '13px');
    expect(setLastRange).not.toHaveBeenCalled();
    editor.getLastRange.mockRestore();

    vi.spyOn(editor, 'createRange').mockReturnValue({
      sc: $editable[0],
      ec: $editable[0],
    });
    expect(() => editor.onFormatBlock('P', $$('<div></div>'))).not.to.throw();

    const $target = $$('<p></p>');
    $target.data('ratio', 4);
    editor.resizeTo({ x: 100, y: 200 }, $target, true);
    expect($target[0].style.width).to.equal('100px');
    expect($target[0].style.height).to.equal('400px');

    editor.lastRange = null;
    const hasFocus = vi.spyOn(editor, 'hasFocus').mockReturnValue(false);
    const focusTrigger = vi.spyOn($editable, 'trigger');
    editor.focus();
    expect(hasFocus).toHaveBeenCalled();
    expect(focusTrigger).toHaveBeenCalledWith('focus');
  });

  it('covers remaining helper branches for removal, images, and plain selections', async() => {
    const div = $$('<div><br></div>')[0];
    const textNode = document.createTextNode('x');
    vi.spyOn(range, 'create')
      .mockReturnValueOnce({
        isCollapsed: () => true,
        isOnCell: () => true,
        ec: div,
      })
      .mockReturnValueOnce({
        isCollapsed: () => true,
        isOnCell: () => true,
        ec: textNode,
      })
      .mockReturnValueOnce({
        isCollapsed: () => false,
        isOnCell: () => false,
      });

    expect(() => editor.removed()).not.to.throw();
    expect(() => editor.removed()).not.to.throw();
    expect(() => editor.removed()).not.to.throw();

    const source =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAF0lEQVQYGWP8////fwYsgAmLGFiIHhIAT+oECGHuN2UAAAAASUVORK5CYII=';
    await editor.insertImage(source, {});
    expect($editable.find('img').last().attr('data-filename')).to.equal(null);

    const paragraphText = $editable.find('p').first()[0].firstChild;
    editor.setLastRange(range.create(paragraphText, 0, paragraphText, paragraphText.textContent.length).select());
    expect(editor.getSelectedText()).to.equal(paragraphText.textContent);

    editor.saveRange();
    const prevented = vi.fn();
    editor.preventDefaultEditableShortCuts({
      ctrlKey: true,
      metaKey: false,
      keyCode: key.code.K,
      preventDefault: prevented,
    });
    expect(prevented).not.toHaveBeenCalled();

    const triggerEvent = vi.spyOn(context, 'triggerEvent');
    editor.afterCommand(true);
    expect(triggerEvent.mock.calls.some(([namespace]) => namespace === 'change')).to.equal(false);
  });

  it('skips the air-mode context menu override when disabled', () => {
    context.destroy();
    const onContextMenu = vi.fn();
    context = new Context($$('<div><p>hello</p></div>').appendTo('body'), $$.extend({}, $$.summernote.options, {
      airMode: true,
      overrideContextMenu: false,
      callbacks: {
        onContextmenu: onContextMenu,
      },
    }));
    editor = context.modules.editor;
    $editable = context.layoutInfo.editable;

    context.layoutInfo.editor.trigger('contextmenu');
    expect(onContextMenu).not.toHaveBeenCalled();
  });
});
