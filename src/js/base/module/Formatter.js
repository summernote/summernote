define([
  'jquery',
  'summernote/base/core/range'
], function ($, range) {
  /**
   * Command Formatter
   */
  var Formatter = function (context) {

    this.shouldInitialize = function () {
      return true; 
    };

    /**
     * run after execCommand('fontName')
     */
    this.fontName = function () {
      var currentRange = context.invoke('createRange');
      var sc = currentRange.sc;
      var ec = currentRange.ec;
      var so = currentRange.so;
      var eo = currentRange.eo; 

      var $fontAll = context.layoutInfo.editable.find('font');
      $fontAll.each(function() {
        var $font = $(this);
        var $span = $('<span />');
        
        if ($font.attr('face')) {
          $span.css('font-family', $font.attr('face'));
        }

        $font.after($span);

        var node = $font[0].firstChild;
        while (node) {
          var hasStart = false, hasEnd = false; 
          if (node === sc) { hasStart = true; } 
          if (node === ec) { hasEnd = true; }

          var aChild = $span[0].appendChild(node);

          if (hasStart) { sc = aChild; }
          if (hasEnd) { ec = aChild; }
          
          node = node.nextSibling;
        }

        $font.remove();
      });

      // recover range selection 
      range.create(sc, so, ec, eo).select(); 

    };

  };

  return Formatter;
});
