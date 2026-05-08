import { describe, expect, it } from 'vitest';

const examplePages = import.meta.glob('../../examples/callbacks/*.html', {
  eager: true,
  query: '?raw',
  import: 'default',
});

describe('examples callback examples', () => {
  it('keeps the local index focused on the callback topic pages', () => {
    const indexPage = examplePages['../../examples/callbacks/index.html'];

    expect(indexPage).to.contain('Callbacks');
    expect(indexPage).to.contain('./lifecycle-and-content.html');
    expect(indexPage).to.contain('./interaction-events.html');
    expect(indexPage).to.contain('./codeview-and-dialogs.html');
    expect(indexPage).to.contain('./image-callbacks.html');
  });

  it('loads compiled Summernote assets on every runnable topic page', () => {
    Object.entries(examplePages)
      .filter(([path]) => !path.endsWith('/index.html'))
      .forEach(([path, markup]) => {
        expect(markup, `${path} should load the compiled dist stylesheet`).to.contain('/dist/summernote-next.css');
        expect(markup, `${path} should load the compiled dist script`).to.contain('/dist/summernote-next.js');
        expect(markup, `${path} should contain a configuration card`).to.contain('data-example-configuration');
        expect(markup, `${path} should wire callback configuration`).to.contain('callbacks:');
      });
  });
});
