define([], function () {
  var Toolbar = function (summernote) {
    var self = this;
    var ui = $.summernote.ui;

    var $note = summernote.layoutInfo.note;
    var $toolbar = summernote.layoutInfo.toolbar;
    var options = summernote.options;

    this.initialize = function () {
      options.toolbar = options.toolbar || [];

      if (!options.toolbar.length) {
        $toolbar.hide();
      } else {
        summernote.buildButtons($toolbar, options.toolbar);
      }

      $note.on('summernote.keyup summernote.mouseup summernote.change', function () {
        summernote.invoke('button.updateCurrentStyle');
      });

      summernote.invoke('button.updateCurrentStyle');
    };

    this.destroy = function () {
      $toolbar.children().remove();
    };

    this.updateFullscreen = function (isFullscreen) {
      ui.toggleBtnActive($toolbar.find('.btn-fullscreen'), isFullscreen);
    };

    this.updateCodeview = function (isCodeview) {
      ui.toggleBtnActive($toolbar.find('.btn-codeview'), isCodeview);
      if (isCodeview) {
        this.deactivate();
      } else {
        this.activate();
      }
    };

    this.activate = function () {
      var $btn = $toolbar.find('button').not('.btn-codeview');
      ui.toggleBtn($btn, true);
    };

    this.deactivate = function () {
      var $btn = $toolbar.find('button').not('.btn-codeview');
      ui.toggleBtn($btn, false);
    };
  };

  return Toolbar;
});
