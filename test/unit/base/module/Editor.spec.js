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

    function mockedContext() {
      return {
        layoutInfo: {
          editable: {}
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

      var editor, context;

      beforeEach(function () {
        editor = new Editor(context = mockedContext());
      });

      it('should invoke the "code" api method with dom.emptyPara as argument', function (done) {
        context.invoke = function (name, args) {
          expect(name).to.equal('code');
          expect(args).to.equal(dom.emptyPara);

          done();
        };

        editor.empty();
      });

    });

  });
});
