/**
 * Codeview.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
import chai from 'chai';
import $ from 'jquery';
import Context from '../../../../src/js/base/Context';
import Codeview from '../../../../src/js/base/module/Codeview';
import '../../../../src/js/bs4/settings';

describe('Codeview', () => {
  var expect = chai.expect;
  var codeview, context;

  beforeEach(() => {
    var options = $.extend({}, $.summernote.options);
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
