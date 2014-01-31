define('core/async', function () {
  /**
   * Async functions which returns `Promise`
   */
  var async = (function () {
    /**
     * read contents of file as representing URL
     *
     * @param {File} file
     * @return {Promise}
     */
    var readFileAsDataURL = function (file) {
      return $.Deferred(function (deferred) {
        $.extend(new FileReader(), {
          onload: function (e) {
            var sDataURL = e.target.result;
            deferred.resolve(sDataURL);
          },
          onerror: function () {
            deferred.reject(this);
          }
        }).readAsDataURL(file);
      }).promise();
    };
  
    /**
     * load image from url string
     *
     * @param {String} sUrl
     * @param {Promise}
     */
    var loadImage = function (sUrl) {
      return $.Deferred(function (deferred) {
        $.extend(new Image(), {
          detachEvents: function () {
            this.onload = null;
            this.onerror = null;
            this.onabort = null;
          },
          onload: function () {
            this.detachEvents();
            deferred.resolve(this);
          },
          onerror: function () {
            // URL returns 404, etc
            this.detachEvents();
            deferred.reject(this);
          },
          onabort: function () {
            // IE may call this if user clicks "Stop"
            this.detachEvents();
            deferred.reject(this);
          }
        }).src = sUrl;
      }).promise();
    };
    return {
      readFileAsDataURL: readFileAsDataURL,
      loadImage: loadImage
    };
  })();

  return async;
});
