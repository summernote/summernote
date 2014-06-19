define('summernote/editing/PasteWord', function () {
  /**
   * PasteWord
   */
  var PasteWord = (function () {

    /**
     * formatInput removes all MS Word formatting
     *
     * Original source/author:
     * http://patisserie.keensoftware.com/en/pages/remove-word-formatting-from-rich-text-editor-with-javascript
     *
     * @param {String} sInput
     * @return {String} Reformatted input
     */
    var formatInput = function (sInput) {

      // 1. remove line breaks / Mso classes
      var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g;
      var output = sInput.replace(stringStripper, ' ');

      // 2. strip Word generated HTML comments
      var commentSripper = new RegExp('<!--(.*?)-->', 'g');
      output = output.replace(commentSripper, '');

      // 3. remove tags leave content if any
      var tagStripper = new RegExp('<(/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>', 'gi');
      output = output.replace(tagStripper, '');

      // 4. Remove everything in between and including tags '<style(.)style(.)>'
      var badTags = ['style', 'script', 'applet', 'embed', 'noframes', 'noscript'];

      for (var i = 0; i < badTags.length; i++) {
        tagStripper = new RegExp('<' + badTags[i] + '.*?' + badTags[i] + '(.*?)>', 'gi');
        output = output.replace(tagStripper, '');
      }

      // 5. remove attributes ' style="..."'
      var badAttributes = ['style', 'start'];
      for (var ii = 0; ii < badAttributes.length; ii++) {
        var attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"', 'gi');
        output = output.replace(attributeStripper, '');
      }

      return output;
    };

    return {
      format: formatInput
    };
  })();

  return PasteWord;
});
