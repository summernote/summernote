/**
 * Codeview.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
import '../../../../src/js/bs3/settings';
import $ from 'jquery';
import chai from 'chai';
import Context from '../../../../src/js/base/Context';
import Codeview from '../../../../src/js/base/module/Codeview';

var expect = chai.expect;

describe('Codeview', () => {
  var codeview, context;

  beforeEach(() => {
    var options = $.extend({}, $.summernote.options);
    options.langInfo = $.extend(true, {
    }, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
    context = new Context($('<div><p>hello</p></div>'), options);
    codeview = new Codeview(context);
  });

  it('should toggle codeview mode', () => {
    expect(codeview.isActivated()).to.be.false;
    codeview.toggle();
    expect(codeview.isActivated()).to.be.true;
    codeview.toggle();
    expect(codeview.isActivated()).to.be.false;
  });
});
