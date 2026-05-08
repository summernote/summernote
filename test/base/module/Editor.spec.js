import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from '/test/util';
import $$ from '@/js/core/dom-query.js';
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
    await expectContents('<p><br></p><p>hello</p>');

    editor.insertHorizontalRule();
    await expectContents('<p><br></p><hr><p>hello</p>');
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
});
