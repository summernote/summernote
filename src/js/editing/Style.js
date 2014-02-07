define(['core/dom'], function (dom) {
  /**
   * Style
   */
  var Style = function () {
     /**
     * A compability issue for jQuery 1.9+
     *
     * @param  {*}       obj     jQuery object
     * @param  {string}  method  A method to call
     * @param  {*}       args    Arguments
     * @returns  {*}
     * @private
     */
    var jqueryCustomCall = function (obj, method, args) {  // For better compability with jQuery < 1.9
      var i, arg, result = {}, $obj;
      $obj = $(obj);
      if (args instanceof Array) {
        for (i = 0; i < args.length; i++) {
          arg = args[i];
          result[arg] = $obj[method](arg);
        }
        return $.extend($obj, result);
      }
      return $obj[method].apply($obj, args);
    };  
  
  
    /**
     * paragraph level style
     *
     * @param {WrappedRange} rng
     * @param {Object} oStyle
     */
    this.stylePara = function (rng, oStyle) {
      $.each(rng.nodes(dom.isPara), function (idx, elPara) {
        $(elPara).css(oStyle);
      });
    };

    /**
     * get current style on cursor
     *
     * @param {WrappedRange} rng
     * @param {Element} elTarget - target element on event
     * @param {Object} - object contains style properties.
     */
    this.current = function (rng, elTarget) {
      var $cont = $(dom.isText(rng.sc) ? rng.sc.parentNode : rng.sc);
      var properties = ['font-size', 'text-align', 'list-style-type', 'line-height'];  // Compability with jQuery < 1.9
      var oStyle = jqueryCustomCall($cont, 'css', properties) || {};

      oStyle['font-size'] = parseInt(oStyle['font-size']);

      // document.queryCommandState for toggle state
      oStyle['font-bold'] = document.queryCommandState('bold') ? 'bold' : 'normal';
      oStyle['font-italic'] = document.queryCommandState('italic') ? 'italic' : 'normal';
      oStyle['font-underline'] = document.queryCommandState('underline') ? 'underline' : 'normal';

      // list-style-type to list-style(unordered, ordered)
      if (!rng.isOnList()) {
        oStyle['list-style'] = 'none';
      } else {
        var aOrderedType = ['circle', 'disc', 'disc-leading-zero', 'square'];
        var bUnordered = $.inArray(oStyle['list-style-type'], aOrderedType) > -1;
        oStyle['list-style'] = bUnordered ? 'unordered' : 'ordered';
      }

      var elPara = dom.ancestor(rng.sc, dom.isPara);
      if (elPara && elPara.style['line-height']) {
        oStyle['line-height'] = elPara.style.lineHeight;
      } else {
        var lineHeight = parseInt(oStyle['line-height']) / parseInt(oStyle['font-size']);
        oStyle['line-height'] = lineHeight.toFixed(1);
      }

      oStyle.image = dom.isImg(elTarget) && elTarget;
      oStyle.anchor = rng.isOnAnchor() && dom.ancestor(rng.sc, dom.isAnchor);
      oStyle.aAncestor = dom.listAncestor(rng.sc, dom.isEditable);

      return oStyle;
    };
  };

  return Style;
});
