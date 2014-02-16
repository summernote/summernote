define('module/Dialog', function () {
  /**
   * Dialog 
   *
   * @class
   */
  var Dialog = function () {

    /**
     * toggle button status
     *
     * @param {jQuery} $btn
     * @param {Boolean} bEnable
     */
    var toggleBtn = function ($btn, bEnable) {
      if (bEnable) {
        $btn.removeClass('disabled').attr('disabled', false);
      } else {
        $btn.addClass('disabled').attr('disabled', true);
      }
    };

    /**
     * show image dialog
     *
     * @param {jQuery} $dialog
     * @param {Function} fnInsertImages 
     * @param {Function} fnInsertImage 
     */
    this.showImageDialog = function ($editable, $dialog, fnInsertImages, fnInsertImage) {
      var $imageDialog = $dialog.find('.note-image-dialog');

      var $imageInput = $dialog.find('.note-image-input'),
          $imageUrl = $dialog.find('.note-image-url'),
          $imageBtn = $dialog.find('.note-image-btn');

      $imageDialog.one('shown.bs.modal', function () {
        $imageInput.on('change', function () {
          fnInsertImages(this.files);
          $(this).val('');
          $imageDialog.modal('hide');
        });

        $imageBtn.click(function (event) {
          $imageDialog.modal('hide');
          fnInsertImage($imageUrl.val());
          event.preventDefault();
        });

        $imageUrl.keyup(function () {
          toggleBtn($imageBtn, $imageUrl.val());
        }).val('').focus();
      }).one('hidden.bs.modal', function () {
        $editable.focus();
        $imageInput.off('change');
        $imageUrl.off('keyup');
        $imageBtn.off('click');
      }).modal('show');
    };

    /**
     * Show video dialog and set event handlers on dialog controls.
     *
     * @param {jQuery} $dialog 
     * @param {Object} videoInfo 
     * @param {Function} callback 
     */
    this.showVideoDialog = function ($editable, $dialog, videoInfo, callback) {
      var $videoDialog = $dialog.find('.note-video-dialog');
      var $videoUrl = $videoDialog.find('.note-video-url'),
          $videoBtn = $videoDialog.find('.note-video-btn');

      $videoDialog.one('shown.bs.modal', function () {
        $videoUrl.val(videoInfo.text).keyup(function () {
          toggleBtn($videoBtn, $videoUrl.val());
        }).trigger('keyup').trigger('focus');

        $videoBtn.click(function (event) {
          $videoDialog.modal('hide');
          callback($videoUrl.val());
          event.preventDefault();
        });
      }).one('hidden.bs.modal', function () {
        $editable.focus();
        $videoUrl.off('keyup');
        $videoBtn.off('click');
      }).modal('show');
    };

    /**
     * Show link dialog and set event handlers on dialog controls.
     *
     * @param {jQuery} $dialog
     * @param {Object} linkInfo
     * @param {function} callback
     */
    this.showLinkDialog = function ($editable, $dialog, linkInfo, callback) {
      var $linkDialog = $dialog.find('.note-link-dialog');

      var $linkText = $linkDialog.find('.note-link-text'),
          $linkUrl = $linkDialog.find('.note-link-url'),
          $linkBtn = $linkDialog.find('.note-link-btn'),
          $openInNewWindow = $linkDialog.find('input[type=checkbox]');

      $linkDialog.one('shown.bs.modal', function () {
        $linkText.val(linkInfo.text);

        $linkUrl.val(linkInfo.url).keyup(function () {
          toggleBtn($linkBtn, $linkUrl.val());

          // If create a new link, display same link on `Text to display` input.
          if (!linkInfo.text) {
            $linkText.val($linkUrl.val());
          }
        }).trigger('focus');

        $openInNewWindow.prop('checked', linkInfo.newWindow);

        $linkBtn.click(function (event) {
          $linkDialog.modal('hide');
          callback($linkUrl.val(), $openInNewWindow.is(':checked'));

          event.preventDefault();
        });
      }).one('hidden.bs.modal', function () {
        $editable.focus();
        $linkUrl.off('keyup');
        $linkBtn.off('click');
      }).modal('show');
    };

    /**
     * show help dialog
     *
     * @param {jQuery} $dialog
     */
    this.showHelpDialog = function ($editable, $dialog) {
      var $helpDialog = $dialog.find('.note-help-dialog');

      $helpDialog.one('hidden.bs.modal', function () {
        $editable.focus();
      }).modal('show');
    };
  };

  return Dialog;
});
