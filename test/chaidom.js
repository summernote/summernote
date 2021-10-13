import $ from 'jquery';
import env from 'src/js/core/env';

export default function(chai) {
  chai.dom = chai.dom || {};

  chai.dom.equalsIgnoreCase = (str1, str2) => {
    str1 = str1.toUpperCase();
    str2 = str2.toUpperCase();

    // [workaround] IE8-10 use &nbsp; instead of bogus br
    if (env.isMSIE && env.browserVersion < 11) {
      str2 = str2.replace(/<BR\/?>/g, '&NBSP;');
      str1 = str1.replace(/<BR\/?>/g, '&NBSP;');
    }

    // [workaround] IE8 str1 markup has newline between tags
    if (env.isMSIE && env.browserVersion < 9) {
      str1 = str1.replace(/\r\n/g, '');
    }

    return str1 === str2;
  };

  chai.dom.equalsStyle = ($node, expected, style) => {
    const nodeStyle = window.getComputedStyle($node[0]).getPropertyValue(style);
    const testerStyle = $('<div></div>').css(style, expected).css(style);
    return nodeStyle === testerStyle;
  };

  chai.Assertion.addChainableMethod('await', (done) => {
    try {
      setTimeout(() => { done(); }, 10);
    } catch (e) {
      done(e);
    }
  });

  chai.Assertion.addChainableMethod('equalsIgnoreCase', function(expected) {
    var actual = this._obj;

    return this.assert(
      chai.dom.equalsIgnoreCase(actual, expected),
      'expected ' + this._obj + ' to equal ' + expected + ' ignoring case',
      'expected ' + this._obj + ' not to equal ' + expected + ' ignoring case'
    );
  });

  chai.Assertion.addChainableMethod('equalsStyle', function(expected, style) {
    var $node = this._obj;

    return this.assert(
      chai.dom.equalsStyle($node, expected, style),
      'expected ' + this._obj.css(style) + ' to equal ' + expected + ' style',
      'expected ' + this._obj.css(style) + ' not to equal ' + expected + ' style'
    );
  });

  chai.assert.equalsIgnoreCase = (val, exp, msg) => {
    new chai.Assertion(val, msg).to.be.equalsIgnoreCase(exp);
  };

  chai.assert.notequalsIgnoreCase = (val, exp, msg) => {
    new chai.Assertion(val, msg).to.not.be.equalsIgnoreCase(exp);
  };
}
