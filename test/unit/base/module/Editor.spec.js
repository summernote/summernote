/**
 * Editor.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */

import chai from 'chai';
import spies from 'chai-spies';
import chaidom from '../../../chaidom';
import $ from 'jquery';
import env from '../../../../src/js/base/core/env';
import range from '../../../../src/js/base/core/range';
import Context from '../../../../src/js/base/Context';

describe('Editor', () => {
  var expect = chai.expect;
  chai.use(spies);
  chai.use(chaidom);

  var editor, context, $editable;

  function expectContents(context, markup) {
    expect(context.layoutInfo.editable.html()).to.equalsIgnoreCase(markup);
  }

  function expectToHaveBeenCalled(context, customEvent, handler) {
    const $note = context.layoutInfo.note;
    const spy = chai.spy();
    $note.on(customEvent, spy);
    handler();
    expect(spy).to.have.been.called();
  }

  beforeEach(function() {
    $('body').empty(); // important !
    var $note = $('<div><p>hello</p></div>');

    var options = $.extend({}, $.summernote.options);
    options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
    context = new Context($note, options);

    editor = context.modules.editor;
    $editable = context.layoutInfo.editable;

    // [workaround]
    //  - Firefox need setTimeout for applying contents
    //  - IE8-11 can't create range in headless mode
    if (env.isFF || env.isMSIE || env.isEdge) {
      this.skip();
    }
  });

  describe('initialize', () => {
    it('should bind custom events', () => {
      [
        'keydown', 'keyup', 'blur', 'mousedown', 'mouseup',
        'scroll', 'focusin', 'focusout'
      ].forEach((eventName) => {
        expectToHaveBeenCalled(context, 'summernote.' + eventName, () => {
          $editable.trigger(eventName);
        });
      });

      expectToHaveBeenCalled(context, 'summernote.change', () => {
        editor.insertText('hello');
      });
    });
  });

  if (env.isWebkit) {
    describe('undo and redo', () => {
      it('should control history', () => {
        editor.insertText(' world');
        expectContents(context, '<p>hello world</p>');

        editor.undo();
        expectContents(context, '<p>hello</p>');

        editor.redo();
        expectContents(context, '<p>hello world</p>');
      });
    });
  }

  describe('tab', () => {
    it('should insert tab', () => {
      editor.tab();
      expectContents(context, '<p>hello&nbsp;&nbsp;&nbsp;&nbsp;</p>');
    });
  });

  describe('insertParagraph', () => {
    it('should insert paragraph', () => {
      editor.insertParagraph();
      expectContents(context, '<p>hello</p><p><br></p>');

      editor.insertParagraph();
      expectContents(context, '<p>hello</p><p><br></p><p><br></p>');
    });
  });

  if (env.isWebkit) {
    describe('insertImage', () => {
      it('should insert image', () => {
        var source = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAF0lEQVQYGWP8////fwYsgAmLGFiIHhIAT+oECGHuN2UAAAAASUVORK5CYII=';
        return editor.insertImage(source, 'image').then(() => {
          expectContents(context, '<p>hello<img src="' + source + '" data-filename="image" style="width: 0px;"></p>');
        });
      });
    });
  }

  describe('insertOrderedList and insertUnorderedList', () => {
    it('should toggle paragraph to list', () => {
      editor.insertOrderedList();
      expectContents(context, '<ol><li>hello</li></ol>');

      editor.insertUnorderedList();
      expectContents(context, '<ul><li>hello</li></ul>');

      editor.insertUnorderedList();
      expectContents(context, '<p>hello</p>');
    });
  });

  describe('indent and outdent', () => {
    // [workaround] style is different by browser
    if (env.isPhantom) {
      it('should indent and outdent paragraph', () => {
        editor.indent();
        expectContents(context, '<p style="margin-left: 25px;">hello</p>');

        editor.outdent();
        expectContents(context, '<p style="">hello</p>');
      });
    }

    it('should indent and outdent list', () => {
      editor.insertOrderedList();
      expectContents(context, '<ol><li>hello</li></ol>');

      editor.indent();
      expectContents(context, '<ol><ol><li>hello</li></ol></ol>');

      editor.outdent();
      expectContents(context, '<ol><li>hello</li></ol>');
    });
  });

  describe('insertNode', () => {
    it('should insert node', () => {
      editor.insertNode($('<span> world</span>')[0]);
      expectContents(context, '<p>hello<span> world</span></p>');
    });

    it('should be limited', () => {
      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
      options.maxTextLength = 5;
      context = new Context($('<div><p>hello</p></div>'), options);
      editor = context.modules.editor;

      editor.insertNode($('<span> world</span>')[0]);
      expectContents(context, '<p>hello</p>');
    });
  });

  describe('insertText', () => {
    it('should insert text', () => {
      editor.insertText(' world');
      expectContents(context, '<p>hello world</p>');
    });

    it('should be limited', () => {
      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
      options.maxTextLength = 5;
      context = new Context($('<div><p>hello</p></div>'), options);
      editor = context.modules.editor;

      editor.insertText(' world');
      expectContents(context, '<p>hello</p>');
    });
  });

  describe('pasteHTML', () => {
    it('should paste html', () => {
      editor.pasteHTML('<span> world</span>');
      expectContents(context, '<p>hello<span> world</span></p>');
    });

    it('should not call change change event more than once per paste event', () => {
      var generateLargeHtml = () => {
        var html = '<div>';
        for (var i = 0; i < 1000; i++) {
          html += '<p>HTML element #' + i + '</p>';
        }
        html += '</div>';
        return html;
      };
      var $note = context.layoutInfo.note;
      var spy = chai.spy();
      $note.on('summernote.change', spy);
      var html = generateLargeHtml();
      editor.pasteHTML(html);
      expect(spy).to.have.been.called.once;
    });

    it('should be limited', () => {
      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
      options.maxTextLength = 5;
      context = new Context($('<div><p>hello</p></div>'), options);
      editor = context.modules.editor;

      editor.pasteHTML('<span> world</span>');
      expectContents(context, '<p>hello</p>');
    });
  });

  describe('insertHorizontalRule', () => {
    it('should insert horizontal rule', () => {
      editor.insertHorizontalRule();
      expectContents(context, '<p>hello</p><hr><p><br></p>');
    });
  });

  describe('insertTable', () => {
    it('should insert table', () => {
      var markup = [
        '<p>hello</p>',
        '<table class="table table-bordered"><tbody>',
        '<tr><td><br></td><td><br></td></tr>',
        '<tr><td><br></td><td><br></td></tr>',
        '</tbody></table>',
        '<p><br></p>'
      ].join('');
      editor.insertTable('2x2');
      expectContents(context, markup);
    });
  });

  describe('empty', () => {
    it('should make contents empty', () => {
      editor.empty();
      expect(editor.isEmpty()).to.be.true;
    });
  });

  describe('formatBlock', () => {
    it('should apply formatBlock', () => {
      $editable.appendTo('body');
      editor.formatBlock('blockquote');

      // start <p>hello</p> => <blockquote>hello</blockquote>
      expectContents(context, '<blockquote>hello</blockquote>');
    });

    it('should apply multi formatBlock', () => {
      // set multi block html
      var codes = [
        '<p><a href="http://summernote.org">hello world</a></p>',
        '<p><a href="http://summernote.org">hello world</a></p>',
        '<p><a href="http://summernote.org">hello world</a></p>'
      ];

      context.invoke('code', codes.join(''));

      // run formatBlock
      $editable.appendTo('body');
      editor.formatBlock('blockquote');

      // check current range position in blockquote element

      var nodeName = $editable.children()[0].nodeName;
      expect(nodeName).to.equalsIgnoreCase('blockquote');
    });

    it('should apply multi test 2 - formatBlock', () => {
      var codes = [
        '<p><a href="http://summernote.org">hello world</a></p>',
        '<p><a href="http://summernote.org">hello world</a></p>',
        '<p><a href="http://summernote.org">hello world</a></p>'
      ];

      context.invoke('code', codes.join(''));
      $editable.appendTo('body');

      var startNode = $editable.find('p').first()[0];
      var endNode = $editable.find('p').last()[0];

      // all p tags is wrapped
      range.create(startNode, 1, endNode, 1).normalize().select();

      editor.formatBlock('blockquote');

      var nodeName = $editable.children()[0].nodeName;
      expect(nodeName).to.equalsIgnoreCase('blockquote');

      // p -> blockquote, p is none
      expect($editable.find('p').length).to.equals(0);
    });

    it('should apply custom className in formatBlock', () => {
      var $target = $('<blockquote class="blockquote" />');
      $editable.appendTo('body');
      editor.formatBlock('blockquote', $target);

      // start <p>hello</p> => <blockquote class="blockquote">hello</blockquote>
      expectContents(context, '<blockquote class="blockquote">hello</blockquote>');
    });
  });

  describe('createLink', () => {
    it('should create normal link', () => {
      var text = 'hello';
      var pNode = $editable.find('p')[0];
      var textNode = pNode.childNodes[0];
      var startIndex = textNode.wholeText.indexOf(text);
      var endIndex = startIndex + text.length;

      range.create(textNode, startIndex, textNode, endIndex).normalize().select();

      // check creation normal link
      editor.createLink({
        url: 'http://summernote.org',
        text: 'summernote'
      });

      expectContents(context, '<p>hello<a href="http://summernote.org">summernote</a></p>');
    });

    it('should create a link with range', () => {
      var text = 'hello';
      var pNode = $editable.find('p')[0];
      var textNode = pNode.childNodes[0];
      var startIndex = textNode.wholeText.indexOf(text);
      var endIndex = startIndex + text.length;

      var rng = range.create(textNode, startIndex, textNode, endIndex);

      editor.createLink({
        url: 'http://summernote.org',
        text: 'summernote',
        range: rng
      });

      expectContents(context, '<p><a href="http://summernote.org">summernote</a></p>');
    });

    it('should create a link with isNewWindow', () => {
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
        isNewWindow: true
      });

      expectContents(context, '<p><a href="http://summernote.org" target="_blank">summernote</a></p>');
    });

    it('should create a relative link without scheme', () => {
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
        isNewWindow: true
      });

      expectContents(context, '<p><a href="/relative/url" target="_blank">summernote</a></p>');
    });

    it('should modify a link', () => {
      context.invoke('code', '<p><a href="http://summernote.org">hello world</a></p>');

      var anchorNode = $editable.find('a')[0];
      var rng = range.createFromNode(anchorNode);

      editor.createLink({
        url: 'http://wow.summernote.org',
        text: 'summernote wow',
        range: rng
      });

      expectContents(context, '<p><a href="http://wow.summernote.org">summernote wow</a></p>');
    });

    it('should be limited when creating a link', () => {
      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
      options.maxTextLength = 5;
      context = new Context($('<div><p>hello</p></div>'), options);
      editor = context.modules.editor;

      editor.createLink({
        url: 'http://summernote.org',
        text: 'summernote'
      });
      expectContents(context, '<p>hello</p>');
    });

    it('should be limited when modifying a link', () => {
      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
      options.maxTextLength = 5;
      context = new Context($('<p><a href="http://summernote.org">hello</a></p>'), options);

      var editable = context.layoutInfo.editable;
      var anchorNode = editable.find('a')[0];
      var rng = range.createFromNode(anchorNode);
      editor = context.modules.editor;

      editor.createLink({
        url: 'http://summernote.org',
        text: 'hello world',
        range: rng
      });

      expectContents(context, '<a href="http://summernote.org">hello</a>');
    });
  });
});
