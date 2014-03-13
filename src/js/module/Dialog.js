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
      $btn.toggleClass('disabled', !bEnable);
      $btn.attr('disabled', !bEnable);
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
        var $imageDialog = $dialog.find('.note-image-dialog');

        var $imageInput = $dialog.find('.note-image-input'),
            $imageUrl = $dialog.find('.note-image-url'),
            $imageBtn = $dialog.find('.note-image-btn');

        $imageDialog.one('shown.bs.modal', function (event) {
          event.stopPropagation();

          // Cloning imageInput to clear element.
          $imageInput.replaceWith($imageInput.clone()
            .on('change', function () {
              $imageDialog.modal('hide');
              deferred.resolve(this.files);
            })
          );

          $imageBtn.click(function (event) {
            event.preventDefault();

            $imageDialog.modal('hide');
            deferred.resolve($imageUrl.val());
          });

          $imageUrl.keyup(function () {
            toggleBtn($imageBtn, $imageUrl.val());
          }).val('').focus();
        }).one('hidden.bs.modal', function (event) {
          event.stopPropagation();

          $editable.focus();
          $imageInput.off('change');
          $imageUrl.off('keyup');
          $imageBtn.off('click');
        }).modal('show');
      });
    };

    /**
     * Show video dialog and set event handlers on dialog controls.
     *
     * @param {jQuery} $dialog 
     * @param {Object} videoInfo 
     * @return {Promise}
     */
    this.showVideoDialog = function ($editable, $dialog, videoInfo) {
      return $.Deferred(function (deferred) {
        var $videoDialog = $dialog.find('.note-video-dialog');
        var $videoUrl = $videoDialog.find('.note-video-url'),
            $videoBtn = $videoDialog.find('.note-video-btn');

        $videoDialog.one('shown.bs.modal', function (event) {
          event.stopPropagation();

          $videoUrl.val(videoInfo.text).keyup(function () {
            toggleBtn($videoBtn, $videoUrl.val());
          }).trigger('keyup').trigger('focus');

          $videoBtn.click(function (event) {
            event.preventDefault();

            $videoDialog.modal('hide');
            deferred.resolve($videoUrl.val());
          });
        }).one('hidden.bs.modal', function (event) {
          event.stopPropagation();

          $editable.focus();
          $videoUrl.off('keyup');
          $videoBtn.off('click');
        }).modal('show');
      });
    };

    /**
     * Show link dialog and set event handlers on dialog controls.
     *
     * @param {jQuery} $dialog
     * @param {Object} linkInfo
     * @return {Promise}
     */
    this.showLinkDialog = function ($editable, $dialog, linkInfo) {
      return $.Deferred(function (deferred) {
        var $linkDialog = $dialog.find('.note-link-dialog');

        var $linkText = $linkDialog.find('.note-link-text'),
        $linkUrl = $linkDialog.find('.note-link-url'),
        $linkBtn = $linkDialog.find('.note-link-btn'),
        $openInNewWindow = $linkDialog.find('input[type=checkbox]');

        $linkDialog.one('shown.bs.modal', function (event) {
          event.stopPropagation();

          $linkText.val(linkInfo.text);

          $linkUrl.keyup(function () {
            toggleBtn($linkBtn, $linkUrl.val());
            // display same link on `Text to display` input
            // when create a new link
            if (!linkInfo.text) {
              $linkText.val($linkUrl.val());
            }
          }).val(linkInfo.url).trigger('focus');

          $openInNewWindow.prop('checked', linkInfo.newWindow);

          $linkBtn.one('click', function (event) {
            event.preventDefault();

            $linkDialog.modal('hide');
            deferred.resolve($linkUrl.val(), $openInNewWindow.is(':checked'));
          });
        }).one('hidden.bs.modal', function (event) {
          event.stopPropagation();

          $editable.focus();
          $linkUrl.off('keyup');
        }).modal('show');
      }).promise();
    };

    /**
     * show help dialog
     *
     * @param {jQuery} $dialog
     */
    this.showHelpDialog = function ($editable, $dialog) {
      var $helpDialog = $dialog.find('.note-help-dialog');

      $helpDialog.one('hidden.bs.modal', function (event) {
        event.stopPropagation();
        $editable.focus();
      }).modal('show');
    };
  };

  return Dialog;
});
