import dom from '../core/dom';

/**
 * textarea auto sync.
 */
export default function (context) {
  var $note = context.layoutInfo.note;

  this.events = {
    'summernote.change': function () {
      $note.val(context.invoke('code'));
    }
  };

  this.shouldInitialize = function () {
    return dom.isTextarea($note[0]);
  };
}
