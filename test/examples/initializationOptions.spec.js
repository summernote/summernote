import { describe, expect, it } from 'vitest';

const examplePages = import.meta.glob('../../examples/initialization-options/*.html', {
  eager: true,
  query: '?raw',
  import: 'default',
});

describe('public initialization option examples', () => {
  it('keeps the local index focused on the initialization option topic pages', () => {
    const indexPage = examplePages['../../examples/initialization-options/index.html'];

    expect(indexPage).to.contain('Initialization options');
    expect(indexPage).to.contain('./toolbar-popover.html');
    expect(indexPage).to.contain('./blockquote-breaking-level.html');
    expect(indexPage).to.contain('./style-tags.html');
    expect(indexPage).to.contain('./font-options.html');
    expect(indexPage).to.contain('./font-size-units.html');
    expect(indexPage).to.contain('./line-heights.html');
    expect(indexPage).to.contain('./placeholder.html');
    expect(indexPage).to.contain('./hints.html');
    expect(indexPage).to.contain('./dialogs.html');
    expect(indexPage).to.contain('./interaction.html');
    expect(indexPage).to.contain('./codeview-filter.html');
  });

  it('loads compiled Summernote assets on every runnable topic page', () => {
    Object.entries(examplePages)
      .filter(([path]) => !path.endsWith('/index.html'))
      .forEach(([path, markup]) => {
        expect(markup, `${path} should load the compiled dist stylesheet`).to.contain('/dist/summernote-next.css');
        expect(markup, `${path} should load the compiled dist script`).to.contain('/dist/summernote-next.js');
        expect(markup, `${path} should contain a configuration card`).to.contain('data-example-configuration');
        expect(markup, `${path} should initialize Summernote`).to.contain('summernote.create(');
      });
  });

  it('documents words, emoji, mentions, and multiple hints on the hint example page', () => {
    const hintsPage = examplePages['../../examples/initialization-options/hints.html'];

    expect(hintsPage).to.contain('Autocomplete hints with single and multiple sources');
    expect(hintsPage).to.contain('GitHub emoji');
    expect(hintsPage).to.contain('hint: [fruitHint, emojiHint, mentionHint]');
    expect(hintsPage).to.contain('fetch(\'https://api.github.com/emojis\')');
    expect(hintsPage).to.contain('match: /\\B@(\\w*)$/');
  });
});
