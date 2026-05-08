import { describe, expect, it } from 'vitest';

const examplePages = import.meta.glob('../../public/{airmode,bootswatch,default,default-vs-card,full,toolbar-colors}.html', {
  eager: true,
  query: '?raw',
  import: 'default',
});

describe('public example asset references', () => {
  it('loads the compiled dist assets without a hard-coded cache-buster', () => {
    Object.entries(examplePages).forEach(([path, markup]) => {
      expect(markup, `${path} should load the compiled dist stylesheet`).to.contain('/dist/summernote-next.css');
      expect(markup, `${path} should load the compiled dist script`).to.contain('/dist/summernote-next.js');
      expect(markup, `${path} should not pin the dist stylesheet to a stale version`).not.to.match(/\/dist\/summernote-next\.css\?v=/);
      expect(markup, `${path} should not pin the dist script to a stale version`).not.to.match(/\/dist\/summernote-next\.js\?v=/);
    });
  });

  it('keeps an example configuration block on the default example page', () => {
    expect(examplePages['../../public/default.html']).to.contain('data-example-configuration');
    expect(examplePages['../../public/default.html']).to.contain('Example configuration');
    expect(examplePages['../../public/default.html']).to.contain('summernote.create(\'#editor\');');
  });

  it('keeps an example configuration block on the airmode example page', () => {
    expect(examplePages['../../public/airmode.html']).to.contain('data-example-configuration');
    expect(examplePages['../../public/airmode.html']).to.contain('summernote.create(\'#airmode-editor\', {');
  });

  it('keeps an example configuration block on the full example page', () => {
    expect(examplePages['../../public/full.html']).to.contain('data-example-configuration');
    expect(examplePages['../../public/full.html']).to.contain('summernote.create(\'#all-features-editor\', {');
  });

  it('renders two separate example configuration cards on the toolbar colors page', () => {
    const toolbarColorsPage = examplePages['../../public/toolbar-colors.html'];
    const cardMatches = toolbarColorsPage.match(/data-example-configuration/g) || [];

    expect(cardMatches).to.have.length(2);
    expect(toolbarColorsPage).to.contain('summernote.create(\'#toolbar-colors-editor\', {');
    expect(toolbarColorsPage).to.contain('summernote.create(\'#toolbar-colors-editor-light\', {');
  });
});
