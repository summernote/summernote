define(function () {
  var Toolbar = function (summernote) {
    var ui = $.summernote.ui;
    var $toolbar = summernote.layoutInfo.toolbar;

    this.initialize = function () {
      var $btnGroup = ui.buttonGroup([
        ui.button({
          contents: 'bold',
          click: function () {
            summernote.invoke('editor.bold');
          }
        }),
        ui.button({
          contents: 'italic',
          click: function () {
            summernote.invoke('editor.italic');
          }
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
