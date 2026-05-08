import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  THEME_STORAGE_KEY,
  getStoredTheme,
  getPreferredTheme,
  initializeExampleConfigurations,
  initializeExamplesTheme,
} from '../../examples/assets/examples.js';

describe('examples:examples theme toggle', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-bs-theme');
    window.localStorage.clear();
  });

  it('prefers an explicit stored theme', () => {
    const storage = {
      getItem: vi.fn(() => 'light'),
    };
    const mediaQueryList = { matches: true };

    expect(getPreferredTheme(storage, mediaQueryList)).to.equal('light');
  });

  it('falls back to the system preference when nothing is stored', () => {
    const storage = {
      getItem: vi.fn(() => null),
    };
    const mediaQueryList = { matches: true };

    expect(getPreferredTheme(storage, mediaQueryList)).to.equal('dark');
  });

  it('returns null for an invalid stored theme', () => {
    const storage = {
      getItem: vi.fn(() => 'sepia'),
    };

    expect(getStoredTheme(storage)).to.equal(null);
  });

  it('renders one toggle and persists user changes', () => {
    document.body.innerHTML = '<main class="page"></main>';
    const mediaQueryList = {
      matches: false,
      addEventListener: vi.fn(),
    };

    const firstInit = initializeExamplesTheme({ mediaQueryList });
    const secondInit = initializeExamplesTheme({ mediaQueryList });

    expect(document.querySelectorAll('[data-examples-theme-toggle]')).to.have.length(1);
    expect(firstInit.toggle).to.equal(secondInit.toggle);
    expect(document.documentElement.getAttribute('data-bs-theme')).to.equal('light');

    firstInit.toggle.checked = true;
    firstInit.toggle.dispatchEvent(new Event('change', { bubbles: true }));

    expect(document.documentElement.getAttribute('data-bs-theme')).to.equal('dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).to.equal('dark');
    expect(firstInit.toggle.getAttribute('aria-pressed')).to.equal('true');
    expect(document.querySelector('[data-examples-project-links]')).not.to.equal(null);
    expect(document.querySelectorAll('[data-examples-project-links]')).to.have.length(1);
  });

  it('follows system theme changes until the user stores a preference', () => {
    let onChange;
    const storage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
    };
    const mediaQueryList = {
      matches: false,
      addEventListener: vi.fn((eventName, callback) => {
        if (eventName === 'change') {
          onChange = callback;
        }
      }),
    };

    const { toggle } = initializeExamplesTheme({ storage, mediaQueryList });
    onChange({ matches: true });

    expect(document.documentElement.getAttribute('data-bs-theme')).to.equal('dark');
    expect(toggle.checked).to.be.true;
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it('applies the stored theme immediately when one exists', () => {
    const storage = {
      getItem: vi.fn(() => 'dark'),
      setItem: vi.fn(),
    };
    const mediaQueryList = {
      matches: false,
      addEventListener: vi.fn(),
    };

    const { toggle } = initializeExamplesTheme({ storage, mediaQueryList });

    expect(document.documentElement.getAttribute('data-bs-theme')).to.equal('dark');
    expect(toggle.checked).to.be.true;
    expect(mediaQueryList.addEventListener).not.toHaveBeenCalled();
  });

  it('returns null when the document body is unavailable', () => {
    expect(initializeExamplesTheme({ documentRef: { body: null } })).to.equal(null);
  });
});

describe('examples:example configuration cards', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('adds one copy button per code example and highlights the source', () => {
    document.body.innerHTML = `
      <div class="card" data-example-configuration>
        <div class="card-header">Example configuration</div>
        <div class="card-body">
          <pre><code data-copy-label="primary">const value = true;</code></pre>
          <pre><code data-copy-label="light">&lt;div class="demo"&gt;&lt;/div&gt;</code></pre>
        </div>
      </div>
    `;

    initializeExampleConfigurations({ documentRef: document });
    initializeExampleConfigurations({ documentRef: document });

    const buttons = document.querySelectorAll('.example-config-copy-button');
    const codeBlocks = document.querySelectorAll('.example-config-code');

    expect(buttons).to.have.length(2);
    expect(buttons[0].getAttribute('aria-label')).to.equal('Copy primary');
    expect(buttons[0].textContent).to.contain('Primary');
    expect(buttons[1].getAttribute('aria-label')).to.equal('Copy light');
    expect(buttons[1].textContent).to.contain('Light');
    expect(document.querySelectorAll('.example-config-actions')).to.have.length(1);
    expect(codeBlocks).to.have.length(2);
    expect(codeBlocks[0].innerHTML).to.contain('example-code-token-keyword');
    expect(codeBlocks[1].innerHTML).to.contain('example-code-token-tag');
  });

  it('copies the source text from the matching code block', async() => {
    const clipboard = {
      writeText: vi.fn(() => Promise.resolve()),
    };

    document.body.innerHTML = `
      <div class="card" data-example-configuration>
        <div class="card-header">Example configuration</div>
        <div class="card-body">
          <pre><code>const editor = summernote.create('#demo', { height: 320 });</code></pre>
        </div>
      </div>
    `;

    initializeExampleConfigurations({
      documentRef: document,
      clipboard,
      setTimeoutRef: (callback) => {
        callback();
        return 0;
      },
    });

    document.querySelector('.example-config-copy-button').click();
    await Promise.resolve();

    expect(clipboard.writeText).toHaveBeenCalledWith('const editor = summernote.create(\'#demo\', { height: 320 });');
  });

  it('falls back to document.execCommand when the clipboard API is unavailable', async() => {
    document.execCommand = vi.fn(() => true);
    document.body.innerHTML = `
      <div class="card" data-example-configuration>
        <div class="card-header">Example configuration</div>
        <div class="card-body">
          <pre><code>const value = 1;</code></pre>
        </div>
      </div>
    `;

    initializeExampleConfigurations({
      documentRef: document,
      clipboard: null,
      setTimeoutRef: (callback) => {
        callback();
        return 0;
      },
    });

    document.querySelector('.example-config-copy-button').click();
    await Promise.resolve();

    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(document.querySelector('.example-config-copy-button').getAttribute('aria-label')).to.equal('Copied');
  });

  it('marks the copy button as failed when the clipboard write rejects', async() => {
    const clipboard = {
      writeText: vi.fn(() => Promise.reject(new Error('copy failed'))),
    };

    document.body.innerHTML = `
      <div class="card" data-example-configuration>
        <div class="card-header">Example configuration</div>
        <div class="card-body">
          <pre><code data-copy-label="snippet">const value = 2;</code></pre>
        </div>
      </div>
    `;

    initializeExampleConfigurations({
      documentRef: document,
      clipboard,
      setTimeoutRef: () => 0,
    });

    document.querySelector('.example-config-copy-button').click();
    await Promise.resolve();
    await Promise.resolve();

    expect(document.querySelector('.example-config-copy-button').getAttribute('aria-label')).to.equal('Copy failed');
  });

  it('skips cards without a usable header or code blocks', () => {
    document.body.innerHTML = `
      <div class="card" data-example-configuration>
        <div class="card-body"><pre><code>const value = 3;</code></pre></div>
      </div>
      <div class="card" data-example-configuration>
        <div class="card-header">Example configuration</div>
        <div class="card-body"></div>
      </div>
    `;

    initializeExampleConfigurations({ documentRef: document });

    expect(document.querySelector('.example-config-actions')).to.equal(null);
  });
});
