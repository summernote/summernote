define([
  'jquery',
  'summernote/base/core/agent'
], function ($, agent) {
  var HelpDialog = function (context) {
    var self = this;
    var ui = $.summernote.ui;

    var $editor = context.layoutInfo.editor;
    var options = context.options;
    var lang = options.langInfo;


    this.createShortCutList = function () {
      var keyMap = options.keyMap[agent.isMac ? 'mac' : 'pc'];

      var $list = $('<div />');

      Object.keys(keyMap).forEach(function (keyString) {
        var $row = $('<div class="help-list-item"/>');

        var command = keyMap[keyString];
        var str = context.memo('help.' + command) ? context.memo('help.' + command) : command;
        var $keyString = $('<label />').css({
          'width': 180,
          'max-width': 200,
          'margin-right': 10
        }).html(keyString);
        var $description = $('<span />').html(str);

        $row.html($keyString).append($description);

        $list.append($row);
      });

      return $list.html();
    };

    this.initialize = function () {
      var $container = options.dialogsInBody ? $(document.body) : $editor;

      var body = [
        '<p class="text-center">',
        '<a href="//summernote.org/" target="_blank">Summernote @VERSION</a> · ',
        '<a href="//github.com/summernote/summernote" target="_blank">Project</a> · ',
        '<a href="//github.com/summernote/summernote/issues" target="_blank">Issues</a>',
        '</p>'
      ].join('');

      this.$dialog = ui.dialog({
        title: lang.options.help,
        body: this.createShortCutList(),
        footer: body,
        callback: function ($node) {
          $node.find('.modal-body').css({
            'max-height': 300,
            'overflow': 'scroll'
          });
        }
      }).render().appendTo($container);
    };

    this.destroy = function () {
      ui.hideDialog(this.$dialog);
      this.$dialog.remove();
    };

    /**
     * show help dialog
     *
     * @return {Promise}
     */
    this.showHelpDialog = function () {
      return $.Deferred(function (deferred) {
        ui.onDialogHidden(self.$dialog, function () {
          context.triggerEvent('dialog.shown');
          deferred.resolve();
        });
        ui.showDialog(self.$dialog);
      }).promise();
    };

    this.show = function () {
      context.invoke('editor.saveRange');
      this.showHelpDialog().then(function () {
        context.invoke('editor.restoreRange');
      });
    };
  };

  return HelpDialog;
});
