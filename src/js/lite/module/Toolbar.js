define(function () {
  var Toolbar = function (summernote) {
    var renderer = $.summernote.renderer;
    var $toolbar = summernote.layoutInfo.toolbar;

    this.initialize = function () {
      var $btnGroup = renderer.buttonGroup([
        renderer.button({
          contents: 'bold',
          click: function () {
            summernote.invoke('editor.bold');
          }
        }),
        renderer.button({
          contents: 'italic',
          click: function () {
            summernote.invoke('editor.italic');
          }
        })
      ]).build();

      $toolbar.append($btnGroup);
    };

    this.destory = function () {
      $toolbar.children().remove();
    };
  };

  return Toolbar;
});
