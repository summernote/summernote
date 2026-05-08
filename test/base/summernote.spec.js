import { afterEach, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import Context from '@/js/Context';
import '@/js/summernote-de-DE';
import '@/js/summernote-fr-FR';
import '@/styles/bs5/summernote-bs5';

describe('summernote public API', () => {
  afterEach(() => {
    $$('body').empty();
  });

  it('creates, reads, invokes, and destroys a single editor instance', () => {
    const $note = $$('<div><p>hello</p></div>').appendTo('body');

    const context = $$.create($note, {
      focus: false,
    });

    expect(context).toBeInstanceOf(Context);
    expect($$.getInstance($note[0])).to.equal(context);
    expect($$.getInstance(context)).to.equal(context);
    expect($$.invoke($note[0], 'code')).to.contain('hello');

    $$.destroy(context);

    expect($note.data('summernote')).to.equal(undefined);
  });

  it('returns arrays for multi-target create and invoke calls', () => {
    $$('<div class="multi"><p>a</p></div><div class="multi"><p>b</p></div>').appendTo('body');

    const contexts = $$.create('.multi');
    const values = $$.invoke('.multi', 'code');

    expect(Array.isArray(contexts)).to.be.true;
    expect(contexts).to.have.length(2);
    expect(values).to.have.length(2);
    expect(values[0]).to.contain('<p>a</p>');
    expect(values[1]).to.contain('<p>b</p>');
  });

  it('throws helpful errors for missing or uninitialized targets', () => {
    const $note = $$('<div></div>').appendTo('body');

    expect(() => $$.create('.missing')).to.throw('Summernote target not found.');
    expect(() => $$.getInstance($note)).to.throw('Summernote is not initialized on the target.');
  });

  it('initializes through the DomQuery plugin, supports focus, and reuses the existing context', () => {
    const invokeSpy = vi.spyOn(Context.prototype, 'invoke');
    const $note = $$('<div><p>hello</p></div>').appendTo('body');

    const $result = $note.summernote({
      focus: true,
    });
    const initialContext = $note.data('summernote');
    const html = $note.summernote('code');

    $note.summernote({
      focus: true,
    });

    expect($result).to.equal($note);
    expect(initialContext).toBeInstanceOf(Context);
    expect($note.data('summernote')).to.equal(initialContext);
    expect(html).to.contain('hello');
    expect(invokeSpy).toHaveBeenCalledWith('editor.focus');
  });

  it('preserves explicit tooltip settings instead of forcing auto behavior', () => {
    const $note = $$('<div><p>hello</p></div>').appendTo('body');

    $note.summernote({
      tooltip: false,
    });

    expect($note.data('summernote').options.tooltip).to.equal(false);
  });

  it('returns the original empty collection when initializing an empty selection', () => {
    const $missing = $$('.does-not-exist');

    const result = $missing.summernote();

    expect(result).to.equal($missing);
    expect(result.length).to.equal(0);
  });

  it('uses loaded locale data for editor options and toolbar copy', () => {
    const $note = $$('<div><p>hallo</p></div>').appendTo('body');

    const context = $$.create($note, {
      lang: 'de-DE',
    });

    expect(context.options.langInfo.font.bold).to.equal('Fett');
    expect(context.options.langInfo.options.help).to.equal('Hilfe');
    expect(context.options.colorsName[0][0]).to.equal('Schwarz');
    expect(context.layoutInfo.toolbar.find('[aria-label="Fett (CTRL+B)"]').length).to.equal(1);
  });

  it('falls back to the default color names when a locale does not override them', () => {
    const $note = $$('<div><p>bonjour</p></div>').appendTo('body');

    const context = $$.create($note, {
      lang: 'fr-FR',
    });

    expect(context.options.langInfo.options.help).to.equal('Aide');
    expect(context.options.colorsName[0][0]).to.equal('Black');
  });

  it('preserves explicit color names instead of replacing them from the locale bundle', () => {
    const $note = $$('<div><p>hallo</p></div>').appendTo('body');
    const colorsName = $$.summernote.options.colorsName.map((row, rowIndex) => {
      return row.map((name, columnIndex) => {
        return rowIndex === 0 && columnIndex === 0 ? 'Eigene Farbe' : name;
      });
    });

    const context = $$.create($note, {
      lang: 'de-DE',
      colorsName,
    });

    expect(context.options.colorsName).to.equal(colorsName);
    expect(context.options.colorsName[0][0]).to.equal('Eigene Farbe');
  });
});
