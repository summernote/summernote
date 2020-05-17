import dom from '../core/dom';
import key from '../core/key';

/**
 * @class Codeview
 */
export default class CodeView {
  constructor(context) {
    this.context = context;
    this.$editor = context.layoutInfo.editor;
    this.$editable = context.layoutInfo.editable;
    this.$codable = context.layoutInfo.codable;
    this.options = context.options;
    this.CodeMirrorConstructor = window.CodeMirror;

    if (this.options.codemirror.CodeMirrorConstructor) {
      this.CodeMirrorConstructor = this.options.codemirror.CodeMirrorConstructor;
    }
  }

  sync(html) {
    const isCodeview = this.isActivated();
    const CodeMirror = this.CodeMirrorConstructor;

    if (isCodeview) {
      if (html) {
        if (CodeMirror) {
          this.$codable.data('cmEditor').getDoc().setValue(html);
        } else {
          this.$codable.val(html);
        }
      } else {
        if (CodeMirror) {
          this.$codable.data('cmEditor').save();
        }
      }
    }
  }

  initialize() {
    this.$codable.on('keyup', (event) => {
      if (event.keyCode === key.code.ESCAPE) {
        this.deactivate();
      }
    });
  }

  /**
   * @return {Boolean}
   */
  isActivated() {
    return this.$editor.hasClass('codeview');
  }

  /**
   * toggle codeview
   */
  toggle() {
    if (this.isActivated()) {
      this.deactivate();
    } else {
      this.activate();
    }
    this.context.triggerEvent('codeview.toggled');
  }

  /**
   * purify input value
   * @param value
   * @returns {*}
   */
  purify(value) {
    if (this.options.codeviewFilter) {
      // filter code view regex
      value = value.replace(this.options.codeviewFilterRegex, '');
      // allow specific iframe tag
      if (this.options.codeviewIframeFilter) {
        const whitelist = this.options.codeviewIframeWhitelistSrc.concat(this.options.codeviewIframeWhitelistSrcBase);
        value = value.replace(/(<iframe.*?>.*?(?:<\/iframe>)?)/gi, function(tag) {
          // remove if src attribute is duplicated
          if (/<.+src(?==?('|"|\s)?)[\s\S]+src(?=('|"|\s)?)[^>]*?>/i.test(tag)) {
            return '';
          }
          for (const src of whitelist) {
            // pass if src is trusted
            if ((new RegExp('src="(https?:)?\/\/' + src.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\/(.+)"')).test(tag)) {
              return tag;
            }
          }
          return '';
        });
      }
    }
    return value;
  }

  /**
   * activate code view
   */
  activate() {
    const CodeMirror = this.CodeMirrorConstructor;
    this.$codable.val(dom.html(this.$editable, this.options.prettifyHtml));
    this.$codable.height(this.$editable.height());

    this.context.invoke('toolbar.updateCodeview', true);
    this.context.invoke('airPopover.updateCodeview', true);

    this.$editor.addClass('codeview');
    this.$codable.focus();

    // activate CodeMirror as codable
    if (CodeMirror) {
      const cmEditor = CodeMirror.fromTextArea(this.$codable[0], this.options.codemirror);

      // CodeMirror TernServer
      if (this.options.codemirror.tern) {
        const server = new CodeMirror.TernServer(this.options.codemirror.tern);
        cmEditor.ternServer = server;
        cmEditor.on('cursorActivity', (cm) => {
          server.updateArgHints(cm);
        });
      }

      cmEditor.on('blur', (event) => {
        this.context.triggerEvent('blur.codeview', cmEditor.getValue(), event);
      });
      cmEditor.on('change', () => {
        this.context.triggerEvent('change.codeview', cmEditor.getValue(), cmEditor);
      });

      // CodeMirror hasn't Padding.
      cmEditor.setSize(null, this.$editable.outerHeight());
      this.$codable.data('cmEditor', cmEditor);
    } else {
      this.$codable.on('blur', (event) => {
        this.context.triggerEvent('blur.codeview', this.$codable.val(), event);
      });
      this.$codable.on('input', () => {
        this.context.triggerEvent('change.codeview', this.$codable.val(), this.$codable);
      });
    }
  }

  /**
   * deactivate code view
   */
  deactivate() {
    const CodeMirror = this.CodeMirrorConstructor;
    // deactivate CodeMirror as codable
    if (CodeMirror) {
      const cmEditor = this.$codable.data('cmEditor');
      this.$codable.val(cmEditor.getValue());
      cmEditor.toTextArea();
    }

    const value = this.purify(dom.value(this.$codable, this.options.prettifyHtml) || dom.emptyPara);
    const isChange = this.$editable.html() !== value;

    this.$editable.html(value);
    this.$editable.height(this.options.height ? this.$codable.height() : 'auto');
    this.$editor.removeClass('codeview');

    if (isChange) {
      this.context.triggerEvent('change', this.$editable.html(), this.$editable);
    }

    this.$editable.focus();

    this.context.invoke('toolbar.updateCodeview', false);
    this.context.invoke('airPopover.updateCodeview', false);
  }

  destroy() {
    if (this.isActivated()) {
      this.deactivate();
    }
  }
}
