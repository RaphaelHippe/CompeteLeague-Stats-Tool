var myFSAPI = require('./myFSapi');
var champions = require('./champions.json');
var config = require('./../config.json');

function getChampion(id) {
  var name = '';
  Object.keys(champions.data).forEach(function(key) {
    if (champions.data[key].key == id) {
      name = champions.data[key].id;
    }
  });
  return name;
}

function writeResult(myjson, file, cb) {
  myFSAPI.writeFile(file, myjson, function(err) {
    if (err) {
      throw err;
    }
    console.log('saved');
    cb();
  });
}

module.exports = {
  start: start
};

function MyAfter(amount, cb) {
  this.amount = amount;
  this.cb = cb;
  this.current = 0;
  this.called = function () {
    this.current++;
    if (this.current === this.amount) {
      cb();
    }
  };
}


function start(users, next) {
  console.log('testssssssssss');
  var MyRequestCounter = new MyAfter(users.length, function () {

    myFSAPI.readFile(config.team_stats.fileData.outputFilePath + 'tmpTeamResult' + config.request.teamid + '.json', function(err, data) {
      if (err) {
        throw err;
      }
      var myDataTwo = JSON.parse(data);
      if (myDataTwo.additionaldata.bans.length) {
        for (var i = 0; i < myDataTwo.additionaldata.bans.length; i++) {
          if (myDataTwo.additionaldata.bans[i] && myDataTwo.additionaldata.bans[i].length) {
            for (var k = 0; k < myDataTwo.additionaldata.bans[i].length; k++) {
              myDataTwo.additionaldata.bans[i][k].championId = getChampion(myDataTwo.additionaldata.bans[i][k].championId);
            }
          }
        }
      }
      writeResult(myDataTwo, config.team_stats.fileData.superOutputFilePath  + 'StatsForTeam' + config.request.teamid + '.json', function () {
        console.log('Done writing team stats');
        next(users);
        // here
      });
    });

  });

  users.forEach(function (user, index) {
    myFSAPI.readFile(config.player_stats.fileData.outputFilePath + 'tmpUserResult' + user.user + '.json', function(err, data) {
      if (err) {
        throw err;
      }
      var myData = JSON.parse(data);
      for (var i = 0; i < myData.additionaldata.championId.length; i++) {
        myData.additionaldata.championId[i] = getChampion(myData.additionaldata.championId[i]);
      }
      writeResult(myData, config.player_stats.fileData.superOutputFilePath  + 'StatsForUser' + user.user + '.json', function() {
        MyRequestCounter.called();
        console.log('Done writing user stats', user.user);
      });
    });
  });
}
