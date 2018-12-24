import { Nodes } from '../core/dom';

/**
 * textarea auto sync.
 */
export default class AutoSync {
  constructor(context) {
    this.$note = context.layoutInfo.note;
    this.events = {
      'summernote.change': () => {
        this.$note.val(context.invoke('code'));
      },
    };
  }

  shouldInitialize() {
    return Nodes.isTextarea(this.$note[0]);
  }
}
