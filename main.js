var playerStats = require('./scripts/getStats');
var teamStats = require('./scripts/getTeamStats');
var championsService = require('./scripts/championsService');
var fs = require('fs');
var config = require('./config.json');

var arg = process.argv[2];

function main(arg) {
  switch (arg) {
    case '1':
      console.log('calc player stats...');
      playerStats.start(function() {
        console.log('done');
      });
      break;
    case '2':
      console.log('calc team stats...');
      teamStats.start(function() {
        console.log('done');
      });
      break;
    case '3':
      console.log('calc champions stats...');
      championsService.start(function() {
        console.log('done');
      });
      break;
    case '4':
      var workWithPlayerStats = require('./scripts/workWithStats');
      console.log('beautify stats...');
      workWithPlayerStats.start(function() {
        console.log('done');
      });
      break;
    default:
      console.log('error xD');
  }
}

function main2() {
  console.log('creating output directories');
  fs.existsSync('./' + config.player_stats.fileData.inputFilePath) || fs.mkdirSync('./' + config.player_stats.fileData.inputFilePath);
  fs.existsSync('./' + config.player_stats.fileData.outputFilePath) || fs.mkdirSync('./' + config.player_stats.fileData.outputFilePath);
  fs.existsSync('./' + config.player_stats.fileData.superOutputFilePath) || fs.mkdirSync('./' + config.player_stats.fileData.superOutputFilePath);
  console.log('done')
  console.log('calc player stats...');
  playerStats.start(function(users) {
    console.log('done');
    console.log('calc team stats...');
    teamStats.start(users, function(users) {
      console.log('done');
      console.log('calc champions stats...');
      championsService.start(users, function(users) {
        console.log('done');
        var workWithPlayerStats = require('./scripts/workWithStats');
        console.log('beautify stats...');
        workWithPlayerStats.start(users, function() {
          console.log('done');
        });
      });
    });
  });
}


// main(arg);
main2();
