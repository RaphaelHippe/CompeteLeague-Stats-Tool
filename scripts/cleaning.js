var fs = require('fs');
var config = require('./../config.json');


function start() {
  fs.readdir('../' + config.player_stats.fileData.inputFilePath, function (err, files) {
    console.log('files 1', files);
    if (files) {
      files.forEach(function (file, index) {
        fs.unlink('../' + config.player_stats.fileData.inputFilePath + '/' + file, callback);
      });
    }
  });
  fs.readdir('../' + config.player_stats.fileData.outputFilePath, function (err, files) {
    console.log('files 2', files);
    if (files) {
      files.forEach(function (file, index) {
        fs.unlink('../' + config.player_stats.fileData.outputFilePath + '/' + file, callback);
      });
    }
  });
  fs.readdir('../' + config.player_stats.fileData.superOutputFilePath, function (err, files) {
    console.log('files 3', files);
    if (files) {
      files.forEach(function (file, index) {
        fs.unlink('../' + config.player_stats.fileData.superOutputFilePath + '/' + file, callback);
      });
    }
  });
}

function callback() {
  console.log('deleted!');
}

start();

module.export = {
  start: start
};
