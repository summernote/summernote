define([
  'summernote/base/core/agent'
], function (agent) {
  return function (chai) {
    chai.dom = chai.dom || {};

    chai.dom.equalIgnoreCase = function (str1, str2) {
      str1 = str1.toUpperCase();
      str2 = str2.toUpperCase();

      // [workaround] IE8-10 use &nbsp; instead of bogus br
      if (agent.isMSIE && agent.browserVersion < 11) {
        str2 = str2.replace(/<BR>/g, '&NBSP;');
      }

      // [workaround] IE8 str1 markup has newline between tags
      if (agent.isMSIE && agent.browserVersion < 9) {
        str1 = str1.replace(/\r\n/g, '');
      }

      return str1 === str2;
    };

    chai.Assertion.addChainableMethod('equalIgnoreCase', function (expected) {
      var actual = this._obj;

      return this.assert(
          chai.dom.equalIgnoreCase(actual, expected),
          'expected ' + this._obj + ' to equal ' + expected + ' ignoring case',
          'expected ' + this._obj + ' not to equal ' + expected + ' ignoring case'
          );
    });

    var assert = chai.assert;

    assert.equalIgnoreCase = function (val, exp, msg) {
      new chai.Assertion(val, msg).to.be.equalIgnoreCase(exp);
    };

    assert.notEqualIgnoreCase = function (val, exp, msg) {
      new chai.Assertion(val, msg).to.not.be.equalIgnoreCase(exp);
    };

  };
});
