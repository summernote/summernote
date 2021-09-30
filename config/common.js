const { readdirSync, readFileSync } = require('fs');
const glob = require('glob');
const path = require('path');

module.exports = {
  getStyles: function() {
    return readdirSync("./src/styles", { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name != 'summernote')
      .map(dirent => { 
        const id = dirent.name;
        let name;
        
        try {
          let info = JSON.parse(readFileSync(`./src/styles/${id}/summernote-${id}.json`));
          name = info.name ?? id;
        } catch {
          name = id;
        }
        return { id, name };
      });
  },

  getLocales: function() {
    return glob.sync("./src/locales/*.js").map(f => path.basename(f, '.js'));
  },
};
