define([
  'summernote/core/agent'
], function (agent) {
  return {
    equalsToUpperCase: function (actual, expected, assert) {
      actual = actual.toUpperCase();
      expected = expected.toUpperCase();

      // [workaround] IE8-10 use &nbsp; instead of bogus br
      if (agent.isMSIE && agent.browserVersion < 11) {
        expected = expected.replace(/<BR>/g, '&NBSP;');
      }

      // [workaround] IE8 actual markup has newline between tags
      if (agent.isMSIE && agent.browserVersion < 9) {
        actual = actual.replace(/\r\n/g, '');
      }

      assert(actual).to.equal(expected);
    }
  };
});
