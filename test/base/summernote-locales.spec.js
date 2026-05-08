import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import locales from '@/lang/registry.js';

const supportedLocales = [
  'ar-AR',
  'bn-BD',
  'de-DE',
  'es-ES',
  'fr-FR',
  'id-ID',
  'it-IT',
  'ja-JP',
  'ko-KR',
  'nl-NL',
  'pl-PL',
  'pt-BR',
  'ru-RU',
  'tr-TR',
  'zh-CN',
  'zh-TW',
];

describe('summernote locale registry', () => {
  let previousSummernote;

  beforeEach(() => {
    previousSummernote = $$.summernote;
  });

  afterEach(() => {
    if (previousSummernote === undefined) {
      delete $$.summernote;
    } else {
      $$.summernote = previousSummernote;
    }
  });

  it('exports the supported locale payloads', () => {
    expect(Object.keys(locales).sort()).to.deep.equal([...supportedLocales].sort());
    expect(locales['fr-FR'].font.bold).to.equal('Gras');
    expect(locales['zh-CN'].options.help).to.equal('帮助');
    expect(locales['ar-AR'].paragraph.paragraph).to.exist;
  });

  it('registers additional locale bundles on demand', async() => {
    delete $$.summernote;

    for (const locale of supportedLocales) {
      await import(/* @vite-ignore */ `/src/js/summernote-${locale}.js?fresh=${Math.random()}`);
    }

    expect(Object.keys($$.summernote.lang).sort()).to.deep.equal([...supportedLocales].sort());
    expect($$.summernote.lang['ar-AR'].font.bold).to.equal('عريض');
    expect($$.summernote.lang['fr-FR'].link.insert).to.equal('Insérer un lien');
    expect($$.summernote.lang['ja-JP'].options.help).to.equal('ヘルプ');
    expect($$.summernote.lang['zh-CN'].link.insert).to.equal('插入链接');
    expect($$.summernote.lang['zh-TW'].link.insert).to.equal('插入連結');
  });
});
