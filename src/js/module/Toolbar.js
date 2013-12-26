define('module/Toolbar', function () {
  /**
   * Toolbar
   */
  var Toolbar = function () {
    this.update = function ($toolbar, oStyle) {
      //handle selectbox for fontsize, lineHeight
      var checkDropdownMenu = function ($btn, nValue) {
        $btn.find('.dropdown-menu li a').each(function () {
          var bChecked = parseFloat($(this).data('value')) === nValue;
          this.className = bChecked ? 'checked' : '';
        });
      };

      var $fontsize = $toolbar.find('.note-fontsize');
      $fontsize.find('.note-current-fontsize').html(oStyle['font-size']);
      checkDropdownMenu($fontsize, parseFloat(oStyle['font-size']));

      var $lineHeight = $toolbar.find('.note-height');
      checkDropdownMenu($lineHeight, parseFloat(oStyle['line-height']));

      //check button state
      var btnState = function (sSelector, pred) {
        var $btn = $toolbar.find(sSelector);
        $btn[pred() ? 'addClass' : 'removeClass']('active');
      };

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
      $btn[bFullscreen ? 'addClass' : 'removeClass']('active');
    };
    this.updateCodeview = function ($toolbar, bCodeview) {
      var $btn = $toolbar.find('button[data-event="codeview"]');
      $btn[bCodeview ? 'addClass' : 'removeClass']('active');
    };

    this.enable = function ($toolbar) {
      $toolbar.find('button').not('button[data-event="codeview"]').removeClass('disabled');
    };

    this.disable = function ($toolbar) {
      $toolbar.find('button').not('button[data-event="codeview"]').addClass('disabled');
    };
  };

  return Toolbar;
});
