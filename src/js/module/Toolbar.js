define([
  'summernote/core/list',
  'summernote/module/Button'
], function (list, Button) {
  /**
   * Toolbar
   */
  var Toolbar = function () {
    var button = new Button();

    this.update = function ($toolbar, oStyle) {
      button.update($toolbar, oStyle);
    };

    this.updateRecentColor = function (elBtn, sEvent, sValue) {
      button.updateRecentColor(elBtn, sEvent, sValue);
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

    this.updateFullscreen = function ($container, bFullscreen) {
      var $btn = $container.find('button[data-event="fullscreen"]');
      $btn.toggleClass('active', bFullscreen);
    };

    this.updateCodeview = function ($container, isCodeview) {
      var $btn = $container.find('button[data-event="codeview"]');
      $btn.toggleClass('active', isCodeview);
    };
  };

  return Toolbar;
});
