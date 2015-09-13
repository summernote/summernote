define(function () {
  var Toolbar = function (summernote) {
    var ui = $.summernote.ui;
    var $toolbar = summernote.layoutInfo.toolbar;

    this.initialize = function () {
      var $btnGroup = ui.buttonGroup([
        ui.button({
          contents: 'bold',
          click: summernote.createInvokeHandler('editor.bold')
        }),
        ui.button({
          contents: 'italic',
          click: summernote.createInvokeHandler('editor.italic')
        })
      ]).render();

      $toolbar.append($btnGroup);
    };

    this.destroy = function () {
      $toolbar.children().remove();
    };
  };

  return Toolbar;
});
