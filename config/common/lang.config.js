const testFolder = './lang/';
const fs = require('fs');

const files = fs.readdirSync(testFolder);

let entries = {};

files.forEach(file => {
  const key = file.split('.')[0];

  entries[key] = `./lang/${file}`;
});

module.exports = entries;
