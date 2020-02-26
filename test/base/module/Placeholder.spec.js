/**
 * Placeholder.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
import chai from 'chai';
import $ from 'jquery';
import Context from 'src/js/base/Context';
import 'src/js/bs4/settings';

describe('Placeholder', () => {
  var assert = chai.assert;

  it('should not be initialized by placeholder attribute without inheritPlaceHolder', () => {
    var options = $.extend({}, $.summernote.options);
    var context = new Context($('<textarea placeholder="custom_placeholder"><p>hello</p></textarea>'), options);
    var $editor = context.layoutInfo.editor;

    assert.isTrue($editor.find('.note-placeholder').length === 0);
  });

  it('should be initialized by placeholder attribute with inheritPlaceHolder', () => {
    var options = $.extend({}, $.summernote.options);
    options.inheritPlaceholder = true;
    var context = new Context($('<textarea placeholder="custom_placeholder"><p>hello</p></textarea>'), options);
    var $editor = context.layoutInfo.editor;

    assert.isTrue($editor.find('.note-placeholder').length === 1);
    assert.isTrue($editor.find('.note-placeholder').html() === 'custom_placeholder');
  });
});
