import { describe, expect, it } from 'vitest';

const examplePages = import.meta.glob('../../examples/insertion-api/*.html', {
  eager: true,
  query: '?raw',
  import: 'default',
});

describe('examples insertion API examples', () => {
  it('keeps the local index focused on the insertion topic pages', () => {
    const indexPage = examplePages['../../examples/insertion-api/index.html'];

    expect(indexPage).to.contain('Insertion API');
    expect(indexPage).to.contain('./links.html');
    expect(indexPage).to.contain('./text-and-html.html');
    expect(indexPage).to.contain('./insert-node.html');
    expect(indexPage).to.contain('./media-and-tables.html');
  });

  it('loads compiled Summernote assets on every runnable topic page', () => {
    Object.entries(examplePages)
      .filter(([path]) => !path.endsWith('/index.html'))
      .forEach(([path, markup]) => {
        expect(markup, `${path} should load the compiled dist stylesheet`).to.contain('/dist/summernote-next.css');
        expect(markup, `${path} should load the compiled dist script`).to.contain('/dist/summernote-next.js');
        expect(markup, `${path} should contain a configuration card`).to.contain('data-example-configuration');
        expect(markup, `${path} should use the Summernote API`).to.contain('summernote.invoke(');
      });
  });
});
