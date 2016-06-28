
var myFSAPI = require('./myFSapi');
var config = require('./../config.json');
var statsToSelect = config.player_stats.statsToSelect;
var globalResult = {
  gameCounter: 0
};

//
// starting the script
//
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
  if (statsToSelect.timlineStats.length) {
    globalResult.timlineStats = {};
    for (var j = 0; j < statsToSelect.timlineStats.length; j++) {
      globalResult.timlineStats[statsToSelect.timlineStats[j]] = [];
    }
  }
  if (statsToSelect.masteries.length) {
    globalResult.masteries = {};
    for (var l = 0; l < statsToSelect.masteries.length; l++) {
      globalResult.masteries[statsToSelect.masteries[l]] = [];
    }
  }
  if (statsToSelect.runes.length) {
    globalResult.runes = {};
    for (var m = 0; m < statsToSelect.runes.length; m++) {
      globalResult.runes[statsToSelect.runes[m]] = [];
    }
  }
  if (statsToSelect.stats.length) {
    globalResult.stats = {};
    for (var n = 0; n < statsToSelect.stats.length; n++) {
      globalResult.stats[statsToSelect.stats[n]] = [];
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
    if (statsToSelect.timlineStats.length) {
      for (var m = 0; m < statsToSelect.timlineStats.length; m++) {
        globalResult.timlineStats[statsToSelect.timlineStats[m]].push(data[i].additionaldata.timeline[statsToSelect.timlineStats[m]]);
      }
    }
    if (statsToSelect.masteries.length) {
      for (var n = 0; n < statsToSelect.masteries.length; n++) {
        globalResult.masteries[statsToSelect.masteries[n]].push(data[i].additionaldata.masteries[statsToSelect.masteries[n]]);
      }
    }
    if (statsToSelect.runes.length) {
      for (var o = 0; o < statsToSelect.runes.length; o++) {
        globalResult.runes[statsToSelect.runes[o]].push(data[i].additionaldata.runes[statsToSelect.runes[o]]);
      }
    }
    if (statsToSelect.stats.length) {
      for (var p = 0; p < statsToSelect.stats.length; p++) {
        globalResult.stats[statsToSelect.stats[p]].push(data[i].additionaldata.stats[statsToSelect.stats[p]]);
      }
    }
  }
  cb(globalResult, next);
}


function extractStats(statsToSelect, next) {
  myFSAPI.readFile(config.player_stats.fileData.inputFile, function(err, data) {
    if (err) {
      throw err;
    }
    var myData = JSON.parse(data);
    initGlobalResult(statsToSelect);
    addStats(myData.matches, statsToSelect, writeResult, next);
  });
}

function writeResult(myjson, next) {
  myFSAPI.writeFile(config.player_stats.fileData.outputFile, myjson, function(err) {
    if (err) {
      throw err;
    }
    console.log('saved');
    next();
  });
}
