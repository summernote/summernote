define([
  'summernote/core/list'
], function (list) {
  /**
   * Button
   */
  var Button = function () {
    /**
     * update button status
     *
     * @param {jQuery} $container
     * @param {Object} oStyle
     */
    this.update = function ($container, oStyle) {
      /**
       * handle dropdown's check mark (for fontname, fontsize, lineHeight).
       * @param {jQuery} $btn
       * @param {Number} nValue
       */
      var checkDropdownMenu = function ($btn, nValue) {
        $btn.find('.dropdown-menu li a').each(function () {
          // always compare string to avoid creating another func.
          var isChecked = ($(this).data('value') + '') === (nValue + '');
          this.className = isChecked ? 'checked' : '';
        });
      };

      /**
       * update button state(active or not).
       *
       * @param {String} sSelector
       * @param {Function} pred
       */
      var btnState = function (sSelector, pred) {
        var $btn = $container.find(sSelector);
        $btn.toggleClass('active', pred());
      };

      // fontname
      var $fontname = $container.find('.note-fontname');
      if ($fontname.length) {
        var selectedFont = oStyle['font-family'];
        if (!!selectedFont) {
          selectedFont = list.head(selectedFont.split(','));
          selectedFont = selectedFont.replace(/\'/g, '');
          $fontname.find('.note-current-fontname').text(selectedFont);
          checkDropdownMenu($fontname, selectedFont);
        }
      }

      // fontsize
      var $fontsize = $container.find('.note-fontsize');
      $fontsize.find('.note-current-fontsize').text(oStyle['font-size']);
      checkDropdownMenu($fontsize, parseFloat(oStyle['font-size']));

      // lineheight
      var $lineHeight = $container.find('.note-height');
      checkDropdownMenu($lineHeight, parseFloat(oStyle['line-height']));

      btnState('button[data-event="bold"]', function () {
        return oStyle['font-bold'] === 'bold';
      });
      btnState('button[data-event="italic"]', function () {
        return oStyle['font-italic'] === 'italic';
      });
      btnState('button[data-event="underline"]', function () {
        return oStyle['font-underline'] === 'underline';
      });
      btnState('button[data-event="strikethrough"]', function () {
        return oStyle['font-strikethrough'] === 'strikethrough';
      });
      btnState('button[data-event="superscript"]', function () {
        return oStyle['font-superscript'] === 'superscript';
      });
      btnState('button[data-event="subscript"]', function () {
        return oStyle['font-subscript'] === 'subscript';
      });
      btnState('button[data-event="justifyLeft"]', function () {
        return oStyle['text-align'] === 'left' || oStyle['text-align'] === 'start';
      });
      btnState('button[data-event="justifyCenter"]', function () {
        return oStyle['text-align'] === 'center';
      });
      btnState('button[data-event="justifyRight"]', function () {
        return oStyle['text-align'] === 'right';
      });
      btnState('button[data-event="justifyFull"]', function () {
        return oStyle['text-align'] === 'justify';
      });
      btnState('button[data-event="insertUnorderedList"]', function () {
        return oStyle['list-style'] === 'unordered';
      });
      btnState('button[data-event="insertOrderedList"]', function () {
        return oStyle['list-style'] === 'ordered';
      });
    };

    /**
     * update recent color
     *
     * @param {Element} elBtn
     * @param {String} sEvent
     * @param {sValue} sValue
     */
    this.updateRecentColor = function (elBtn, sEvent, sValue) {
      var $color = $(elBtn).closest('.note-color');
      var $recentColor = $color.find('.note-recent-color');
      var oColor = JSON.parse($recentColor.attr('data-value'));
      oColor[sEvent] = sValue;
      $recentColor.attr('data-value', JSON.stringify(oColor));
      var sKey = sEvent === 'backColor' ? 'background-color' : 'color';
      $recentColor.find('i').css(sKey, sValue);
    };
  };

  return Button;
});
