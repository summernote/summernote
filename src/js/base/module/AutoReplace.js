import $ from 'jquery';
import func from '../core/func';
import lists from '../core/lists';
import dom from '../core/dom';
import range from '../core/range';
import key from '../core/key';


export default class AutoReplace {
  constructor(context) {
    this.context = context;
    this.options = context.options.replace || {};

    this.events = {
      'summernote.keyup': (we, e) => {
        if (!e.isDefaultPrevented()) {
          this.handleKeyup(e);
        }
      },
      'summernote.keydown': (we, e) => {
        this.handleKeydown(e);
      },
    };
  }

  shouldInitialize() {
    return !$.isEmptyObject(this.options);
  }

  initialize() {
    this.lastWordRange = null;
  }

  destroy() {
    this.lastWordRange = null;
  }

  replace() {
    if (!this.lastWordRange) {
      return;
    }

    const keyword = this.lastWordRange.toString();
    const match = this.options.match(keyword);

    if (match) {
      const node = dom.createText(match);

      this.lastWordRange.insertNode(node);
      this.lastWordRange = null;
      this.context.invoke('editor.focus');
    }
  }

  handleKeydown(e) {
    if (lists.contains([key.code.ENTER, key.code.SPACE, 190], e.keyCode)) {
      const wordRange = this.context.invoke('editor.createRange').getWordRange();
      this.lastWordRange = wordRange;
    }
  }

  handleKeyup(e) {
    if (lists.contains([key.code.ENTER, key.code.SPACE, 190], e.keyCode)) {
      this.replace();
    }
  }
}
