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

    this.keys = [key.code.ENTER, key.code.SPACE, key.code.PERIOD, key.code.COMMA, key.code.SEMICOLON, key.code.SLASH];
    this.previousKeydownCode = null;

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
    this.lastWord = null;
  }

  destroy() {
    this.lastWord = null;
  }

  replace() {
    if (!this.lastWord) {
      return;
    }

    const keyword = this.lastWord.toString();
    const match = this.options.match(keyword);

    if (match) {
      const node = dom.createText(match);

      this.lastWord.insertNode(node);
      this.lastWord = null;
      this.context.invoke('editor.focus');
    }
  }

  handleKeydown(e) {

    //this forces it to remember the last whole word, even if multiple termination keys are pressed
    //before the previous key is let go.
    if(this.previousKeydownCode && lists.contains(this.keys, this.previousKeydownCode)){
      this.previousKeydownCode = e.keyCode;
      return;
    }

    if (lists.contains(this.keys, e.keyCode)) {
      const wordRange = this.context.invoke('editor.createRange').getWordRange();
      this.lastWord = wordRange;
    }
    this.previousKeydownCode = e.keyCode;

    
  }

  handleKeyup(e) {
    if (lists.contains(this.keys, e.keyCode)) 
      this.replace();
  }
}
