/**
 * Editor.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
define([
  'chai',
  'helper',
  'jquery',
  'summernote/lite/settings',
  'summernote/base/core/agent',
  'summernote/base/core/dom',
  'summernote/base/Context'
], function (chai, helper, $, settings, agent, dom, Context) {
  'use strict';
  var expect = chai.expect;

  var expectContents = function (context, markup) {
    helper.equalsToUpperCase(
      markup,
      context.layoutInfo.editable.html(),
      expect
    );
  };

  describe('Editor', function () {
    var editor, context;

    beforeEach(function () {
      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
      context = new Context($('<div><p>hello</p></div>'), options);
      editor = context.modules.editor;
    });

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
      it('should indent and outdent paragraph', function () {
        editor.indent();
        expectContents(context, '<p style="margin-left: 25px; ">hello</p>');

        editor.outdent();
        expectContents(context, '<p style="">hello</p>');
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

    describe('empty', function () {
      it('should make contents empty', function () {
        editor.empty();
        expect(editor.isEmpty()).to.be.true;
      });
    });
  });
});
