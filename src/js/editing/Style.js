define([
  'summernote/core/agent',
  'summernote/core/dom'
], function (agent, dom) {
  /**
   * Style
   * @class
   */
  var Style = function () {
    /**
     * passing an array of style properties to .css()
     * will result in an object of property-value pairs.
     * (compability with version < 1.9)
     *
     * @param  {jQuery} $obj
     * @param  {Array} propertyNames - An array of one or more CSS properties.
     * @returns {Object}
     */
    var jQueryCSS = function ($obj, propertyNames) {
      if (agent.jqueryVersion < 1.9) {
        var result = {};
        $.each(propertyNames, function (idx, propertyName) {
          result[propertyName] = $obj.css(propertyName);
        });
        return result;
      }
      return $obj.css.call($obj, propertyNames);
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
     * @return {Object} - object contains style properties.
     */
    this.current = function (rng, elTarget) {
      var $cont = $(dom.isText(rng.sc) ? rng.sc.parentNode : rng.sc);
      var properties = ['font-family', 'font-size', 'text-align', 'list-style-type', 'line-height'];
      var oStyle = jQueryCSS($cont, properties) || {};

      oStyle['font-size'] = parseInt(oStyle['font-size'], 10);

      // document.queryCommandState for toggle state
      oStyle['font-bold'] = document.queryCommandState('bold') ? 'bold' : 'normal';
      oStyle['font-italic'] = document.queryCommandState('italic') ? 'italic' : 'normal';
      oStyle['font-underline'] = document.queryCommandState('underline') ? 'underline' : 'normal';
      oStyle['font-strikethrough'] = document.queryCommandState('strikeThrough') ? 'strikethrough' : 'normal';
      oStyle['font-superscript'] = document.queryCommandState('superscript') ? 'superscript' : 'normal';
      oStyle['font-subscript'] = document.queryCommandState('subscript') ? 'subscript' : 'normal';

      // list-style-type to list-style(unordered, ordered)
      if (!rng.isOnList()) {
        oStyle['list-style'] = 'none';
      } else {
        var aOrderedType = ['circle', 'disc', 'disc-leading-zero', 'square'];
        var isUnordered = $.inArray(oStyle['list-style-type'], aOrderedType) > -1;
        oStyle['list-style'] = isUnordered ? 'unordered' : 'ordered';
      }

      var elPara = dom.ancestor(rng.sc, dom.isPara);
      if (elPara && elPara.style['line-height']) {
        oStyle['line-height'] = elPara.style.lineHeight;
      } else {
        var lineHeight = parseInt(oStyle['line-height'], 10) / parseInt(oStyle['font-size'], 10);
        oStyle['line-height'] = lineHeight.toFixed(1);
      }

      oStyle.image = dom.isImg(elTarget) && elTarget;
      oStyle.anchor = rng.isOnAnchor() && dom.ancestor(rng.sc, dom.isAnchor);
      oStyle.aAncestor = dom.listAncestor(rng.sc, dom.isEditable);
      oStyle.range = rng;

      return oStyle;
    };
  };

  return Style;
});
