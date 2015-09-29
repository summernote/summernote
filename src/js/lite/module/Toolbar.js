define(function () {
  var Toolbar = function (summernote) {
    var ui = $.summernote.ui;
    var $toolbar = summernote.layoutInfo.toolbar;

    this.initialize = function () {
      ui.buttonGroup([
        ui.button({
          contents: 'bold',
          click: summernote.createInvokeHandler('editor.bold')
        }),
        ui.button({
          contents: 'italic',
          click: summernote.createInvokeHandler('editor.italic')
        })
      ]).render().appendTo($toolbar);
    };

    this.destroy = function () {
      $toolbar.children().remove();
    };
  };

  return Toolbar;
});
