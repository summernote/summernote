define([], function () {
  var Toolbar = function (context) {
    var ui = $.summernote.ui;

    var $note = context.layoutInfo.note;
    var $toolbar = context.layoutInfo.toolbar;
    var options = context.options;

    this.initialize = function () {
      if (options.airMode) {
        return;
      }

      options.toolbar = options.toolbar || [];

      if (!options.toolbar.length) {
        $toolbar.hide();
      } else {
        context.buildButtons($toolbar, options.toolbar);
      }

      $note.on('summernote.keyup summernote.mouseup summernote.change', function () {
        context.invoke('button.updateCurrentStyle');
      });

      context.invoke('button.updateCurrentStyle');
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
