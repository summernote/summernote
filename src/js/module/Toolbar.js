define([
  'core/list'
], function (list) {
  /**
   * Toolbar
   */
  var Toolbar = function () {
    /**
     * update button status
     *
     * @param {jQuery} $toolbar
     * @param {Object} oStyle
     */
    this.update = function ($toolbar, oStyle) {

      /**
       * handle dropdown's check mark (for fontname, fontsize, lineHeight).
       * @param {jQuery} $btn
       * @param {Number} nValue
       */
      var checkDropdownMenu = function ($btn, nValue) {
        $btn.find('.dropdown-menu li a').each(function () {
          // always compare string to avoid creating another func.
          var bChecked = ($(this).data('value') + '') === (nValue + '');
          this.className = bChecked ? 'checked' : '';
        });
      };

      /**
       * update button state(active or not).
       *
       * @param {String} sSelector
       * @param {Function} pred
       */
      var btnState = function (sSelector, pred) {
        var $btn = $toolbar.find(sSelector);
        $btn.toggleClass('active', pred());
      };

      // fontname
      var $fontname = $toolbar.find('.note-fontname');
      if ($fontname.length > 0) {
        var selectedFont = oStyle['font-family'];
        if (!!selectedFont) {
          selectedFont = list.head(selectedFont.split(','));
          selectedFont = selectedFont.replace(/\'/g, '');
          $fontname.find('.note-current-fontname').text(selectedFont);
          checkDropdownMenu($fontname, selectedFont);
        }
      }

      // fontsize
      var $fontsize = $toolbar.find('.note-fontsize');
      $fontsize.find('.note-current-fontsize').text(oStyle['font-size']);
      checkDropdownMenu($fontsize, parseFloat(oStyle['font-size']));

      // lineheight
      var $lineHeight = $toolbar.find('.note-height');
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

    this.updateFullscreen = function ($toolbar, bFullscreen) {
      var $btn = $toolbar.find('button[data-event="fullscreen"]');
      $btn.toggleClass('active', bFullscreen);
    };

    this.updateCodeview = function ($toolbar, bCodeview) {
      var $btn = $toolbar.find('button[data-event="codeview"]');
      $btn.toggleClass('active', bCodeview);
    };

    /**
     * activate buttons exclude codeview
     * @param {jQuery} $toolbar
     */
    this.activate = function ($toolbar) {
      $toolbar.find('button').not('button[data-event="codeview"]').removeClass('disabled');
    };

    /**
     * deactivate buttons exclude codeview
     * @param {jQuery} $toolbar
     */
    this.deactivate = function ($toolbar) {
      $toolbar.find('button').not('button[data-event="codeview"]').addClass('disabled');
    };
  };

  return Toolbar;
});
