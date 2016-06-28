var myFSAPI = require('./myFSapi');
var sortedStatsPlayer = require('./../results/result_player.json');
var sortedStatsTeam = require('./../results/result_team.json');
var config = require('./../config.json');
//
// starting the script
//
module.exports = {
  start: start
};

function start(next) {
  main(next);
}


function main(next) {
  var resultPlayer = {};
  resultPlayer.champions = countChampions(sortedStatsPlayer.additionaldata.championId);
  resultPlayer.avgCSDeltas = csDeltas(sortedStatsPlayer.timlineStats.creepsPerMinDeltas, sortedStatsPlayer.gameCounter);
  resultPlayer.avgGoldDeltas = goldDeltas(sortedStatsPlayer.timlineStats.goldPerMinDeltas, sortedStatsPlayer.gameCounter);
  resultPlayer.gameCounter = sortedStatsPlayer.gameCounter;
  myFSAPI.writeFile(config.player_stats.fileData.superOutputFile, resultPlayer, function(err) {
    if (err) {
      throw err;
    }
    console.log('saved player');
    var resultTeam = {};
    resultTeam.bans = countChampionBans(sortedStatsTeam.additionaldata.bans);
    resultTeam.ObjectivesAvg = teamObjectiveAvg(sortedStatsTeam.topLevelStats, sortedStatsTeam.gameCounter);
    resultTeam.firsts = teamFirsts(sortedStatsTeam.additionaldata);
    resultTeam.gameCounter = sortedStatsTeam.gameCounter;
    myFSAPI.writeFile(config.team_stats.fileData.superOutputFile, resultTeam, function(err) {
      if (err) {
        throw err;
      }
      console.log('saved team');
      next();
    });
  });
}


// Championcount:
// sortedStatsPlayer.additionaldata.championId
function countChampions(championArray) {
  var obj = {};
  for (var i = 0; i < championArray.length; i++) {
    if (obj[championArray[i]]) {
      obj[championArray[i]]++;
    } else {
      obj[championArray[i]] = 1;
    }
  }
  return obj;
}

// count champion bans
function countChampionBans(bans) {
  var obj = {};
  for (var i = 0; i < bans.length; i++) {
    if (bans[i]) {
      for (var j = 0; j < bans[i].length; j++) {
        if (obj[bans[i][j].championId]) {
          obj[bans[i][j].championId]++;
        } else {
          obj[bans[i][j].championId] = 1;
        }
      }
    }
  }
  return obj;
}

// Team Dragon / Baron / turrets avg
function teamObjectiveAvg(topLevelStats, gameCounter) {
  var dragons = 0;
  var barons = 0;
  var turrets = 0;
  for (var i = 0; i < topLevelStats.dragons.length; i++) {
    dragons += topLevelStats.dragons[i];
    barons += topLevelStats.barons[i];
    turrets += topLevelStats.turrets[i];
  }
  return {
    dragonsAvg: dragons / gameCounter,
    baronsAvg: barons / gameCounter,
    turretsAvg: turrets / gameCounter
  };
}

// team data firsts

function teamFirsts(additionaldata) {
  var firstBlood = 0;
  var firstTower = 0;
  var firstInhibitor = 0;
  var firstBaron = 0;
  var firstDragon = 0;
  var firstRiftHerald = 0;
  var winner = 0;

  for (var i = 0; i < additionaldata.firstBlood.length; i++) {
    firstBlood += additionaldata.firstBlood[i];
    firstTower += additionaldata.firstTower[i];
    firstInhibitor += additionaldata.firstInhibitor[i];
    firstDragon += additionaldata.firstDragon[i];
    firstRiftHerald += additionaldata.firstRiftHerald[i];
    winner += additionaldata.winner[i];
  }

  return {
    firstBlood: firstBlood,
    firstTower: firstTower,
    firstInhibitor: firstInhibitor,
    firstBaron: firstBaron,
    firstDragon: firstDragon,
    firstRiftHerald: firstRiftHerald,
    winner: winner
  };

}


// cs delta
// timlineStats.creepsPerMinDeltas
function csDeltas(creepsPerMinDeltas, gameCounter) {
  var csPerMinZeroToTen = 0;
  var csPerMinTenToTwenty = 0;
  var csPerMinTwentyToThirty = 0;
  var csPerMinThirtyToEnd = 0;
  var gameCounterAdjustTenToTwenty = 0;
  var gameCounterAdjustTwentyToThirty = 0;
  var gameCounterAdjustThirtyToEnd = 0;
  for (var i = 0; i < creepsPerMinDeltas.length; i++) {
    csPerMinZeroToTen += creepsPerMinDeltas[i].zeroToTen;
    if (creepsPerMinDeltas[i].tenToTwenty) {
      csPerMinTenToTwenty += creepsPerMinDeltas[i].tenToTwenty;
    } else {
      gameCounterAdjustTenToTwenty++;
    }
    if (creepsPerMinDeltas[i].twentyToThirty) {
      csPerMinTwentyToThirty += creepsPerMinDeltas[i].twentyToThirty;
    } else {
      gameCounterAdjustTwentyToThirty++;
    }
    if (creepsPerMinDeltas[i].thirtyToEnd) {
      csPerMinThirtyToEnd += creepsPerMinDeltas[i].thirtyToEnd;
    } else {
      gameCounterAdjustThirtyToEnd++;
    }

  }
  return {
    zeroToten: csPerMinZeroToTen / gameCounter,
    tenToTwenty: csPerMinTenToTwenty / (gameCounter - gameCounterAdjustTenToTwenty),
    twentyToThirty: csPerMinTwentyToThirty / (gameCounter - gameCounterAdjustTwentyToThirty),
    thirtyToEnd: csPerMinThirtyToEnd / (gameCounter - gameCounterAdjustThirtyToEnd)
  };
}

// cs delta 0 - 10
// timlineStats.creepsPerMinDeltas
function goldDeltas(goldperMinDelta, gameCounter) {
  var goldPerMinZeroToTen = 0;
  var goldPerMinTenToTwenty = 0;
  var goldPerMinTwentyToThirty = 0;
  var goldPerMinThirtyToEnd = 0;
  var gameCounterAdjustTenToTwenty = 0;
  var gameCounterAdjustTwentyToThirty = 0;
  var gameCounterAdjustThirtyToEnd = 0;
  for (var i = 0; i < goldperMinDelta.length; i++) {
    goldPerMinZeroToTen += goldperMinDelta[i].zeroToTen;
    if (goldperMinDelta[i].tenToTwenty) {
      goldPerMinTenToTwenty += goldperMinDelta[i].tenToTwenty;
    } else {
      gameCounterAdjustTenToTwenty++;
    }
    if (goldperMinDelta[i].twentyToThirty) {
      goldPerMinTwentyToThirty += goldperMinDelta[i].twentyToThirty;
    } else {
      gameCounterAdjustTwentyToThirty++;
    }
    if (goldperMinDelta[i].thirtyToEnd) {
      goldPerMinThirtyToEnd += goldperMinDelta[i].thirtyToEnd;
    } else {
      gameCounterAdjustThirtyToEnd++;
    }

  }
  return {
    zeroToten: goldPerMinZeroToTen / gameCounter,
    tenToTwenty: goldPerMinTenToTwenty / (gameCounter - gameCounterAdjustTenToTwenty),
    twentyToThirty: goldPerMinTwentyToThirty / (gameCounter - gameCounterAdjustTwentyToThirty),
    thirtyToEnd: goldPerMinThirtyToEnd / (gameCounter - gameCounterAdjustThirtyToEnd)
  };
}
