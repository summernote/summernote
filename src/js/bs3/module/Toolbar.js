define([
  'jquery'
], function ($) {
  var Toolbar = function (summernote) {
    var ui = $.summernote.ui;

    var $note = summernote.layoutInfo.note;
    var $toolbar = summernote.layoutInfo.toolbar;
    var options = summernote.options;

    this.initialize = function () {

      options.toolbar = options.toolbar || [];

      if (!options.toolbar.length) {
        $toolbar.hide();
      } else {
        this.makeToolbar();
      }
      $note.on('summernote.keyup summernote.mouseup summernote.change', function () {
        summernote.invoke('button.updateCurrentStyle');
      });

      summernote.invoke('button.updateCurrentStyle');
    };

    this.makeToolbar = function () {
      for (var groupIndex = 0, groupLength = options.toolbar.length; groupIndex < groupLength; groupIndex++) {
        var group = options.toolbar[groupIndex];
        var groupName = group[0];
        var buttonList = group[1];

        var $groupElement = ui.buttonGroup().render();
        $groupElement.addClass('note-' + groupName);

        for (var buttonIndex = 0, buttonLength = buttonList.length; buttonIndex < buttonLength; buttonIndex++) {
          var buttonName = buttonList[buttonIndex];
          var button = summernote.buttons[buttonName];

          if (button) {
            $groupElement.append(typeof button === 'function' ? button.call(this, summernote) : button);
          }

        }
        $toolbar.append($groupElement);
      }
    };

    this.destroy = function () {
      $toolbar.children().remove();
    };

  };

  return Toolbar;
});
