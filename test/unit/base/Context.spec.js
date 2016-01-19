/**
 * Context.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
/* jshint unused: false */
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

  describe('Context.Initialize.Check', function () {
    var options = $.extend({}, $.summernote.options);
    options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
    var context = new Context($('<div><p>hello</p></div>'), options);

    var $note = context.layoutInfo.note;
    var spy = chai.spy();

    $note.on('summernote.change', spy);

    expect(spy).to.have.not.been.called();

    var expectToHaveBeenCalled = function () {
      expect(spy).to.have.been.called();
    };

    expect(expectToHaveBeenCalled).throw(chai.AssertionError);
  });
});
