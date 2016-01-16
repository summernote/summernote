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
      context = new Context($('<div>hello</div>'), options);
      editor = context.modules.editor;
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
