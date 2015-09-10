define([
  'summernote/base/core/key',
  'summernote/base/core/async'
], function (key, async) {
  var ImageDialog = function (summernote) {
    var self = this;
    var ui = $.summernote.ui;

    var $editor = summernote.layoutInfo.editor;
    var options = summernote.options;

    this.initialize = function () {
      var $container = options.dialogsInBody ? $(document.body) : $editor;

      var imageLimitation = '';
      if (options.maximumImageFileSize) {
        var unit = Math.floor(Math.log(options.maximumImageFileSize) / Math.log(1024));
        var readableSize = (options.maximumImageFileSize / Math.pow(1024, unit)).toFixed(2) * 1 +
                           ' ' + ' KMGTP'[unit] + 'B';
        imageLimitation = '<small>Maximum file size : ' + readableSize + '</small>';
      }

      var body = '<div class="form-group note-group-select-from-files">' +
                   '<label>Select from files</label>' +
                   '<input class="note-image-input form-control" type="file" name="files" accept="image/*" multiple="multiple" />' +
                   imageLimitation +
                 '</div>' +
                 '<div class="form-group">' +
                   '<label>Image URL</label>' +
                   '<input class="note-image-url form-control col-md-12" type="text" />' +
                 '</div>';
      var footer = '<button href="#" class="btn btn-primary note-image-btn disabled" disabled>Insert Image</button>';

      $container.append(ui.dialog({
        className: 'note-image-dialog',
        title: 'Insert Image',
        body: body,
        footer: footer
      }).render());

      this.$dialog = $container.find('.note-image-dialog');
    };

    this.toggleBtn = function ($btn, isEnable) {
      $btn.toggleClass('disabled', !isEnable);
      $btn.attr('disabled', !isEnable);
    };

    this.bindEnterKey = function ($input, $btn) {
      $input.on('keypress', function (event) {
        if (event.keyCode === key.code.ENTER) {
          $btn.trigger('click');
        }
      });
    };

    this.insertImages = function (files) {
      var callbacks = options.callbacks;

      // If onImageUpload options setted
      if (callbacks.onImageUpload) {
        summernote.triggerEvent('image.upload', [files]);
      // else insert Image as dataURL
      } else {
        $.each(files, function (idx, file) {
          var filename = file.name;
          if (options.maximumImageFileSize && options.maximumImageFileSize < file.size) {
            summernote.triggerEvent('image.upload.error', ['image.maximum.filesize.error']);
          } else {
            async.readFileAsDataURL(file).then(function (dataURL) {
              summernote.invoke('editor.insertImage', [dataURL, filename]);
            }).fail(function () {
              summernote.triggerEvent('image.upload.error');
            });
          }
        });
      }
    };

    this.show = function () {
      summernote.invoke('editor.saveRange');
      this.showImageDialog().then(function (data) {
        summernote.invoke('editor.restoreRange');

        if (typeof data === 'string') {
          // image url
          summernote.invoke('editor.insertImage', [data]);
        } else {
          // array of files
          self.insertImages(data);
        }
      }).fail(function () {
        summernote.invoke('editor.restoreRange');
      });
    };

    /**
     * show image dialog
     *
     * @param {jQuery} $dialog
     * @return {Promise}
     */
    this.showImageDialog = function () {
      return $.Deferred(function (deferred) {
        var $imageInput = self.$dialog.find('.note-image-input'),
            $imageUrl = self.$dialog.find('.note-image-url'),
            $imageBtn = self.$dialog.find('.note-image-btn');

        self.$dialog.one('shown.bs.modal', function () {
          // Cloning imageInput to clear element.
          $imageInput.replaceWith($imageInput.clone()
            .on('change', function () {
              deferred.resolve(this.files || this.value);
              self.$dialog.modal('hide');
            })
            .val('')
          );

          $imageBtn.click(function (event) {
            event.preventDefault();

            deferred.resolve($imageUrl.val());
            self.$dialog.modal('hide');
          });

          $imageUrl.on('keyup paste', function (event) {
            var url;
            
            if (event.type === 'paste') {
              url = event.originalEvent.clipboardData.getData('text');
            } else {
              url = $imageUrl.val();
            }
            
            self.toggleBtn($imageBtn, url);
          }).val('').trigger('focus');
          self.bindEnterKey($imageUrl, $imageBtn);
        }).one('hidden.bs.modal', function () {
          $imageInput.off('change');
          $imageUrl.off('keyup paste keypress');
          $imageBtn.off('click');

          if (deferred.state() === 'pending') {
            deferred.reject();
          }
        }).modal('show');
      });
    };
  };

  return ImageDialog;
});
