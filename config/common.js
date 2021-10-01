const { readdirSync, readFileSync } = require('fs');
const glob = require('glob');
const path = require('path');

module.exports = {
  styles: 
    // Find all style directories in /src/styles
    readdirSync("./src/styles", { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name != 'summernote')
      .map(dirent => { 
        const id = dirent.name;
        let name;
        
        // Try to find information json file and get them.
        try {
          let info = JSON.parse(readFileSync(`./src/styles/${id}/summernote-${id}.json`));
          name = info.name ?? id;
        } catch {
          name = id;
        }
        return { id, name };
      }),

  locales:
    glob.sync("./src/locales/*.js")
      .map(name => path.basename(name, '.js')),

  examples:
    // Regard all html files in examples directory as examples
    glob.sync("./examples/*.html")
      .filter(f => f.charAt(0) != '_') // except files start with underscore
      .map(filepath => { 
        let title;
        let name = path.parse(filepath).name;
        
        // Try to parse html and get <title> from it.
        try {
          let html = readFileSync(filepath).toString();
          title = html.match(/<title[^>]*>([^<]+)<\/title>/)[1];
        } catch {
          title = name;
        }
        return { filepath, name, title };
      }),
};
