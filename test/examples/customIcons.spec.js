import { describe, expect, it } from 'vitest';

const examplePages = import.meta.glob('../../examples/custom-icons/*.html', {
  eager: true,
  query: '?raw',
  import: 'default',
});

describe('examples custom icon examples', () => {
  it('keeps the local index focused on the custom icon topic pages', () => {
    const indexPage = examplePages['../../examples/custom-icons/index.html'];

    expect(indexPage).to.contain('Custom Icons');
    expect(indexPage).to.contain('./class-overrides.html');
    expect(indexPage).to.contain('./inline-svg-icons.html');
    expect(indexPage).to.contain('./custom-button-icons.html');
  });

  it('loads compiled Summernote assets and icon configuration on every runnable topic page', () => {
    Object.entries(examplePages)
      .filter(([path]) => !path.endsWith('/index.html'))
      .forEach(([path, markup]) => {
        expect(markup, `${path} should load the compiled dist stylesheet`).to.contain('/dist/summernote-next.css');
        expect(markup, `${path} should load the compiled dist script`).to.contain('/dist/summernote-next.js');
        expect(markup, `${path} should contain a configuration card`).to.contain('data-example-configuration');
        expect(markup, `${path} should configure icon overrides`).to.contain('icons: {');
      });
  });

  it('demonstrates icon reuse inside custom button factories where relevant', () => {
    const customButtonPage = examplePages['../../examples/custom-icons/custom-button-icons.html'];

    expect(customButtonPage).to.contain('buttons: {');
    expect(customButtonPage).to.contain('context.ui.icon');
  });
});
