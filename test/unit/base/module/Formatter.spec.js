/**
 * Formatter.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
define([
  'chai',
  'summernote/base/core/range',
  'summernote/base/Context',
  'summernote/base/module/Formatter'
], function (chai, range, Context, Formatter) {
  'use strict';

  var expect = chai.expect;

  var expectContents = function (context, markup) {
    expect(context.layoutInfo.editable.html()).to.equalsIgnoreCase(markup);
  };

  describe('Formatter', function () {
    var formatter, context;

    beforeEach(function () {
      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {
      }, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
      context = new Context($('<div><p>hello</p></div>'), options);
      formatter = new Formatter(context);

      // append to body 
      context.layoutInfo.editable.appendTo('body');
      
    });

    it('check single range for fontName execCommand  ', function () {

      var $p = context.layoutInfo.editable.find('p');
      var textNode = $p[0].firstChild;

      range.create(textNode, 0, textNode, 2).select();
      document.execCommand('fontName', false, 'Arial');
      formatter.fontName();
      
      var $span = $p.find('span');
      expect($span.length).to.equals(1);
      expect($span.css('font-family')).to.equals('Arial');
      expectContents(context, '<p><span style="font-family: Arial;">he</span>llo</p>');
    });

    it('check multi range for fontName execCommand  ', function () {
      var sampleText = [
        '<p>hello</p>',
        '<p>World</p>',
        '<p>Wow</p>',
        '<p>Show me the money</p>',
        '<p>ChuChu</p>'
      ].join('');
      context.invoke('code', sampleText);

      var $p = context.layoutInfo.editable.find('p');

      var $startP = $p.first();
      var startTextNode = $startP[0].firstChild;

      var $lastP = $p.last();
      var lastTextNode = $lastP[0].firstChild;      

      range.create(startTextNode, 0, lastTextNode, 3).select();
      document.execCommand('fontName', false, 'Arial');
      formatter.fontName();
      
      var $span = $p.find('span');
      expect($span.length).to.equals(5);
      expect($span.first().css('font-family')).to.equals('Arial');

      var testText = [
        '<p><span style="font-family: Arial;">hello</span></p>',
        '<p><span style="font-family: Arial;">World</span></p>',
        '<p><span style="font-family: Arial;">Wow</span></p>',
        '<p><span style="font-family: Arial;">Show me the money</span></p>',
        '<p><span style="font-family: Arial;">Chu</span>Chu</p>'
      ].join('');

      expectContents(context, testText);
    });

    it('test multi range 2 for fontName execCommand  ', function () {
      var sampleText = [
        '<p>he <span>yollo</span>llo</p>',
        '<p>World</p>',
        '<p>Wow</p>',
        '<p>Show me the money</p>',
        '<p>ChuChu</p>'
      ].join('');
      context.invoke('code', sampleText);

      var $p = context.layoutInfo.editable.find('p');

      var $startElement = $p.first().find('span');
      var startTextNode = $startElement[0].firstChild;

      var $lastP = $p.last();
      var lastTextNode = $lastP[0].firstChild;      

      range.create(startTextNode, 0, lastTextNode, 3).select();
      document.execCommand('fontName', false, 'Arial');
      formatter.fontName();
      
      var $span = $p.find('span');
      expect($span.length).to.equals(6);
      expect($span.first().css('font-family')).to.equals('Arial');

      var testText = [
        '<p>he <span style="font-family: Arial;"><span>yollo</span>llo</span></p>',
        '<p><span style="font-family: Arial;">World</span></p>',
        '<p><span style="font-family: Arial;">Wow</span></p>',
        '<p><span style="font-family: Arial;">Show me the money</span></p>',
        '<p><span style="font-family: Arial;">Chu</span>Chu</p>'
      ].join('');

      expectContents(context, testText);
    });
  });
});
