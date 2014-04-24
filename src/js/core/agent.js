define(['CodeMirror'], function (CodeMirror) {
  if ('function' !== typeof Array.prototype.reduce) {
    /**
     * Array.prototype.reduce fallback
     *
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
     */
    Array.prototype.reduce = function (callback, optInitialValue) {
      var idx, value, length = this.length >>> 0, isValueSet = false;
      if (1 < arguments.length) {
        value = optInitialValue;
        isValueSet = true;
      }
      for (idx = 0; length > idx; ++idx) {
        if (this.hasOwnProperty(idx)) {
          if (isValueSet) {
            value = callback(value, this[idx], idx, this);
          } else {
            value = this[idx];
            isValueSet = true;
          }
        }
      }
      if (!isValueSet) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      return value;
    };
  }

  /**
   * Object which check platform and agent
   */
  var agent = {
    bMac: navigator.appVersion.indexOf('Mac') > -1,
    bMSIE: navigator.userAgent.indexOf('MSIE') > -1 || navigator.userAgent.indexOf('Trident') > -1,
    bFF: navigator.userAgent.indexOf('Firefox') > -1,
    jqueryVersion: parseFloat($.fn.jquery),
    bCodeMirror: !!CodeMirror
  };

  return agent;
});
