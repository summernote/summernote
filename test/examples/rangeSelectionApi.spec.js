import { describe, expect, it } from 'vitest';

const examplePages = import.meta.glob('../../examples/range-selection-api/*.html', {
  eager: true,
  query: '?raw',
  import: 'default',
});

describe('examples range and selection API examples', () => {
  it('keeps the local index focused on the range topic pages', () => {
    const indexPage = examplePages['../../examples/range-selection-api/index.html'];

    expect(indexPage).to.contain('Range and Selection API');
    expect(indexPage).to.contain('./editor-range-state.html');
    expect(indexPage).to.contain('./custom-ranges.html');
    expect(indexPage).to.contain('./content-transforms.html');
    expect(indexPage).to.contain('./word-ranges-and-rects.html');
  });

  it('loads compiled Summernote assets on every runnable topic page', () => {
    Object.entries(examplePages)
      .filter(([path]) => !path.endsWith('/index.html'))
      .forEach(([path, markup]) => {
        expect(markup, `${path} should load the compiled dist stylesheet`).to.contain('/dist/summernote-next.css');
        expect(markup, `${path} should load the compiled dist script`).to.contain('/dist/summernote-next.js');
        expect(markup, `${path} should contain a configuration card`).to.contain('data-example-configuration');
        expect(markup, `${path} should expose the range utility or editor range helpers`).to.match(/summernote\.(invoke|range)/);
      });
  });
});
