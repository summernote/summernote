define([
  'summernote/lite/renderer'
], function (renderer) {

  var Toolbar = function (summernote) {
    var self = this;

    var $toolbar = summernote.layoutInfo.toolbar;

    this.initialize = function () {
      var $bold = renderer.button({
        name: 'bold'
      }).build().click(function () {
        summernote.invoke('editor.bold');
      });

      var $italic = renderer.button({
        name: 'italic'
      }).build().click(function () {
        summernote.invoke('editor.italic');
      });

      $toolbar.append($bold).append($italic);
    };

    this.destory = function () {
      $toolbar.children().remove();
    };
  };

  return Toolbar;
});
