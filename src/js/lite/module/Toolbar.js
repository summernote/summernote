define(function () {
  var Toolbar = function (context) {
    var ui = $.summernote.ui;
    var $toolbar = context.layoutInfo.toolbar;
    var options = context.options;

    this.initialize = function () {
      ui.buttonGroup([
        ui.button({
          container: options.container,
          contents: 'bold',
          click: context.createInvokeHandler('editor.bold')
        }),
        ui.button({
          container: options.container,
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
