import $ from 'jquery';
import env from '../core/env';
import key from '../core/key';
import func from '../core/func';

const MAILTO_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const TEL_PATTERN = /^(\+?\d{1,3}[\s-]?)?(\d{1,4})[\s-]?(\d{1,4})[\s-]?(\d{1,4})$/;
const URL_SCHEME_PATTERN = /^([A-Za-z][A-Za-z0-9+-.]*\:|#|\/)/;

export default class LinkDialog {
  constructor(context) {
    this.context = context;

    this.ui = $.summernote.ui;
    this.$body = $(document.body);
    this.$editor = context.layoutInfo.editor;
    this.options = context.options;
    this.lang = this.options.langInfo;

    context.memo('help.linkDialog.show', this.options.langInfo.help['linkDialog.show']);
  }

  initialize() {
    const $container = this.options.dialogsInBody ? this.$body : this.options.container;
    const body = [
      '<div class="form-group note-form-group">',
        `<label for="note-dialog-link-txt-${this.options.id}" class="note-form-label">${this.lang.link.textToDisplay}</label>`,
        `<input id="note-dialog-link-txt-${this.options.id}" class="note-link-text form-control note-form-control note-input" type="text"/>`,
      '</div>',
      '<div class="form-group note-form-group">',
        `<label for="note-dialog-link-url-${this.options.id}" class="note-form-label">${this.lang.link.url}</label>`,
        `<input id="note-dialog-link-url-${this.options.id}" class="note-link-url form-control note-form-control note-input" type="text" value="http://"/>`,
      '</div>',
      !this.options.disableLinkTarget
        ? $('<div></div>').append(this.ui.checkbox({
          className: 'sn-checkbox-open-in-new-window',
          text: this.lang.link.openInNewWindow,
          checked: true,
        }).render()).html()
        : '',
    ].join('');

    const buttonClass = 'btn btn-primary note-btn note-btn-primary note-link-btn';
    const footer = `<input type="button" href="#" class="${buttonClass}" value="${this.lang.link.insert}" disabled>`;

    this.$dialog = this.ui.dialog({
      className: 'link-dialog',
      title: this.lang.link.insert,
      fade: this.options.dialogsFade,
      body: body,
      footer: footer,
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

  checkLinkUrl(linkUrl) {
    if (MAILTO_PATTERN.test(linkUrl)) {
      return 'mailto://' + linkUrl;
    } else if (TEL_PATTERN.test(linkUrl)) {
      return 'tel://' + linkUrl;
    } else if (!URL_SCHEME_PATTERN.test(linkUrl)) {
      return 'http://' + linkUrl;
    }
    return linkUrl;
  }

  onCheckLinkUrl($input) {
    $input.on('blur', (event) => {
      event.target.value =
        event.target.value == '' ? '' : this.checkLinkUrl(event.target.value);
    });
  }

  /**
   * toggle update button
   */
  toggleLinkBtn($linkBtn, $linkText, $linkUrl) {
    this.ui.toggleBtn($linkBtn, $linkText.val() && $linkUrl.val());
  }

  /**
   * Show link dialog and set event handlers on dialog controls.
   *
   * @param {Object} linkInfo
   * @return {Promise}
   */
  showLinkDialog(linkInfo) {
    return $.Deferred((deferred) => {
      const $linkText = this.$dialog.find('.note-link-text');
      const $linkUrl = this.$dialog.find('.note-link-url');
      const $linkBtn = this.$dialog.find('.note-link-btn');
      const $openInNewWindow = this.$dialog
        .find('.sn-checkbox-open-in-new-window input[type=checkbox]');

      this.ui.onDialogShown(this.$dialog, () => {
        this.context.triggerEvent('dialog.shown');

        // If no url was given and given text is valid URL then copy that into URL Field
        if (!linkInfo.url && func.isValidUrl(linkInfo.text)) {
          linkInfo.url = this.checkLinkUrl(linkInfo.text);
        }

        $linkText.on('input paste propertychange', () => {
          // If linktext was modified by input events,
          // cloning text from linkUrl will be stopped.
          let text = $linkText.val();
          let div = document.createElement('div');
          div.innerText = text;
          text = div.innerHTML;
          linkInfo.text = text;
          this.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
        }).val(linkInfo.text);

        $linkUrl.on('input paste propertychange', () => {
          // Display same text on `Text to display` as default
          // when linktext has no text
          if (!linkInfo.text) {
            $linkText.val($linkUrl.val());
          }
          this.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
        }).val(linkInfo.url);

        if (!env.isSupportTouch) {
          $linkUrl.trigger('focus');
        }

        this.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
        this.bindEnterKey($linkUrl, $linkBtn);
        this.bindEnterKey($linkText, $linkBtn);
        this.onCheckLinkUrl($linkUrl);

        const isNewWindowChecked = linkInfo.isNewWindow !== undefined
          ? linkInfo.isNewWindow : this.context.options.linkTargetBlank;

        $openInNewWindow.prop('checked', isNewWindowChecked);

        $linkBtn.one('click', (event) => {
          event.preventDefault();

          deferred.resolve({
            range: linkInfo.range,
            url: $linkUrl.val(),
            text: $linkText.val(),
            isNewWindow: $openInNewWindow.is(':checked'),
          });
          this.ui.hideDialog(this.$dialog);
        });
      });

      this.ui.onDialogHidden(this.$dialog, () => {
        // detach events
        $linkText.off();
        $linkUrl.off();
        $linkBtn.off();

        if (deferred.state() === 'pending') {
          deferred.reject();
        }
      });

      this.ui.showDialog(this.$dialog);
    }).promise();
  }

  /**
   * @param {Object} layoutInfo
   */
  show() {
    const linkInfo = this.context.invoke('editor.getLinkInfo');

    this.context.invoke('editor.saveRange');
    this.showLinkDialog(linkInfo).then((linkInfo) => {
      this.context.invoke('editor.restoreRange');
      this.context.invoke('editor.createLink', linkInfo);
    }).fail(() => {
      this.context.invoke('editor.restoreRange');
    });
  }
}
