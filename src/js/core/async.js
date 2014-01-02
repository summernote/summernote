define('core/async', function () {
  /**
   * aysnc functions which returns deferred object
   */
  var async = (function () {
    /**
     * readFile
     * @param {file} file - file object
     */
    var readFile = function (file) {
      return $.Deferred(function (deferred) {
        var reader = new FileReader();
        reader.onload = function (e) { deferred.resolve(e.target.result); };
        reader.onerror = function () { deferred.reject(this); };
        reader.readAsDataURL(file);
      }).promise();
    };
  
    /**
     * loadImage from url string
     * @param {string} sUrl
     */
    var loadImage = function (sUrl) {
      return $.Deferred(function (deferred) {
        var image = new Image();
        image.onload = loaded;
        image.onerror = errored; // URL returns 404, etc
        image.onabort = errored; // IE may call this if user clicks "Stop"
        image.src = sUrl;

        function loaded() {
          unbindEvents();
          deferred.resolve(image);
        }
        function errored() {
          unbindEvents();
          deferred.reject(image);
        }
        function unbindEvents() {
          image.onload = null;
          image.onerror = null;
          image.onabort = null;
        }
      }).promise();
    };
    return { readFile: readFile, loadImage: loadImage };
  })();

  return async;
});
