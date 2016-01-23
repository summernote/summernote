/**
 * Context.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
define([
  'chai',
  'spies',
  'chaidom',
  'jquery',
  'summernote/lite/settings',
  'summernote/base/core/agent',
  'summernote/base/core/dom',
  'summernote/base/Context'
], function (chai, spies, chaiDom, $, settings, agent, dom, Context) {
  'use strict';

  var expect = chai.expect;
  chai.use(spies);
  chai.use(chaiDom);

  describe('Context initialization', function () {
    it('should be initialized without calling callback', function () {
      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);

      var spy = chai.spy();
      var $note = $('<div><p>hello</p></div>');
      $note.on('summernote.change', spy);

      var context = new Context($note, options);
      expect(spy).to.have.not.been.called();

      // [workaround]
      //  - IE8-11 can't create range in headless mode
      if (!agent.isMSIE) {
        context.invoke('insertText', 'hello');
        expect(spy).to.have.been.called();
      }
    });
  });

  describe('Context', function () {
    var context;
    beforeEach(function () {
      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
      context = new Context($('<div><p>hello</p></div>'), options);
    });

    it('should preserve disabled status after reset', function () {
      expect(context.isDisabled()).to.be.false;
      context.disable();
      expect(context.isDisabled()).to.be.true;
      context.reset();
      expect(context.isDisabled()).to.be.true;
    });

    it('should returns contents when code is called with no arguments', function () {
      expect(context.code()).to.equalIgnoreCase('<p>hello</p>');
    });
  });
});
