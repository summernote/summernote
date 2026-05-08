import { describe, expect, it } from 'vitest';

const examplePages = import.meta.glob('../../examples/font-style-api/*.html', {
  eager: true,
  query: '?raw',
  import: 'default',
});

describe('examples font style API examples', () => {
  it('keeps the local index focused on the font style topic pages', () => {
    const indexPage = examplePages['../../examples/font-style-api/index.html'];

    expect(indexPage).to.contain('Font Style API');
    expect(indexPage).to.contain('./text-emphasis.html');
    expect(indexPage).to.contain('./colors.html');
    expect(indexPage).to.contain('./font-family-size.html');
    expect(indexPage).to.contain('./script-and-cleanup.html');
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
