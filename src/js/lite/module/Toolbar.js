define([], function () {

  var Toolbar = function (summernote) {
    var renderer = $.summernote.renderer;
    var $editor = renderer.layoutInfo.editor; 
    var ui = renderer.layoutInfo.ui;

    var $toolbar = null;
    this.initialize = function () {

      var bold = new ui.Button({
        title : '<i class="icon-bold"></i>',
        click : function () {
          summernote.invoke('editor.bold');
        }
      });

      var italic = new ui.Button({
        title : '<i class="icon-italic"></i>',
        click : function () {
          summernote.invoke('editor.italic');
        }
      });

      var buttonGroup = new ui.ButtonGroup({
        name : 'font',
        children : [bold, italic]
      });

      $toolbar = new ui.Toolbar({
        className : 'note-toolbar',
        children : [ buttonGroup]
      });


      $editor.prepend($toolbar.render().instance);
    };

    this.destory = function () {
      $toolbar.destroy();
    };
  };

  return Toolbar;
});
