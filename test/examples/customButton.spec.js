import { describe, expect, it } from 'vitest';

const examplePages = import.meta.glob('../../examples/custom-button/*.html', {
  eager: true,
  query: '?raw',
  import: 'default',
});

describe('examples custom button examples', () => {
  it('keeps the local index focused on the custom button topic pages', () => {
    const indexPage = examplePages['../../examples/custom-button/index.html'];

    expect(indexPage).to.contain('Custom Buttons');
    expect(indexPage).to.contain('./toolbar-buttons.html');
    expect(indexPage).to.contain('./dropdown-buttons.html');
    expect(indexPage).to.contain('./popover-buttons.html');
  });

  it('loads compiled Summernote assets on every runnable topic page', () => {
    Object.entries(examplePages)
      .filter(([path]) => !path.endsWith('/index.html'))
      .forEach(([path, markup]) => {
        expect(markup, `${path} should load the compiled dist stylesheet`).to.contain('/dist/summernote-next.css');
        expect(markup, `${path} should load the compiled dist script`).to.contain('/dist/summernote-next.js');
        expect(markup, `${path} should contain a configuration card`).to.contain('data-example-configuration');
        expect(markup, `${path} should define custom buttons`).to.contain('buttons: {');
      });
  });
});
