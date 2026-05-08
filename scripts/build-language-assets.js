import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import locales from '../src/lang/registry.js';

export function buildLanguageAssetSource(language, payload) {
  const source = JSON.stringify(payload, null, 2);

  return [
    '(function(global) {',
    '  const summernote = global.summernote;',
    '  if (!summernote) {',
    '    return;',
    '  }',
    '',
    '  const registries = [];',
    '  summernote.lang = summernote.lang || {};',
    '  registries.push(summernote.lang);',
    '  if (summernote.summernote) {',
    '    summernote.summernote.lang = summernote.summernote.lang || {};',
    '    if (summernote.summernote.lang !== summernote.lang) {',
    '      registries.push(summernote.summernote.lang);',
    '    }',
    '  }',
    `  registries.forEach((registry) => { registry[${JSON.stringify(language)}] = ${source}; });`,
    '})(globalThis);',
    '',
  ].join('\n');
}

export async function buildLanguageAssets(outputDir = 'dist/lang') {
  await mkdir(outputDir, { recursive: true });

  await Promise.all(Object.entries(locales).map(async([language, payload]) => {
    const filename = join(outputDir, `${language.toLowerCase()}.js`);
    await writeFile(filename, buildLanguageAssetSource(language, payload));
  }));
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? fileURLToPath(pathToFileURL(process.argv[1])) : null;

if (invokedFile === currentFile) {
  await buildLanguageAssets();
}
