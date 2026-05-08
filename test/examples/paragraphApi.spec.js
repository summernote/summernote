import { describe, expect, it } from 'vitest';

const examplePages = import.meta.glob('../../examples/paragraph-api/*.html', {
  eager: true,
  query: '?raw',
  import: 'default',
});

describe('examples paragraph API examples', () => {
  it('keeps the local index focused on the paragraph topic pages', () => {
    const indexPage = examplePages['../../examples/paragraph-api/index.html'];

    expect(indexPage).to.contain('Paragraph API');
    expect(indexPage).to.contain('./alignment.html');
    expect(indexPage).to.contain('./lists-and-indentation.html');
    expect(indexPage).to.contain('./block-formats.html');
    expect(indexPage).to.contain('./line-height.html');
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
