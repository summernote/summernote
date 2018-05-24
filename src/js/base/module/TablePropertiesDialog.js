import $ from 'jquery';
import key from '../core/key';
import dom from '../core/dom';

export default class TablePropertiesDialog {
  constructor(context) {
    this.context = context;
    this.ui = $.summernote.ui;
    this.$body = $(document.body);
    this.$editor = context.layoutInfo.editor;
    this.options = context.options;
    this.lang = this.options.langInfo;

    context.memo('help.tableProperties.show', this.options.langInfo.help['tableProperties.show']);
  }

  initialize() {
    const $container = this.options.dialogsInBody ? this.$body : this.$editor;

    const body = '<div class="row">' +
        '<div class="form-group col-md-6">' +
        '<label>' + this.lang.table.border + '</label>' +
        '<input class="note-table-border form-control" type="text" value="" />' +
        '</div>' +
        '<div class="form-group col-md-6">' +
        '<label>' + this.lang.table.width + '</label>' +
        '<input class="note-table-width form-control" type="text" value="" />' +
        '</div>' +
        '<div class="form-group col-md-6">' +
        '<label>' + this.lang.table.bordercolor + '</label>' +
        '<input class="note-table-bordercolor form-control" name="bordercolor" type="color" value="#ffffff" />' +
        '</div>' +
        '<div class="form-group col-md-6">' +
        '<label>' + this.lang.table.backgrundcolor + '</label>' +
        '<input class="note-table-backgroundColor form-control" name="backgroundcolor" type="color" value="#ffffff" />' +
        '</div>' +
        '</div>';

    const footer = '<button href="#" class="btn btn-primary note-table-btn">' + this.lang.table.saveProperties + '</button>';

    this.$dialog = this.ui.dialog({
      className: 'table-dialog',
      title: this.lang.table.insert,
      fade: this.options.dialogsFade,
      body: body,
      footer: footer
    }).render().appendTo($container);
  }

  destroy() {
    this.ui.hideDialog(this.$dialog);
    this.$dialog.remove();
  }

  bindEnterKey($input, $btn) {
    $input.on('keypress', (event) => {
      if (event.keyCode === key.code.ENTER) {
        event.preventDefault();
        $btn.trigger('click');
      }
    });
  }

  /**
   * Show TableProperties dialog and set event handlers on dialog controls.
   *
   * @param {Object} tablePropertiesInfo
   * @return {Promise}
   */
  showTablePropertiesDialog(tablePropertiesInfo) {
    $(document).find('.note-table-popover').hide();
    return $.Deferred((deferred) => {
      const rng = tablePropertiesInfo.range;
      const cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      const table = dom.ancestor(cell, dom.isTable);
      const $tableBorder = this.$dialog.find('.note-table-border');
      const $tableWidth = this.$dialog.find('.note-table-width');
      const $tableBackgroundColor = this.$dialog.find('.note-table-backgroundColor');
      const $tableBorderColor = this.$dialog.find('.note-table-bordercolor');
      const $tableBtn = this.$dialog.find('.note-table-btn');

      if (table) {
        $tableWidth.val($(table).attr('width') ? $(table).attr('width') : '100%');
        $tableBorder.val($(table).attr('border') ? $(table).attr('border') : 1);
        $tableBackgroundColor.val($(table).attr('bgcolor') ? $(table).attr('bgcolor') : '#FFFFFF');
        $tableBorderColor.val($(table).attr('data-bordercolor') ? $(table).attr('data-bordercolor') : '#d4d4d4');
      }

      this.ui.onDialogShown(this.$dialog, () => {
        this.context.triggerEvent('dialog.shown');
        this.context.triggerEvent('dialog.shown');
        this.bindEnterKey($tableBorder, $tableBtn);
        $tableBtn.one('click', (event) => {
          event.preventDefault();

          deferred.resolve({
            range: tablePropertiesInfo.range,
            border: parseInt($tableBorder.val()),
            width: $tableWidth.val(),
            bgcolor: $tableBackgroundColor.val(),
            bordercolor: $tableBorderColor.val(),
            isNewWindow: true
          });
          this.ui.hideDialog(this.$dialog);
        });
      });

      this.ui.onDialogHidden(this.$dialog, () => {
        // detach events
        $tableBorder.off('input keypress');
        $tableBtn.off('click');

        if (deferred.state() === 'pending') {
          deferred.reject();
        }
      });

      this.ui.showDialog(this.$dialog);
    }).promise();
  }

  /**
   * @param {Object} tablePropertiesInfo
   */
  show() {
    const tablePropertiesInfo = this.context.invoke('editor.getTablePropertiesInfo');

    this.context.invoke('editor.saveRange');
    this.showTablePropertiesDialog(tablePropertiesInfo).then((tablePropertiesInfo) => {
      this.context.invoke('editor.restoreRange');
      this.context.invoke('editor.setTableProperties', tablePropertiesInfo);
    }).fail(() => {
      this.context.invoke('editor.restoreRange');
    });
  }
}
