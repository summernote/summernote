import { describe, expect, it } from 'vitest';

const examplePages = import.meta.glob('../../examples/module-system/*.html', {
  eager: true,
  query: '?raw',
  import: 'default',
});

describe('examples module system examples', () => {
  it('keeps the local index focused on the module system topic pages', () => {
    const indexPage = examplePages['../../examples/module-system/index.html'];

    expect(indexPage).to.contain('Module System');
    expect(indexPage).to.contain('./lifecycle-and-events.html');
    expect(indexPage).to.contain('./conditional-modules.html');
    expect(indexPage).to.contain('./plugin-registration.html');
  });

  it('loads compiled Summernote assets and configuration cards on runnable topic pages', () => {
    Object.entries(examplePages)
      .filter(([path]) => !path.endsWith('/index.html'))
      .forEach(([path, markup]) => {
        expect(markup, `${path} should load the compiled dist stylesheet`).to.contain('/dist/summernote-next.css');
        expect(markup, `${path} should load the compiled dist script`).to.contain('/dist/summernote-next.js');
        expect(markup, `${path} should contain a configuration card`).to.contain('data-example-configuration');
      });
  });

  it('documents both local modules and global plugin registration', () => {
    expect(examplePages['../../examples/module-system/lifecycle-and-events.html']).to.contain('modules: {');
    expect(examplePages['../../examples/module-system/conditional-modules.html']).to.contain('shouldInitialize()');
    expect(examplePages['../../examples/module-system/plugin-registration.html']).to.contain('summernote.summernote.plugins');
  });
});
