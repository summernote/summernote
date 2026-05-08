import $$ from './core/dom-query.js';

export default function registerLanguage(language, payload) {
  $$.summernote = $$.summernote || {
    lang: {},
  };

  $$.extend(true, $$.summernote.lang, {
    [language]: payload,
  });
}
