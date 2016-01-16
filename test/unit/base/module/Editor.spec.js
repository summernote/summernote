/**
 * Editor.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
/* jshint unused: false */
define([
  'chai',
  'helper',
  'jquery',
  'summernote/lite/settings',
  'summernote/base/core/agent',
  'summernote/base/core/dom',
  'summernote/base/Context',
  'summernote/base/module/Editor'
], function (chai, helper, $, settings, agent, dom, Context, Editor) {
  'use strict';

  var expect = chai.expect;

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
        helper.equalsToUpperCase(
          '<p>hello world</p>',
          context.layoutInfo.editable.html(),
          expect
        );

        editor.undo();
        helper.equalsToUpperCase(
          '<p>hello</p>',
          context.layoutInfo.editable.html(), expect
        );

        editor.redo();
        helper.equalsToUpperCase(
          '<p>hello world</p>',
          context.layoutInfo.editable.html(),
          expect
        );
      });
    });

    describe('insertParagraph', function () {
      it('should insert paragraph', function () {
        editor.insertParagraph();
        helper.equalsToUpperCase(
          '<p>hello</p><p><br></p>',
          context.layoutInfo.editable.html(), expect
        );
      });
    });

    describe('insertOrderedList and insertUnorderedList', function () {
      it('should toggle paragraph to list', function () {
        editor.insertOrderedList();
        helper.equalsToUpperCase(
          '<ol><li>hello</li></ol>',
          context.layoutInfo.editable.html(), expect
        );

        editor.insertUnorderedList();
        helper.equalsToUpperCase(
          '<ul><li>hello</li></ul>',
          context.layoutInfo.editable.html(), expect
        );

        editor.insertUnorderedList();
        helper.equalsToUpperCase(
          '<p>hello</p>',
          context.layoutInfo.editable.html(), expect
        );
      });
    });

    describe('insertNode', function () {
      it('should insert node', function () {
        editor.insertNode($('<span> world</span>')[0]);
        helper.equalsToUpperCase(
          '<p>hello<span> world</span></p>',
          context.layoutInfo.editable.html(),
          expect
        );
      });
    });

    describe('insertText', function () {
      it('should insert text', function () {
        editor.insertText(' world');
        helper.equalsToUpperCase(
          '<p>hello world</p>',
          context.layoutInfo.editable.html(),
          expect
        );
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
