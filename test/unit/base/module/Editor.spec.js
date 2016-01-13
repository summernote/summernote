/**
 * Editor.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
/* jshint unused: false */
define([
  'chai',
  'summernote/base/core/dom',
  'summernote/base/module/Editor'
], function (chai, dom, Editor) {
  'use strict';

  var expect = chai.expect;

  describe('base:module.Editor', function () {

    function context($editable) {
      return {
        layoutInfo: {
          editable: $editable
        },
        options: {
          langInfo: {
            help: {}
          }
        },
        memo: function () {},
        triggerEvent: function () {}
      };
    }

    describe('The empty function', function () {

      var editor, $editable;

      beforeEach(function () {
        editor = new Editor(context($editable = $('<div class="note-editable" />')));
      });

      it('should resets the contents to an emptyPara', function () {
        $editable.html('Hello');
        editor.empty();

        expect($editable.html()).to.equal(dom.emptyPara);
      });

      it('should return the new contents', function () {
        $editable.html('Hello');

        expect(editor.empty()).to.equal(dom.emptyPara);
      });

    });

  });
});
