/**
 * Editor.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
define([
  'chai',
  'spies',
  'chaidom',
  'jquery',
  'summernote/base/core/agent',
  'summernote/base/core/dom',
  'summernote/base/core/range',
  'summernote/base/Context'
], function (chai, spies, chaidom, $, agent, dom, range, Context) {
  'use strict';
  var expect = chai.expect;
  chai.use(spies);
  chai.use(chaidom);

  // [workaround]
  //  - Firefox need setTimeout for applying contents
  //  - IE8-11 can't create range in headless mode
  if (!(agent.isWebkit || agent.isEdge)) {
    return;
  }

  var expectContents = function (context, markup) {
    expect(context.layoutInfo.editable.html()).to.equalsIgnoreCase(markup);
  };

  var expectToHaveBeenCalled = function (context, customEvent, handler) {
    var $note = context.layoutInfo.note;
    var spy = chai.spy();
    $note.on(customEvent, spy);
    handler();
    expect(spy).to.have.been.called();
  };

  describe('Editor', function () {
    var editor, context;

    beforeEach(function () {
      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
      context = new Context($('<div><p>hello</p></div>'), options);
      editor = context.modules.editor;
    });

    describe('initialize', function () {
      it('should bind custom events', function () {
        [
          'keydown', 'keyup', 'blur', 'mousedown', 'mouseup',
          'scroll', 'focusin', 'focusout'
        ].forEach(function (eventName) {
          expectToHaveBeenCalled(context, 'summernote.' + eventName, function () {
            context.layoutInfo.editable.trigger(eventName);
          });
        });

        expectToHaveBeenCalled(context, 'summernote.change', function () {
          editor.insertText('hello');
        });
      });
    });

    if (agent.isWebkit) {
      describe('undo and redo', function () {
        it('should control history', function () {
          editor.insertText(' world');
          expectContents(context, '<p>hello world</p>');

          editor.undo();
          expectContents(context, '<p>hello</p>');

          editor.redo();
          expectContents(context, '<p>hello world</p>');
        });
      });
    }

    describe('tab', function () {
      it('should insert tab', function () {
        editor.tab();
        expectContents(context, '<p>hello&nbsp;&nbsp;&nbsp;&nbsp;</p>');
      });
    });

    describe('insertParagraph', function () {
      it('should insert paragraph', function () {
        editor.insertParagraph();
        expectContents(context, '<p>hello</p><p><br></p>');

        editor.insertParagraph();
        expectContents(context, '<p>hello</p><p><br></p><p><br></p>');
      });
    });

    describe('insertOrderedList and insertUnorderedList', function () {
      it('should toggle paragraph to list', function () {
        editor.insertOrderedList();
        expectContents(context, '<ol><li>hello</li></ol>');

        editor.insertUnorderedList();
        expectContents(context, '<ul><li>hello</li></ul>');

        editor.insertUnorderedList();
        expectContents(context, '<p>hello</p>');
      });
    });

    describe('indent and outdent', function () {
      // [workaround] style is different by browser
      if (agent.isPhantom) {
        it('should indent and outdent paragraph', function () {
          editor.indent();
          expectContents(context, '<p style="margin-left: 25px;">hello</p>');

          editor.outdent();
          expectContents(context, '<p style="">hello</p>');
        });
      }

      it('should indent and outdent list', function () {
        editor.insertOrderedList();
        expectContents(context, '<ol><li>hello</li></ol>');

        editor.indent();
        expectContents(context, '<ol><ol><li>hello</li></ol></ol>');

        editor.outdent();
        expectContents(context, '<ol><li>hello</li></ol>');
      });
    });

    describe('insertNode', function () {
      it('should insert node', function () {
        editor.insertNode($('<span> world</span>')[0]);
        expectContents(context, '<p>hello<span> world</span></p>');
      });
    });

    describe('insertText', function () {
      it('should insert text', function () {
        editor.insertText(' world');
        expectContents(context, '<p>hello world</p>');
      });
    });

    describe('pasteHTML', function () {
      it('should paste html', function () {
        editor.pasteHTML('<span> world</span>');
        expectContents(context, '<p>hello<span> world</span></p>');
      });

      it('should not call change change event more than once per paste event', function () {
        var generateLargeHtml = function () {
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
    });

    describe('insertHorizontalRule', function () {
      it('should insert horizontal rule', function () {
        editor.insertHorizontalRule();
        expectContents(context, '<p>hello</p><hr><p><br></p>');
      });
    });

    describe('insertTable', function () {
      it('should insert table', function () {
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

    describe('empty', function () {
      it('should make contents empty', function () {
        editor.empty();
        expect(editor.isEmpty()).to.be.true;
      });
    });

    describe('createLink', function () {
      it('should create normal link', function () {
        var text = 'hello';

        var editable = context.layoutInfo.editable;
        var pNode = editable.find('p')[0];
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

      it('should create a link with range', function () {
        var text = 'hello';
        var editable = context.layoutInfo.editable;
        var pNode = editable.find('p')[0];
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

      it('should create a link with isNewWindow', function () {
        var text = 'hello';
        var editable = context.layoutInfo.editable;
        var pNode = editable.find('p')[0];
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

      it('should modify a link', function () {
        context.invoke('code', '<p><a href="http://summernote.org">hello world</a></p>');

        var editable = context.layoutInfo.editable;
        var anchorNode = editable.find('a')[0];
        var rng = range.createFromNode(anchorNode);

        editor.createLink({
          url: 'http://wow.summernote.org',
          text: 'summernote wow',
          range: rng
        });

        expectContents(context, '<p><a href="http://wow.summernote.org">summernote wow</a></p>');
      });
    });
  });
});
