define([ ], function () {
  var Toolbar = function (summernote) {
    var $note = summernote.layoutInfo.note;
    var $toolbar = summernote.layoutInfo.toolbar;
    var options = summernote.options;

    this.initialize = function () {

      options.toolbar = options.toolbar || [];

      if (!options.toolbar.length) {
        $toolbar.hide();
      } else {
        summernote.generateButtons($toolbar, options.toolbar);
      }
      $note.on('summernote.keyup summernote.mouseup summernote.change', function () {
        summernote.invoke('button.updateCurrentStyle');
      });

      summernote.invoke('button.updateCurrentStyle');
    };

    this.destroy = function () {
      $toolbar.children().remove();
    };

  };

  return Toolbar;
});
