/**
 * Context.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
import chai from 'chai';
import spies from 'chai-spies';
import $ from 'jquery';// window.jQuery = $;
import 'bootstrap';
import chaidom from 'test/chaidom';
import env from 'src/js/base/core/env';
import Context from 'src/js/base/Context';
import 'src/js/bs4/settings';

var expect = chai.expect;
chai.use(spies);
chai.use(chaidom);

describe('Context lifecycle', () => {
  it('should be initialized without calling callback', () => {
    var spy = chai.spy();
    var $note = $('<div><p>hello</p></div>');
    $note.on('summernote.change', spy);

    var context = new Context($note, $.summernote.options);
    expect(spy).to.have.not.been.called();

    // [workaround]
    //  - IE8-11 can't create range in headless mode
    if (!env.isMSIE) {
      context.invoke('insertText', 'hello');
      expect(spy).to.have.been.called();
    }
  });

  it('should preserve user events handler after destroy', () => {
    var spy = chai.spy();
    var $note = $('<div><p>hello</p></div>');
    $note.on('click', spy);

    var context = new Context($note, $.summernote.options);
    context.destroy();

    $note.trigger('click');
    expect(spy).to.have.been.called();
  });
});

describe('Context', () => {
  var context;
  beforeEach(() => {
    context = new Context($('<div><p>hello</p></div>'), $.summernote.options);
  });

  it('should get or set contents with code', () => {
    expect(context.code()).to.equalsIgnoreCase('<p>hello</p>');
    context.code('<p>hello2</p>');
    expect(context.code()).to.equalsIgnoreCase('<p>hello2</p>');
  });

  it('should enable or disable editor', () => {
    expect(context.isDisabled()).to.be.false;
    context.disable();
    expect(context.isDisabled()).to.be.true;
    context.enable();
    expect(context.isDisabled()).to.be.false;
  });

  it('should preserve disabled status after reset', () => {
    expect(context.isDisabled()).to.be.false;
    context.disable();
    expect(context.isDisabled()).to.be.true;
    context.reset();
    expect(context.isDisabled()).to.be.true;
  });
});
