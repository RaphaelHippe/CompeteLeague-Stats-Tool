
var myFSAPI = require('./myFSapi');
var config = require('./../config.json');

var statsToSelect = config.team_stats.statsToSelect;
var globalResult = {
  gameCounter: 0
};

module.exports = {
  start: start
};

function start(next) {
  extractStats(statsToSelect, next);
}

function initGlobalResult(statsToSelect) {
  if (statsToSelect.topLevelStats.length) {
    globalResult.topLevelStats = {};
    for (var k = 0; k < statsToSelect.topLevelStats.length; k++) {
      globalResult.topLevelStats[statsToSelect.topLevelStats[k]] = [];
    }
  }
  if (statsToSelect.additionaldata.length) {
    globalResult.additionaldata = {};
    for (var i = 0; i < statsToSelect.additionaldata.length; i++) {
      globalResult.additionaldata[statsToSelect.additionaldata[i]] = [];
    }
  }
}

function addStats(data, statsToSelect, cb, next) {
  for (var i = 0; i < data.length; i++) {
    globalResult.gameCounter++;
    if (statsToSelect.topLevelStats.length) {
      for (var k = 0; k < statsToSelect.topLevelStats.length; k++) {
        globalResult.topLevelStats[statsToSelect.topLevelStats[k]].push(data[i][statsToSelect.topLevelStats[k]]);
      }
    }
    if (statsToSelect.additionaldata.length) {
      for (var l = 0; l < statsToSelect.additionaldata.length; l++) {
        globalResult.additionaldata[statsToSelect.additionaldata[l]].push(data[i].additionaldata[statsToSelect.additionaldata[l]]);
      }
    }
  }
  cb(globalResult, next);
}


function extractStats(statsToSelect, next) {
  myFSAPI.readFile(config.team_stats.fileData.inputFile, function(err, data) {
    if (err) {
      throw err;
    }
    var myData = JSON.parse(data);
    initGlobalResult(statsToSelect);
    addStats(myData.matches, statsToSelect, writeResult, next);
  });
}

function writeResult(myjson, next) {
  myFSAPI.writeFile(config.team_stats.fileData.outputFile, myjson, function(err) {
    if (err) {
      throw err;
    }
    console.log('saved');
    next();
  });
}
