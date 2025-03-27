/**
 * Editor.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */

import { describe, it, expect, vi } from 'vitest';
import { nextTick } from '/test/util';
import $ from 'jquery';
import env from '@/js/core/env';
import range from '@/js/core/range';
import Context from '@/js/Context';
import '@/styles/lite/summernote-lite';

describe('Editor', () => {
  var editor, context, $editable;

  function expectContents(context, markup) {
    expect(context.layoutInfo.editable.html()).toEqual(markup);
  }

  async function expectContentsAwait(context, markup) {
    await nextTick();
    expect(context.layoutInfo.editable.html()).toEqual(markup);
  }

  function expectToHaveBeenCalled(context, customEvent, handler) {
    const $note = context.layoutInfo.note;
    const spy = vi.fn();
    $note.on(customEvent, spy);
    handler();
    expect(spy).toHaveBeenCalled();
  }

  beforeEach(function() {
    $('body').empty(); // important !
    var options = $.extend({}, $.summernote.options);
    options.historyLimit = 5;
    context = new Context($('<div><p>hello</p></div>'), options);

    editor = context.modules.editor;
    $editable = context.layoutInfo.editable;

    // [workaround]
    //  - IE8-11 can't create range in headless mode
    if (env.isMSIE) {
      this.skip();
    }
  });

  describe('initialize', () => {
    it('should bind custom events', () => {
      ['keydown', 'keyup', 'blur', 'mousedown', 'mouseup', 'scroll', 'focusin', 'focusout'].forEach((eventName) => {
        expectToHaveBeenCalled(context, 'summernote.' + eventName, () => {
          $editable.trigger(eventName);
        });
      });

      expectToHaveBeenCalled(context, 'summernote.change', () => {
        editor.insertText('hello');
      });
    });
  });

  describe('undo and redo', () => {
    it('should control history', async() => {
      editor.insertText(' world');
      await expectContentsAwait(context, '<p>hello world</p>');
      editor.undo();
      await expectContentsAwait(context, '<p>hello</p>');
      editor.redo();
      await expectContentsAwait(context, '<p>hello world</p>');
    });

    it('should be limited by option.historyLimit value', async() => {
      editor.insertText(' world');
      editor.insertText(' world');
      editor.insertText(' world');
      editor.insertText(' world');
      editor.insertText(' world');
      await expectContentsAwait(context, '<p>hello world world world world world</p>');
      editor.undo();
      editor.undo();
      editor.undo();
      await expectContentsAwait(context, '<p>hello world world</p>');
      editor.undo();
      editor.undo();
      editor.undo();
      await expectContentsAwait(context, '<p>hello world</p>');
    });
  });

  describe('tab', () => {
    it('should insert tab', async() => {
      editor.tab();
      await expectContentsAwait(context, '<p>hello&nbsp;&nbsp;&nbsp;&nbsp;</p>');
    });
  });

  describe('insertParagraph', () => {
    it('should insert paragraph', async() => {
      editor.insertParagraph();
      await expectContentsAwait(context, '<p>hello</p><p><br></p>');
      editor.insertParagraph();
      await expectContentsAwait(context, '<p>hello</p><p><br></p><p><br></p>');
    });
  });

  describe('insertImage', () => {
    it('should insert image', () => {
      var source =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAF0lEQVQYGWP8////fwYsgAmLGFiIHhIAT+oECGHuN2UAAAAASUVORK5CYII=';
      return editor.insertImage(source, 'image').then(() => {
        expect($editable.find('img').attr('src')).toEqual(source);
      });
    });
  });

  describe('insertOrderedList and insertUnorderedList', () => {
    it('should toggle paragraph to list', async() => {
      editor.insertOrderedList();
      await expectContentsAwait(context, '<ol><li>hello</li></ol>');
      editor.insertUnorderedList();
      await expectContentsAwait(context, '<ul><li>hello</li></ul>');
      editor.insertUnorderedList();
      await expectContentsAwait(context, '<p>hello</p>');
    });
  });

  describe('indent and outdent', () => {
    // [workaround] style is different by browser
    it('should indent and outdent paragraph', async() => {
      editor.indent();
      await expectContentsAwait(context, '<p style="margin-left: 25px;">hello</p>');
      editor.outdent();
      await nextTick();
      expect($editable.find('p').css('margin-left')).to.be.empty;
    });

    it('should indent and outdent list', async() => {
      editor.insertOrderedList();
      await expectContentsAwait(context, '<ol><li>hello</li></ol>');
      editor.indent();
      await expectContentsAwait(context, '<ol><li><ol><li>hello</li></ol></li></ol>');
      editor.indent();
      await expectContentsAwait(context, '<ol><li><ol><li><ol><li>hello</li></ol></li></ol></li></ol>');
      editor.outdent();
      await expectContentsAwait(context, '<ol><li><ol><li>hello</li></ol></li></ol>');
      editor.outdent();
      await expectContentsAwait(context, '<ol><li>hello</li></ol>');
    });
  });

  describe('setLastRange', () => {
    it('should set last range', async() => {
      document.body.click();
      editor.setLastRange();

      await nextTick();
      expect(editor.lastRange.sc).to.equal(editor.editable.lastChild);
    });

    it('should set last range without content', async() => {
      context.layoutInfo.editable.html('');
      document.body.click();
      editor.setLastRange();

      await nextTick();
      expect(editor.lastRange.sc).to.equal(editor.editable);
    });
  });

  describe('insertNode', () => {
    it('should insert node', async() => {
      editor.insertNode($('<span> world</span>')[0]);
      await expectContentsAwait(context, '<p>hello<span> world</span></p>');
    });

    it('should be limited', async() => {
      var options = $.extend({}, $.summernote.options);
      options.maxTextLength = 5;
      context = new Context($('<div><p>hello</p></div>'), options);
      editor = context.modules.editor;

      editor.insertNode($('<span> world</span>')[0]);
      await expectContentsAwait(context, '<p>hello</p>');
    });

    it('should insert node in last focus', async() => {
      $editable.appendTo('body');
      context.invoke('editor.focus');

      await nextTick();
      var textNode = $editable.find('p')[0].firstChild;
      editor.setLastRange(range.create(textNode, 0, textNode, 0).select());

      await nextTick();
      editor.insertNode($('<span> world</span>')[0]);

      await nextTick();
      $('body').trigger('focus');
      editor.insertNode($('<span> hello</span>')[0]);

      await expectContentsAwait(context, '<p><span> world</span><span> hello</span>hello</p>');
    });
  });

  describe('insertText', () => {
    it('should insert text', async() => {
      editor.insertText(' world');
      await expectContentsAwait(context, '<p>hello world</p>');
    });

    it('should be limited', async() => {
      var options = $.extend({}, $.summernote.options);
      options.maxTextLength = 5;
      context = new Context($('<div><p>hello</p></div>'), options);
      editor = context.modules.editor;

      editor.insertText(' world');
      await expectContentsAwait(context, '<p>hello</p>');
    });

    it('should insert text in last focus', async() => {
      $editable.appendTo('body');
      context.invoke('editor.focus');

      var textNode = $editable.find('p')[0].firstChild;
      editor.setLastRange(range.create(textNode, 0, textNode, 0).select());

      await nextTick();
      editor.insertText(' world');
      await nextTick();
      $('body').trigger('focus');
      await nextTick();
      editor.insertText(' summernote');

      await expectContentsAwait(context, '<p> world summernotehello</p>');
    });
  });

  describe('pasteHTML', () => {
    it('should paste html', async() => {
      editor.pasteHTML('<span> world</span>');
      await expectContentsAwait(context, '<p>hello<span> world</span></p>');
    });

    it('should not add empty paragraph when pasting paragraphs', async() => {
      editor.pasteHTML('<p><span>whatever</span><br></p><p><span>it has</span><br></p>');
      await expectContentsAwait(context, '<p>hello</p><p><span>whatever</span><br></p><p><span>it has</span><br></p>');
    });

    it('should not add empty paragraph when pasting a node that is not isInline', async() => {
      editor.pasteHTML(
        '<ul><li>list</li></ul><hr><p>paragraph</p><table><tr><td>table</td></tr></table><p></p><blockquote>blockquote</blockquote><data>data</data>',
      );
      await expectContentsAwait(
        context,
        '<p>hello</p><ul><li>list</li></ul><hr><p>paragraph</p><table><tbody><tr><td>table</td></tr></tbody></table><p></p><blockquote>blockquote</blockquote><data>data</data>',
      );
    });

    it('should not call change event more than once per paste event', () => {
      var generateLargeHtml = () => {
        var html = '<div>';
        for (var i = 0; i < 1000; i++) {
          html += '<p>HTML element #' + i + '</p>';
        }
        html += '</div>';
        return html;
      };
      var $note = context.layoutInfo.note;
      var spy = vi.fn();
      $note.on('summernote.change', spy);
      var html = generateLargeHtml();
      editor.pasteHTML(html);
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should be limited', async() => {
      var options = $.extend({}, $.summernote.options);
      options.maxTextLength = 5;
      context = new Context($('<div><p>hello</p></div>'), options);
      editor = context.modules.editor;

      editor.pasteHTML('<span> world</span>');
      await expectContentsAwait(context, '<p>hello</p>');
    });
  });

  describe('insertHorizontalRule', () => {
    it('should insert horizontal rule', async() => {
      editor.insertHorizontalRule();
      await expectContentsAwait(context, '<p>hello</p><hr><p><br></p>');
    });
  });

  describe('insertTable', () => {
    it('should insert table', async() => {
      var markup = [
        '<p>hello</p>',
        '<table class="table table-bordered"><tbody>',
        '<tr><td><br></td><td><br></td></tr>',
        '<tr><td><br></td><td><br></td></tr>',
        '</tbody></table>',
        '<p><br></p>',
      ].join('');
      editor.insertTable('2x2');
      await expectContentsAwait(context, markup);
    });
  });

  describe('empty', () => {
    it('should make contents empty', async() => {
      editor.empty();
      await nextTick();
      expect(editor.isEmpty()).to.be.true;
    });
  });

  describe('styleWithCSS', () => {
    it('should style with tag when it is false (default)', async() => {
      $editable.appendTo('body');
      range.createFromNode($editable.find('p')[0]).normalize().select();
      editor.bold();
      await expectContentsAwait(context, '<p><b>hello</b></p>');
    });

    it('should style with CSS when it is true', async() => {
      var options = $.extend({}, $.summernote.options);
      options.styleWithCSS = true;

      $('body').empty();
      context = new Context($('<div><p>hello</p></div>').appendTo('body'), options);
      editor = context.modules.editor;
      $editable = context.layoutInfo.editable;
      $editable.appendTo('body');

      range.createFromNode($editable.find('p')[0]).normalize().select();
      editor.bold();
      await expectContentsAwait(context, '<p><span style="font-weight: bold;">hello</span></p>');
    });
  });

  describe('formatBlock', () => {
    it('should apply formatBlock', async() => {
      $editable.appendTo('body');

      var textNode = $editable.find('p')[0].firstChild;
      editor.setLastRange(range.create(textNode, 0, textNode, 0).select());

      await nextTick();
      editor.formatBlock('h1');
      await expectContentsAwait(context, '<h1>hello</h1>');
    });

    it('should toggle all paragraph even with empty paragraph', async() => {
      var codes = ['<p><br></p>', '<p>endpoint</p>'];

      context.invoke('code', codes.join(''));
      $editable.appendTo('body');

      var startNode = $editable.find('p').first()[0];
      var endNode = $editable.find('p').last()[0];

      // all p tags is wrapped
      range.create(startNode, 0, endNode, 1).normalize().select();

      editor.insertUnorderedList();
      await expectContentsAwait(context, '<ul><li><br></li><li>endpoint</li></ul>');
    });

    it('should apply multi formatBlock', async() => {
      var codes = [
        '<p><a href="http://summernote.org">hello world</a></p>',
        '<p><a href="http://summernote.org">hello world</a></p>',
        '<p><a href="http://summernote.org">hello world</a></p>',
      ];

      context.invoke('code', codes.join(''));
      $editable.appendTo('body');

      var startNode = $editable.find('p').first()[0];
      var endNode = $editable.find('p').last()[0];

      // all p tags is wrapped
      range.create(startNode, 0, endNode, 1).normalize().select();

      editor.formatBlock('h3');

      var nodeName = $editable.children()[0].nodeName;
      expect(nodeName).equalsIgnoreCase('h3');

      // p -> h3, p is none
      await nextTick();
      expect($editable.find('p').length).to.equals(0);
    });

    it('should apply custom className in formatBlock', async() => {
      var $target = $('<h4 class="customH4Class"></h4>');
      $editable.appendTo('body');
      range.createFromNode($editable.find('p')[0]).normalize().select();
      editor.formatBlock('h4', $target);

      // start <p>hello</p> => <h4 class="h4">hello</h4>
      await expectContentsAwait(context, '<h4 class="customH4Class">hello</h4>');
    });

    it('should find exact target in formatBlock', async() => {
      var $target = $(
        '<a class="dropdown-item" href="#" data-value="h6" role="listitem" aria-label="h6"><h6 class="customH6Class">H6</h6></a>',
      );
      $editable.appendTo('body');
      range.createFromNode($editable.find('p')[0]).normalize().select();
      editor.formatBlock('h6', $target);

      // start <p>hello</p> => <h6 class="h6">hello</h6>
      await expectContentsAwait(context, '<h6 class="customH6Class">hello</h6>');
    });

    it('should replace existing class in formatBlock if target has class', async() => {
      const $target1 = $('<p class="old"></p>');
      $editable.appendTo('body');
      range.createFromNode($editable.find('p')[0]).normalize().select();
      editor.formatBlock('p', $target1);
      const $target2 = $('<p class="new"></p>');
      editor.formatBlock('p', $target2);

      // start <p class="old">hello</p> => <p class="new">hello</p>
      await expectContentsAwait(context, '<p class="new">hello</p>');
    });

    it('should remove existing class in formatBlock if target has no class', async() => {
      const $target1 = $('<p class="customClass" />');
      $editable.appendTo('body');
      range.createFromNode($editable.find('p')[0]).normalize().select();
      editor.formatBlock('p', $target1);
      const $target2 = $('<p />');
      editor.formatBlock('p', $target2);

      // start <p class="customClass">hello</p> => <p>hello</p>
      await expectContentsAwait(context, '<p class="">hello</p>');
    });

    it('should add fontSize to block', async() => {
      $editable.appendTo('body');
      context.invoke('editor.focus');

      await nextTick();
      var textNode = $editable.find('p')[0].firstChild;
      editor.setLastRange(range.create(textNode, 0, textNode, 0).select());

      await nextTick();
      editor.fontSize(20);
      expectContents(context, '<p><span style="font-size: 20px;">﻿</span>hello</p>');
    });
  });

  describe('createLink', () => {
    it('should create normal link', async() => {
      var text = 'hello';
      var pNode = $editable.find('p')[0];
      var textNode = pNode.childNodes[0];
      var startIndex = textNode.wholeText.indexOf(text);
      var endIndex = startIndex + text.length;

      range.create(textNode, startIndex, textNode, endIndex).normalize().select();

      // check creation normal link
      editor.createLink({
        url: 'http://summernote.org',
        text: 'summernote',
      });

      await expectContentsAwait(context, '<p>hello<a href="http://summernote.org">summernote</a></p>');
    });

    it('should create a link with range', async() => {
      var text = 'hello';
      var pNode = $editable.find('p')[0];
      var textNode = pNode.childNodes[0];
      var startIndex = textNode.wholeText.indexOf(text);
      var endIndex = startIndex + text.length;

      var rng = range.create(textNode, startIndex, textNode, endIndex);

      editor.createLink({
        url: 'http://summernote.org',
        text: 'summernote',
        range: rng,
      });

      await expectContentsAwait(context, '<p><a href="http://summernote.org">summernote</a></p>');
    });

    it('should create a link with isNewWindow', async() => {
      var text = 'hello';
      var pNode = $editable.find('p')[0];
      var textNode = pNode.childNodes[0];
      var startIndex = textNode.wholeText.indexOf(text);
      var endIndex = startIndex + text.length;

      var rng = range.create(textNode, startIndex, textNode, endIndex);

      editor.createLink({
        url: 'http://summernote.org',
        text: 'summernote',
        range: rng,
        isNewWindow: true,
      });

      await expectContentsAwait(context, '<p><a href="http://summernote.org" target="_blank">summernote</a></p>');
    });

    it('should create a relative link without scheme', async() => {
      var text = 'hello';
      var pNode = $editable.find('p')[0];
      var textNode = pNode.childNodes[0];
      var startIndex = textNode.wholeText.indexOf(text);
      var endIndex = startIndex + text.length;

      var rng = range.create(textNode, startIndex, textNode, endIndex);

      editor.createLink({
        url: '/relative/url',
        text: 'summernote',
        range: rng,
        isNewWindow: true,
      });

      await expectContentsAwait(context, '<p><a href="/relative/url" target="_blank">summernote</a></p>');
    });

    it('should insert safe html', async() => {
      var text = 'hello';
      var pNode = $editable.find('p')[0];
      var textNode = pNode.childNodes[0];
      var startIndex = textNode.wholeText.indexOf(text);
      var endIndex = startIndex + text.length;

      var rng = range.create(textNode, startIndex, textNode, endIndex);

      editor.createLink({
        url: '/relative/url',
        text: '<iframe src="hackme.com"></iframe>',
        range: rng,
        isNewWindow: true,
      });

      await expectContentsAwait(
        context,
        '<p><a href="/relative/url" target="_blank">&lt;iframe src="hackme.com"&gt;&lt;/iframe&gt;</a></p>',
      );
    });

    it('should modify a link', async() => {
      context.invoke('code', '<p><a href="http://summernote.org">hello world</a></p>');

      var anchorNode = $editable.find('a')[0];
      var rng = range.createFromNode(anchorNode);

      editor.createLink({
        url: 'http://wow.summernote.org',
        text: 'summernote wow',
        range: rng,
      });

      await expectContentsAwait(context, '<p><a href="http://wow.summernote.org">summernote wow</a></p>');
    });

    it('should be limited when creating a link', async() => {
      var options = $.extend({}, $.summernote.options);
      options.maxTextLength = 5;
      context = new Context($('<div><p>hello</p></div>'), options);
      editor = context.modules.editor;

      editor.createLink({
        url: 'http://summernote.org',
        text: 'summernote',
      });
      await expectContentsAwait(context, '<p>hello</p>');
    });

    it('should be limited when modifying a link', async() => {
      var options = $.extend({}, $.summernote.options);
      options.maxTextLength = 5;
      context = new Context($('<p><a href="http://summernote.org">hello</a></p>'), options);

      var editable = context.layoutInfo.editable;
      var anchorNode = editable.find('a')[0];
      var rng = range.createFromNode(anchorNode);
      editor = context.modules.editor;

      editor.createLink({
        url: 'http://summernote.org',
        text: 'hello world',
        range: rng,
      });

      await expectContentsAwait(context, '<a href="http://summernote.org">hello</a>');
    });
  });
});
