define('core/async', function () {
  /**
   * Async functions which returns deferred object
   */
  var async = (function () {
    /**
     * Read contents of file as representing URL
     * @param {File} file
     */
    var readFile = function (file) {
      return $.Deferred(function (deferred) {
        $.extend(new FileReader(), {
          onload: function (e) {
            deferred.resolve(e.target.result);
          },
          onerror: function () {
            deferred.reject(this);
          }
        }).readAsDataURL(file);
      }).promise();
    };
  
    /**
     * Load image from url string
     *
     * @param {String} sUrl
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
    return { readFile: readFile, loadImage: loadImage };
  })();

  return async;
});
