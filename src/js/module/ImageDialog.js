define([
  'summernote/core/key'
], function (key) {
  var ImageDialog = function (handler) {
    /**
     * toggle button status
     *
     * @private
     * @param {jQuery} $btn
     * @param {Boolean} isEnable
     */
    var toggleBtn = function ($btn, isEnable) {
      $btn.toggleClass('disabled', !isEnable);
      $btn.attr('disabled', !isEnable);
    };

    /**
     * bind enter key
     *
     * @private
     * @param {jQuery} $input
     * @param {jQuery} $btn
     */
    var bindEnterKey = function ($input, $btn) {
      $input.on('keypress', function (event) {
        if (event.keyCode === key.code.ENTER) {
          $btn.trigger('click');
        }
      });
    };

    this.show = function (layoutInfo) {
      var $dialog = layoutInfo.dialog(),
          $editable = layoutInfo.editable();

      handler.invoke('editor.saveRange', $editable);
      this.showImageDialog($editable, $dialog).then(function (data) {
        handler.invoke('editor.restoreRange', $editable);

        if (typeof data === 'string') {
          // image url
          handler.invoke('editor.insertImage', $editable, data);
        } else {
          // array of files
          handler.insertImages(layoutInfo, data);
        }
      }).fail(function () {
        handler.invoke('editor.restoreRange', $editable);
      });
    };

    /**
     * show image dialog
     *
     * @param {jQuery} $editable
     * @param {jQuery} $dialog
     * @return {Promise}
     */
    this.showImageDialog = function ($editable, $dialog) {
      return $.Deferred(function (deferred) {
        var $imageDialog = $dialog.find('.note-image-dialog').clone();
        $('body').append($imageDialog);

        var $imageInput = $dialog.find('.note-image-input'),
            $imageUrl = $dialog.find('.note-image-url'),
            $imageBtn = $dialog.find('.note-image-btn');

        $imageDialog.one('shown.bs.modal', function () {
          // Cloning imageInput to clear element.
          $imageInput.replaceWith($imageInput.clone()
            .on('change', function () {
              deferred.resolve(this.files || this.value);
              $imageDialog.modal('hide');
            })
            .val('')
          );

          $imageBtn.click(function (event) {
            event.preventDefault();

            deferred.resolve($imageUrl.val());
            $imageDialog.modal('hide');
          });

          $imageUrl.on('keyup paste', function (event) {
            var url;

            if (event.type === 'paste') {
              url = event.originalEvent.clipboardData.getData('text');
            } else {
              url = $imageUrl.val();
            }

            toggleBtn($imageBtn, url);
          }).val('').trigger('focus');
          bindEnterKey($imageUrl, $imageBtn);

          $imageDialog.find('.close').click(function (event) {
            event.preventDefault();
            $imageDialog.modal('hide');
          });
        }).one('hidden.bs.modal', function () {
          $imageInput.off('change');
          $imageUrl.off('keyup paste keypress');
          $imageBtn.off('click');

          if (deferred.state() === 'pending') {
            deferred.reject();
          }
          $imageDialog.remove();
        }).modal('show');
        // used for dialog stack
        if ($('.modal-backdrop').length > 1) {
          var $maskLast = $('.modal-backdrop:last'), idx = $maskLast.css('z-index');
          $maskLast.css('z-index', parseInt(idx, 10) + 20);
          var $dialogLast = $('.modal:last'), didx = $dialogLast.css('z-index');
          $dialogLast.css('z-index', parseInt(didx, 10) + 20);
        }
      });
    };
  };

  return ImageDialog;
});
