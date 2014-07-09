define(['jquery'], function ($) {
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

  var isSupportAmd = typeof define === 'function' && define.amd;

  /**
   * Object which check platform and agent
   */
  var agent = {
    isMac: navigator.appVersion.indexOf('Mac') > -1,
    isMSIE: navigator.userAgent.indexOf('MSIE') > -1 || navigator.userAgent.indexOf('Trident') > -1,
    isFF: navigator.userAgent.indexOf('Firefox') > -1,
    jqueryVersion: parseFloat($.fn.jquery),
    isSupportAmd: isSupportAmd,
    hasCodeMirror: isSupportAmd ? require.specified('CodeMirror') : !!window.CodeMirror
  };

  return agent;
});
