const postcss = require('postcss');

module.exports = postcss.plugin('reescape', (opts = { }) => {
  opts = opts || {};

  function reEscape(str) {
    return str.replace(/[\s\S]/g, function(character) {
      var escape = character.charCodeAt().toString(16),
          longhand = escape.length > 2;
      return longhand ? '\\' + ('0000' + escape).slice(longhand ? -4 : -2) : character;
    });
  }

  return (root, result) => {
    var customPseudoExp = /(.*::?)(after|before)$/;

    root.walkRules(function (rule) {
      if(rule.selectors.length === 1) {
        if(customPseudoExp.test(rule.selector)) {
          rule.walkDecls(function transformDecl(decl) {
            if(decl.prop === 'content') {
              decl.value = reEscape(decl.value);
            }
          });
        }
      }
    });
  }
})