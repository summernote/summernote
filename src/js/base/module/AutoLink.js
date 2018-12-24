import $ from 'jquery';
import * as lists from '../core/lists';
import { KEY_MAP } from '../core/key';

const defaultScheme = 'http://';
const linkPattern = /^([A-Za-z][A-Za-z0-9+-.]*\:[\/]{2}|mailto:[A-Z0-9._%+-]+@)?(www\.)?(.+)$/i;

export default class AutoLink {
  constructor(context) {
    this.context = context;
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
    const match = keyword.match(linkPattern);

    if (match && (match[1] || match[2])) {
      const link = match[1] ? keyword : defaultScheme + keyword;
      const node = $('<a />').html(keyword).attr('href', link)[0];
      if (this.context.options.linkTargetBlank) {
        $(node).attr('target', '_blank');
      }

      this.lastWordRange.insertNode(node);
      this.lastWordRange = null;
      this.context.invoke('editor.focus');
    }
  }

  handleKeydown(e) {
    if (lists.contains([
      KEY_MAP.ENTER,
      KEY_MAP.SPACE,
    ], e.keyCode)) {
      const wordRange = this.context.invoke('editor.createRange').getWordRange();
      this.lastWordRange = wordRange;
    }
  }

  handleKeyup(e) {
    if (lists.contains([
      KEY_MAP.ENTER,
      KEY_MAP.SPACE,
    ], e.keyCode)) {
      this.replace();
    }
  }
}
