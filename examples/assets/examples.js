export const THEME_STORAGE_KEY = 'summernote-examples-theme';
const PROJECT_LINKS = [
  {
    href: 'https://juergen-schwind.de/summernote-next',
    label: 'Live examples',
  },
  {
    href: 'https://github.com/jschwind/summernote-next',
    label: 'GitHub repository',
  },
  {
    href: 'https://juergen-schwind.de',
    label: 'Maintainer website',
  },
  {
    href: 'mailto:info@juergen-schwind.de',
    label: 'Contact',
  },
];

function isValidTheme(theme) {
  return theme === 'light' || theme === 'dark';
}

export function getStoredTheme(storage = window.localStorage) {
  const theme = storage.getItem(THEME_STORAGE_KEY);
  return isValidTheme(theme) ? theme : null;
}

export function getPreferredTheme(storage = window.localStorage, mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')) {
  const storedTheme = getStoredTheme(storage);

  if (storedTheme) {
    return storedTheme;
  }

  return mediaQueryList.matches ? 'dark' : 'light';
}

export function applyTheme(theme, root = document.documentElement) {
  root.setAttribute('data-bs-theme', theme);
}

const HTML_TOKEN_REGEX = /<\/?[\w-]+|\/?>|\b[\w:-]+(?==)|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'/g;
const JAVASCRIPT_TOKEN_REGEX = /\/\/.*$|\/\*[\s\S]*?\*\/|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|`(?:\\.|[^`])*`|\b(?:break|case|catch|class|const|continue|default|delete|else|export|false|finally|for|function|if|import|in|let|new|null|return|switch|throw|true|try|typeof|undefined|var|while)\b|\b\d+(?:\.\d+)?\b/g;

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&#39;');
}

function highlightTokens(line, expression, classifier) {
  let cursor = 0;
  let output = '';

  expression.lastIndex = 0;

  for (const match of line.matchAll(expression)) {
    const [token] = match;
    const index = match.index ?? 0;
    const className = classifier(token);

    output += escapeHtml(line.slice(cursor, index));
    output += className ? `<span class="${className}">${escapeHtml(token)}</span>` : escapeHtml(token);
    cursor = index + token.length;
  }

  output += escapeHtml(line.slice(cursor));
  return output;
}

function classifyHtmlToken(token) {
  if (token.startsWith('"') || token.startsWith('\'')) {
    return 'example-code-token-string';
  }

  if (token.startsWith('</') || token.startsWith('<') || token === '/>' || token === '>') {
    return 'example-code-token-tag';
  }

  return 'example-code-token-attribute';
}

function classifyJavaScriptToken(token) {
  if (token.startsWith('//') || token.startsWith('/*')) {
    return 'example-code-token-comment';
  }

  if (token.startsWith('"') || token.startsWith('\'') || token.startsWith('`')) {
    return 'example-code-token-string';
  }

  if (/^\d/.test(token)) {
    return 'example-code-token-number';
  }

  return 'example-code-token-keyword';
}

function highlightCodeLine(line) {
  const trimmedLine = line.trimStart();

  if (trimmedLine.startsWith('<')) {
    return highlightTokens(line, HTML_TOKEN_REGEX, classifyHtmlToken);
  }

  return highlightTokens(line, JAVASCRIPT_TOKEN_REGEX, classifyJavaScriptToken);
}

function highlightCodeBlock(codeElement) {
  const source = codeElement.dataset.exampleConfigSource || codeElement.textContent || '';
  codeElement.dataset.exampleConfigSource = source;
  codeElement.innerHTML = source
    .split('\n')
    .map((line) => highlightCodeLine(line))
    .join('\n');
}

function fallbackCopyText(text, documentRef) {
  const helper = documentRef.createElement('textarea');
  helper.value = text;
  helper.setAttribute('readonly', '');
  helper.style.position = 'fixed';
  helper.style.opacity = '0';
  documentRef.body.append(helper);
  helper.select();
  documentRef.execCommand('copy');
  helper.remove();
}

function copyText(text, clipboard, documentRef) {
  if (clipboard && typeof clipboard.writeText === 'function') {
    return clipboard.writeText(text);
  }

  fallbackCopyText(text, documentRef);
  return Promise.resolve();
}

function getCopyButtonLabel(codeBlocks, codeBlock, index) {
  const customLabel = codeBlock.dataset.copyLabel;

  if (customLabel) {
    return `Copy ${customLabel}`;
  }

  if (codeBlocks.length === 1) {
    return 'Copy';
  }

  return `Copy ${index + 1}`;
}

function getCopyButtonText(codeBlocks, codeBlock, index) {
  const customLabel = codeBlock.dataset.copyLabel;

  if (customLabel) {
    return customLabel[0].toUpperCase() + customLabel.slice(1);
  }

  if (codeBlocks.length === 1) {
    return 'Copy';
  }

  return `${index + 1}`;
}

export function initializeExampleConfigurations({
  documentRef = document,
  clipboard = navigator.clipboard,
  setTimeoutRef = window.setTimeout.bind(window),
} = {}) {
  const cards = documentRef.querySelectorAll('[data-example-configuration]');

  cards.forEach((card) => {
    if (card.dataset.exampleConfigurationInitialized === 'true') {
      return;
    }

    const header = card.querySelector('.card-header');
    const codeBlocks = Array.from(card.querySelectorAll('pre > code'));

    if (!header || codeBlocks.length === 0) {
      return;
    }

    const actions = documentRef.createElement('div');
    actions.className = 'example-config-actions ms-auto d-flex flex-wrap justify-content-end gap-2';

    codeBlocks.forEach((codeBlock, index) => {
      highlightCodeBlock(codeBlock);
      codeBlock.classList.add('example-config-code');
      codeBlock.parentElement?.classList.add('example-config-pre');

      const button = documentRef.createElement('button');
      const defaultLabel = getCopyButtonLabel(codeBlocks, codeBlock, index);
      const buttonText = getCopyButtonText(codeBlocks, codeBlock, index);

      button.type = 'button';
      button.className = 'btn btn-sm btn-secondary example-config-copy-button';
      button.innerHTML = `<span aria-hidden="true">📋</span><span class="example-config-copy-button-label">${escapeHtml(buttonText)}</span>`;
      button.setAttribute('aria-label', defaultLabel);
      button.title = defaultLabel;

      button.addEventListener('click', () => {
        button.disabled = true;

        copyText(codeBlock.dataset.exampleConfigSource || codeBlock.textContent || '', clipboard, documentRef)
          .then(() => {
            button.classList.add('btn-success');
            button.classList.remove('btn-secondary');
            button.title = 'Copied';
            button.setAttribute('aria-label', 'Copied');
          })
          .catch(() => {
            button.classList.add('btn-danger');
            button.classList.remove('btn-secondary');
            button.title = 'Copy failed';
            button.setAttribute('aria-label', 'Copy failed');
          })
          .finally(() => {
            setTimeoutRef(() => {
              button.disabled = false;
              button.classList.remove('btn-success', 'btn-danger');
              button.classList.add('btn-secondary');
              button.title = defaultLabel;
              button.setAttribute('aria-label', defaultLabel);
            }, 1500);
          });
      });

      actions.append(button);
    });

    header.classList.add('example-config-header');
    header.append(actions);
    card.dataset.exampleConfigurationInitialized = 'true';
  });
}

function ensureThemeToggle(documentRef, onChange) {
  const existingToggle = documentRef.querySelector('[data-examples-theme-toggle]');

  if (existingToggle) {
    return existingToggle;
  }

  const container = documentRef.createElement('div');
  container.className = 'examples-theme-toggle';
  container.innerHTML = `
    <div class="form-check form-switch mb-0">
      <input
        class="form-check-input"
        type="checkbox"
        role="switch"
        id="examples-theme-toggle"
        data-examples-theme-toggle
        aria-label="Enable dark mode"
      >
      <label class="form-check-label" for="examples-theme-toggle">Dark mode</label>
    </div>
  `;

  documentRef.body.append(container);

  const toggle = container.querySelector('[data-examples-theme-toggle]');
  toggle.addEventListener('change', (event) => {
    onChange(event.currentTarget.checked ? 'dark' : 'light', true);
  });

  return toggle;
}

function ensureProjectLinks(documentRef) {
  const main = documentRef.querySelector('main.page');

  if (!main || main.querySelector('[data-examples-project-links]')) {
    return null;
  }

  const footer = documentRef.createElement('footer');
  footer.className = 'examples-project-links';
  footer.setAttribute('data-examples-project-links', 'true');
  footer.innerHTML = `
    <span class="examples-project-links-copy">
      Summernote Next by <a href="https://juergen-schwind.de" target="_blank" rel="noopener noreferrer">Jürgen Schwind</a>
    </span>
    <span class="examples-project-links-actions">
      ${PROJECT_LINKS.map(({ href, label }) => `
        <a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>
      `).join('')}
    </span>
  `;

  main.append(footer);
  return footer;
}

export function initializeExamplesTheme({
  documentRef = document,
  root = document.documentElement,
  storage = window.localStorage,
  mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)'),
} = {}) {
  if (!documentRef.body) {
    return null;
  }

  const storedTheme = getStoredTheme(storage);
  ensureProjectLinks(documentRef);
  initializeExampleConfigurations({ documentRef });
  const toggle = ensureThemeToggle(documentRef, (theme, persist = false) => {
    applyTheme(theme, root);
    toggle.checked = theme === 'dark';
    toggle.setAttribute('aria-pressed', String(theme === 'dark'));

    if (persist) {
      storage.setItem(THEME_STORAGE_KEY, theme);
    }
  });

  const initialTheme = storedTheme || (mediaQueryList.matches ? 'dark' : 'light');
  applyTheme(initialTheme, root);
  toggle.checked = initialTheme === 'dark';
  toggle.setAttribute('aria-pressed', String(initialTheme === 'dark'));

  if (!storedTheme && typeof mediaQueryList.addEventListener === 'function') {
    mediaQueryList.addEventListener('change', (event) => {
      const nextTheme = event.matches ? 'dark' : 'light';
      applyTheme(nextTheme, root);
      toggle.checked = nextTheme === 'dark';
      toggle.setAttribute('aria-pressed', String(nextTheme === 'dark'));
    });
  }

  return { toggle };
}

const root = document.documentElement;
applyTheme(getPreferredTheme(), root);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeExamplesTheme();
  }, { once: true });
} else {
  initializeExamplesTheme();
}
