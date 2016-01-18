/**
 * Editor.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
define([
  'chai',
  'spies',
  'helper',
  'jquery',
  'summernote/lite/settings',
  'summernote/base/core/agent',
  'summernote/base/core/dom',
  'summernote/base/Context'
], function (chai, spies, helper, $, settings, agent, dom, Context) {
  'use strict';
  var expect = chai.expect;
  chai.use(spies);

  // [workaround]
  //  - Firefox need setTimeout for applying contents
  //  - IE8-11 can't create range in headless mode
  if (!(agent.isWebkit && agent.isEdge)) {
    return;
  }

  var expectContents = function (context, markup) {
    helper.equalsToUpperCase(
      markup,
      context.layoutInfo.editable.html(),
      expect
    );
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
          'scroll', 'paste', 'focusin', 'focusout'
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
          expectContents(context, '<p style="margin-left: 25px; ">hello</p>');

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
          '<table><tbody><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table>',
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
  });
});
