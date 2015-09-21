define([
  'summernote/base/core/key'
], function (key) {
  var LinkDialog = function (summernote) {
    var self = this;
    var ui = $.summernote.ui;

    var $editor = summernote.layoutInfo.editor;
    var options = summernote.options;

    this.initialize = function () {
      var $container = options.dialogsInBody ? $(document.body) : $editor;

      var body = '<div class="form-group">' +
                   '<label>Text to display</label>' +
                   '<input class="note-link-text input" type="text" />' +
                 '</div>' +
                 '<div class="form-group">' +
                   '<label>To what URL should this link go?</label>' +
                   '<input class="note-link-url input" type="text" value="http://" />' +
                 '</div>' +
                 (!options.disableLinkTarget ?
                   '<div class="checkbox">' +
                     '<label>' + '<input type="checkbox" checked> ' +
                       'Open in new window' +
                     '</label>' +
                   '</div>' : ''
                 );
      var footer = '<button href="#" class="btn focus note-link-btn disabled" disabled>Insert Link</button>';

      $container.append(ui.dialog({
        className: 'link-dialog',
        title: 'Insert Link',
        body: body,
        footer: footer
      }).render());

      this.$linkDialog = $container.find('.link-dialog');
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

    /**
     * Show link dialog and set event handlers on dialog controls.
     *
     * @param {Object} linkInfo
     * @return {Promise}
     */
    this.showLinkDialog = function (linkInfo) {
      return $.Deferred(function (deferred) {
        var $linkText = self.$linkDialog.find('.note-link-text'),
          $linkUrl = self.$linkDialog.find('.note-link-url'),
          $linkBtn = self.$linkDialog.find('.note-link-btn'),
          $openInNewWindow = self.$linkDialog.find('input[type=checkbox]');

        self.$linkDialog.jui('off', 'show');
        self.$linkDialog.jui('on', 'show', function () {
          $linkText.val(linkInfo.text);

          $linkText.on('input', function () {
            self.toggleBtn($linkBtn, $linkText.val() && $linkUrl.val());
            // if linktext was modified by keyup,
            // stop cloning text from linkUrl
            linkInfo.text = $linkText.val();
          });

          // if no url was given, copy text to url
          if (!linkInfo.url) {
            linkInfo.url = linkInfo.text || 'http://';
            self.toggleBtn($linkBtn, linkInfo.text);
          }

          $linkUrl.on('input', function () {
            self.toggleBtn($linkBtn, $linkText.val() && $linkUrl.val());
            // display same link on `Text to display` input
            // when create a new link
            if (!linkInfo.text) {
              $linkText.val($linkUrl.val());
            }
          }).val(linkInfo.url).trigger('focus').trigger('select');

          self.bindEnterKey($linkUrl, $linkBtn);
          self.bindEnterKey($linkText, $linkBtn);

          $openInNewWindow.prop('checked', linkInfo.isNewWindow);

          $linkBtn.one('click', function (event) {
            event.preventDefault();

            deferred.resolve({
              range: linkInfo.range,
              url: $linkUrl.val(),
              text: $linkText.val(),
              isNewWindow: $openInNewWindow.is(':checked')
            });
            self.$linkDialog.jui('hide');
          });
        });

        self.$linkDialog.jui('off', 'hide');
        self.$linkDialog.jui('on', 'hide', function () {
          // detach events
          $linkText.off('input keypress');
          $linkUrl.off('input keypress');
          $linkBtn.off('click');

          if (deferred.state() === 'pending') {
            deferred.reject();
          }
        });

        self.$linkDialog.jui('show');

      }).promise();
    };

    /**
     * @param {Object} layoutInfo
     */
    this.show = function () {
      var linkInfo = summernote.invoke('editor.getLinkInfo');

      summernote.invoke('editor.saveRange');
      this.showLinkDialog(linkInfo).then(function (linkInfo) {
        summernote.invoke('editor.restoreRange');
        summernote.invoke('editor.createLink', linkInfo);
      }).fail(function () {
        summernote.invoke('editor.restoreRange');
      });
    };
  };

  return LinkDialog;
});
