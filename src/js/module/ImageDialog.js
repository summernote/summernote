import $$ from '../core/dom-query.js';
import env from '../core/env';
import key from '../core/key';

export default class ImageDialog {
  constructor(context) {
    this.context = context;
    this.ui = $$.summernote.ui;
    this.$body = $$(document.body);
    this.$editor = context.layoutInfo.editor;
    this.options = context.options;
    this.lang = this.options.langInfo;
  }

  initialize() {
    let imageLimitation = '';
    const imageInputId = 'note-dialog-image-file-' + this.options.id;
    if (this.options.maximumImageFileSize) {
      const unit = Math.floor(Math.log(this.options.maximumImageFileSize) / Math.log(1024));
      const readableSize = (this.options.maximumImageFileSize / Math.pow(1024, unit)).toFixed(2) * 1 +
                          ' ' + ' KMGTP'[unit] + 'B';
      imageLimitation = `<div class="note-image-dialog-help text-muted">${this.lang.image.maximumFileSize + ' : ' + readableSize}</div>`;
    }

    const $container = this.options.dialogsInBody ? this.$body : this.options.container;
    const buttonClass = 'btn btn-primary note-btn note-btn-primary note-image-btn';
    const body = [
      '<div class="note-image-dialog">',
        '<div class="form-group note-form-group note-group-select-from-files">',
          '<label for="' + imageInputId + '" class="note-form-label">' + this.lang.image.selectFromFiles + '</label>',
          '<input id="' + imageInputId + '" class="note-image-input form-control note-form-control note-input"',
          ' type="file" name="files" accept="' + this.options.acceptImageFileTypes + '" multiple="multiple"',
          ' aria-label="' + this.lang.image.selectFromFiles + '"/>',
          '<div class="note-image-dialog-file-name text-muted" aria-live="polite"></div>',
          imageLimitation,
        '</div>',
        '<div class="note-image-dialog-divider" aria-hidden="true"></div>',
        '<div class="form-group note-form-group note-group-image-url">',
          '<label for="note-dialog-image-url-' + this.options.id + '" class="note-form-label">' + this.lang.image.url + '</label>',
          '<input id="note-dialog-image-url-' + this.options.id + '" class="note-image-url form-control note-form-control note-input" type="url" placeholder="https://"/>',
        '</div>',
      '</div>',
    ].join('');
    const footer = `<button type="button" class="${buttonClass}" disabled>${this.lang.image.insert}</button>`;

    this.$dialog = this.ui.dialog({
      className: 'note-image-dialog-modal',
      title: this.lang.image.insert,
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

  show() {
    this.context.invoke('editor.saveRange');
    this.showImageDialog().then((data) => {
      // [workaround] hide dialog before restore range for IE range focus
      this.ui.hideDialog(this.$dialog);
      this.context.invoke('editor.restoreRange');

      if (typeof data === 'string') { // image url
        // If onImageLinkInsert set,
        if (this.options.callbacks.onImageLinkInsert) {
          this.context.triggerEvent('image.link.insert', data);
        } else {
          this.context.invoke('editor.insertImage', data);
        }
      } else { // array of files
        this.context.invoke('editor.insertImagesOrCallback', data);
      }
    }).catch(() => {
      this.context.invoke('editor.restoreRange');
    });
  }

  /**
   * show image dialog
   *
   * @return {Promise}
   */
  showImageDialog() {
    return new Promise((resolve, reject) => {
      let isSettled = false;
      const $imageInput = this.$dialog.find('.note-image-input');
      const $imageFileName = this.$dialog.find('.note-image-dialog-file-name');
      const $imageUrl = this.$dialog.find('.note-image-url');
      const $imageBtn = this.$dialog.find('.note-image-btn');

      this.ui.onDialogShown(this.$dialog, () => {
        this.context.triggerEvent('dialog.shown');

        $imageInput.off('change').val('').on('change', (event) => {
          const files = Array.from(event.target.files || []);
          if (!files.length) {
            $imageFileName.text('');
            return;
          }

          $imageFileName.text(files.map((file) => file.name).join(', '));
          isSettled = true;
          resolve(files);
        });

        $imageUrl.off().on('input paste propertychange', () => {
          this.ui.toggleBtn($imageBtn, $imageUrl.val().trim());
        }).val('');

        if (!env.isSupportTouch) {
          $imageUrl.trigger('focus');
        }

        $imageBtn.on('click', (event) => {
          event.preventDefault();
          isSettled = true;
          resolve($imageUrl.val().trim());
        });

        this.bindEnterKey($imageUrl, $imageBtn);
      });

      this.ui.onDialogHidden(this.$dialog, () => {
        $imageInput.off();
        $imageUrl.off();
        $imageBtn.off();
        $imageFileName.text('');

        if (!isSettled) {
          isSettled = true;
          reject();
        }
      });

      this.ui.showDialog(this.$dialog);
    });
  }
}
