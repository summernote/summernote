import { describe, expect, it } from 'vitest';

const examplePages = import.meta.glob('../../examples/basic-api/*.html', {
  eager: true,
  query: '?raw',
  import: 'default',
});

describe('examples basic API examples', () => {
  it('keeps the local index focused on the API topic pages', () => {
    const indexPage = examplePages['../../examples/basic-api/index.html'];

    expect(indexPage).to.contain('Basic API');
    expect(indexPage).to.contain('./content-commands.html');
    expect(indexPage).to.contain('./editor-state.html');
    expect(indexPage).to.contain('./selection-range.html');
    expect(indexPage).to.contain('./view-modes.html');
    expect(indexPage).to.contain('./instance-lifecycle.html');
    expect(indexPage).to.contain('./writing-aids.html');
  });

  it('loads compiled Summernote assets on every runnable API topic page', () => {
    Object.entries(examplePages)
      .filter(([path]) => !path.endsWith('/index.html'))
      .forEach(([path, markup]) => {
        expect(markup, `${path} should load the compiled dist stylesheet`).to.contain('/dist/summernote-next.css');
        expect(markup, `${path} should load the compiled dist script`).to.contain('/dist/summernote-next.js');
        expect(markup, `${path} should contain a configuration card`).to.contain('data-example-configuration');
        expect(markup, `${path} should initialize or read Summernote APIs`).to.match(/summernote\.(create|getInstance|invoke|destroy|interface)/);
      });
  });
});
