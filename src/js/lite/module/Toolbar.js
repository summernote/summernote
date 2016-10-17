define(function () {
  var Toolbar = function (context) {
    var ui = $.summernote.ui;
    var $toolbar = context.layoutInfo.toolbar;

    this.initialize = function () {
      ui.buttonGroup([
        ui.button({
          contents: 'bold',
          click: context.createInvokeHandler('editor.bold')
        }),
        ui.button({
          contents: 'italic',
          click: context.createInvokeHandler('editor.italic')
        })
      ]).render().appendTo($toolbar);
    };

    this.destroy = function () {
      $toolbar.children().remove();
    };
  };

  return Toolbar;
});
