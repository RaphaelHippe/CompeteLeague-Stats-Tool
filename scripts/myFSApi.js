var fs = require('fs');

module.exports = {
  readFile: readFile,
  writeFile: writeFile
};

function readFile(filename, cb) {
  fs.readFile(filename, 'utf-8', cb);
}

function writeFile(filename, data, cb) {
  fs.writeFile(filename, JSON.stringify(data), cb);
}
