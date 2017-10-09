import $ from 'jquery';
import env from '../src/js/base/core/env';

export default function(chai) {
  chai.dom = chai.dom || {};

  chai.dom.equalsIgnoreCase = function(str1, str2) {
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

  chai.dom.equalsStyle = function($node, expected, style) {
    var $tester = $('<div />').css(style, expected);
    return $node.css(style) === $tester.css(style);
  };

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
      'expected ' + this._obj + ' to equal ' + expected + ' style',
      'expected ' + this._obj + ' not to equal ' + expected + ' style'
    );
  });

  chai.assert.equalsIgnoreCase = function(val, exp, msg) {
    new chai.Assertion(val, msg).to.be.equalsIgnoreCase(exp);
  };

  chai.assert.notequalsIgnoreCase = function(val, exp, msg) {
    new chai.Assertion(val, msg).to.not.be.equalsIgnoreCase(exp);
  };
}
