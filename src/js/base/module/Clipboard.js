define([
  'summernote/base/core/list',
  'summernote/base/core/dom',
  'summernote/base/core/key',
  'summernote/base/core/agent'
], function (list, dom, key, agent) {
  var Clipboard = function (summernote) {
    var self = this;

    var $editable = summernote.layoutInfo.editable;
    var $paste;

    this.initialize = function () {
      // [workaround] getting image from clipboard
      //  - IE11 and Firefox: CTRL+v hook
      //  - Webkit: event.clipboardData
      if ((agent.isMSIE && agent.browserVersion > 10) || agent.isFF) {
        $paste = $('<div />').attr('contenteditable', true).css({
          position : 'absolute',
          left : -100000,
          opacity : 0
        });

        $editable.on('keydown', function (e) {
          if (e.ctrlKey && e.keyCode === key.code.V) {
            summernote.invoke('editor.saveRange');
            $paste.focus();

            setTimeout(function () {
              self.pasteByHook();
            }, 0);
          }
        });

        $editable.before($paste);
      } else {
        $editable.on('paste', this.pasteByEvent);
      }
    };

    this.pasteByHook = function () {
      var node = $paste[0].firstChild;

      if (dom.isImg(node)) {
        var dataURI = node.src;
        var decodedData = atob(dataURI.split(',')[1]);
        var array = new Uint8Array(decodedData.length);
        for (var i = 0; i < decodedData.length; i++) {
          array[i] = decodedData.charCodeAt(i);
        }

        var blob = new Blob([array], { type : 'image/png' });
        blob.name = 'clipboard.png';

        summernote.invoke('editor.restoreRange');
        summernote.invoke('editor.focus');
        summernote.invoke('imageDialog.insertImages', [blob]);
      } else {
        var pasteContent = $('<div />').html($paste.html()).html();
        summernote.invoke('editor.restoreRange');
        summernote.invoke('editor.focus');

        if (pasteContent) {
          summernote.invoke('editor.pasteHTML', pasteContent);
        }
      }

      $paste.empty();
    };

    /**
     * paste by clipboard event
     *
     * @param {Event} event
     */
    this.pasteByEvent = function (event) {
      var clipboardData = event.originalEvent.clipboardData;
      if (clipboardData && clipboardData.items && clipboardData.items.length) {
        var item = list.head(clipboardData.items);
        if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
          summernote.invoke('imageDialog.insertImages', [item.getAsFile()]);
        }
        summernote.invoke('editor.afterCommand');
      }
    };
  };

  return Clipboard;
});
