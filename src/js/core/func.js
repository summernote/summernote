define('core/func', function () {
  /**
   * func utils (for high-order func's arg)
   */
  var func = (function () {
    var eq = function (elA) {
      return function (elB) {
        return elA === elB;
      };
    };

    var eq2 = function (elA, elB) {
      return elA === elB;
    };

    var ok = function () {
      return true;
    };

    var fail = function () {
      return false;
    };

    var not = function (f) {
      return function () {
        return !f.apply(f, arguments);
      };
    };

    var self = function (a) {
      return a;
    };

    return {
      eq: eq,
      eq2: eq2,
      ok: ok,
      fail: fail,
      not: not,
      self: self
    };
  })();

  return func;
});
