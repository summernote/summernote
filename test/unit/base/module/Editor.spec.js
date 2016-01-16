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
  'summernote/base/core/dom',
  'summernote/base/Context',
  'summernote/base/module/Editor'
], function (chai, helper, $, settings, dom, Context, Editor) {
  'use strict';

  var expect = chai.expect;

  describe('Editor', function () {
    var editor, context;

    beforeEach(function () {
      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
      context = new Context($('<div>'), options);
      editor = context.modules.editor;
    });

    describe('insertParagraph', function () {
      it('should insert paragraph', function () {
        editor.insertParagraph();
        helper.equalsToUpperCase(
          context.layoutInfo.editable.html(),
          '<p><br></p><p><br></p>', expect
        );
      });
    });

    describe('insertText', function () {
      it('should insert text', function () {
        editor.insertText('hello');
        helper.equalsToUpperCase(
          context.layoutInfo.editable.html(),
          '<p>hello<br></p>', expect
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
