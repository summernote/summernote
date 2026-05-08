import $$ from '../core/dom-query.js';
import env from '../core/env';

export default class HelpDialog {
  constructor(context) {
    this.context = context;

    this.ui = $$.summernote.ui;
    this.$body = $$(document.body);
    this.$editor = context.layoutInfo.editor;
    this.options = context.options;
    this.lang = this.options.langInfo;
  }

  initialize() {
    const $container = this.options.dialogsInBody ? this.$body : this.options.container;

    this.$dialog = this.ui.dialog({
      className: 'note-help-dialog-modal',
      title: this.lang.options.help,
      fade: this.options.dialogsFade,
      body: this.createDialogBody(),
      footer: this.createDialogFooter(),
      callback: ($node) => {
        $node.find('.modal-body,.note-modal-body').css({
          'max-height': 420,
          'overflow-y': 'auto',
        });
      },
    }).render().appendTo($container);
  }

  destroy() {
    this.ui.hideDialog(this.$dialog);
    this.$dialog.remove();
  }

  escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll('\'', '&#39;');
  }

  formatShortcutToken(token) {
    const replacements = {
      CMD: '⌘',
      CTRL: 'Ctrl',
      SHIFT: 'Shift',
      ENTER: 'Enter',
      ESC: 'Esc',
      TAB: 'Tab',
      BACKSLASH: '\\',
      LEFTBRACKET: '[',
      RIGHTBRACKET: ']',
      NUM0: '0',
      NUM1: '1',
      NUM2: '2',
      NUM3: '3',
      NUM4: '4',
      NUM5: '5',
      NUM6: '6',
      NUM7: '7',
      NUM8: '8',
    };

    return replacements[token] || token;
  }

  renderShortcut(shortcut) {
    return shortcut
      .split('+')
      .map((token) => `<kbd>${this.escapeHtml(this.formatShortcutToken(token))}</kbd>`)
      .join('<span class="note-help-dialog-shortcut-separator">+</span>');
  }

  getShortcutSections() {
    const keyMap = this.options.keyMap[env.isMac ? 'mac' : 'pc'];
    const shortcuts = new Map(
      Object.entries(keyMap).map(([shortcut, command]) => [command, shortcut]),
    );
    const sections = [
      {
        title: this.lang.shortcut.action,
        commands: ['undo', 'redo', 'linkDialog.show'],
      },
      {
        title: this.lang.shortcut.textFormatting,
        commands: ['bold', 'italic', 'underline', 'strikethrough', 'removeFormat'],
      },
      {
        title: this.lang.shortcut.paragraphFormatting,
        commands: [
          'insertParagraph',
          'insertUnorderedList',
          'insertOrderedList',
          'outdent',
          'indent',
          'justifyLeft',
          'justifyCenter',
          'justifyRight',
          'justifyFull',
        ],
      },
      {
        title: this.lang.shortcut.documentStyle,
        commands: [
          'formatPara',
          'formatH1',
          'formatH2',
          'formatH3',
          'formatH4',
          'formatH5',
          'formatH6',
          'insertHorizontalRule',
        ],
      },
      {
        title: this.lang.shortcut.extraKeys,
        commands: ['escape', 'tab', 'untab'],
      },
    ];

    return sections
      .map((section) => ({
        ...section,
        items: section.commands
          .filter((command) => shortcuts.has(command))
          .map((command) => ({
            command,
            shortcut: shortcuts.get(command),
            description: this.context.memo('help.' + command) || command,
          })),
      }))
      .filter((section) => section.items.length > 0);
  }

  createDialogBody() {
    const platformLabel = env.isMac ? 'macOS' : 'Windows and Linux';
    const sections = this.getShortcutSections().map((section) => `
      <section class="note-help-dialog-section" aria-label="${this.escapeHtml(section.title)}">
        <h5 class="note-help-dialog-section-title">${this.escapeHtml(section.title)}</h5>
        <div class="note-help-dialog-list">
          ${section.items.map((item) => `
            <div class="note-help-dialog-item">
              <div class="note-help-dialog-item-shortcut">${this.renderShortcut(item.shortcut)}</div>
              <div class="note-help-dialog-item-copy">${this.escapeHtml(item.description)}</div>
            </div>
          `).join('')}
        </div>
      </section>
    `).join('');

    return `
      <div class="note-help-dialog">
        <div class="note-help-dialog-intro">
          <p class="note-help-dialog-lead">${this.escapeHtml(this.lang.shortcut.shortcuts)}</p>
          <p class="note-help-dialog-meta">
            <span class="note-help-dialog-platform">${this.escapeHtml(platformLabel)}</span>
          </p>
        </div>
        ${sections}
      </div>
    `;
  }

  createDialogFooter() {
    const versionLabel = this.escapeHtml($$.summernote.version);
    return `
      <div class="note-help-dialog-footer">
        <span class="note-help-dialog-footer-copy">Summernote Next ${versionLabel}</span>
        <span class="note-help-dialog-footer-links">
          <a href="https://juergen-schwind.com/summernote-next" target="_blank" rel="noopener noreferrer">Examples</a>
          <span aria-hidden="true">·</span>
          <a href="https://github.com/jschwind/summernote-next" target="_blank" rel="noopener noreferrer">Project</a>
          <span aria-hidden="true">·</span>
          <a href="https://github.com/jschwind/summernote-next/issues" target="_blank" rel="noopener noreferrer">Issues</a>
        </span>
      </div>
    `;
  }

  /**
   * show help dialog
   *
   * @return {Promise}
   */
  showHelpDialog() {
    return new Promise((resolve) => {
      this.ui.onDialogShown(this.$dialog, () => {
        this.context.triggerEvent('dialog.shown');
        resolve();
      });
      this.ui.showDialog(this.$dialog);
    });
  }

  show() {
    this.context.invoke('editor.saveRange');
    this.showHelpDialog().then(() => {
      this.context.invoke('editor.restoreRange');
    });
  }
}
