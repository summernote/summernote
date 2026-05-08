import { describe, expect, it } from 'vitest';

const examplePages = import.meta.glob('../../public/modules/*.html', {
  eager: true,
  query: '?raw',
  import: 'default',
});

describe('public modules examples', () => {
  it('keeps the local index focused on the built-in module topic pages', () => {
    const indexPage = examplePages['../../public/modules/index.html'];

    expect(indexPage).to.contain('Modules');
    expect(indexPage).to.contain('./status-messages.html');
    expect(indexPage).to.contain('./normal-and-air-mode.html');
    expect(indexPage).to.contain('./built-in-feedback.html');
  });

  it('loads compiled Summernote assets and configuration cards on runnable topic pages', () => {
    Object.entries(examplePages)
      .filter(([path]) => !path.endsWith('/index.html'))
      .forEach(([path, markup]) => {
        expect(markup, `${path} should load the compiled dist stylesheet`).to.contain('/dist/summernote-bs5.css');
        expect(markup, `${path} should load the compiled dist script`).to.contain('/dist/summernote-bs5.js');
        expect(markup, `${path} should contain a configuration card`).to.contain('data-example-configuration');
      });
  });

  it('documents the current status output surface and built-in feedback path', () => {
    expect(examplePages['../../public/modules/status-messages.html']).to.contain('.note-status-output');
    expect(examplePages['../../public/modules/normal-and-air-mode.html']).to.contain('airMode: true');
    expect(examplePages['../../public/modules/built-in-feedback.html']).to.contain('editor.fontStyling');
  });
});
