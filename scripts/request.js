var request = require('request');
var config = require('./../config.json');
var fs = require('fs');
var token;
var team;


function auth(cb) {
  request({
    method: 'POST',
    headers: {
      "content-type": "application/json"
    },
    url: config.request.auth.url,
    json: true,
    body: {
      email: config.request.auth.username,
      password: config.request.auth.password
    }
  }, function(error, response, body) {
    // console.log('body', body.Token);
    token = body.Token;
    cb();
  });
}

function getStats(cb) {
  auth(function() {
    request({
          method: 'GET',
          headers: {
            "Token": token
          },
          url: config.request.baseurl + '/Team/' + config.request.teamid
        }, function(error, response, body) {
          if (error) {
            console.log('error', error);
			return;
          } else if(response.statusCode != 200){
			console.log('API did not send the expected result. Error is: ', JSON.parse(body));
			return;
		  } else {
            team = JSON.parse(body);
            var MyRequestCounter = new MyAfter(team.users.length, function () {
              cb(team.users);
            });
            request({
              method: 'GET',
              headers: {
                "Token": token
              },
              url: config.request.baseurl + '/Team/' + config.request.teamid + '/lolstatsdetail'
            })
            .pipe(fs.createWriteStream(config.team_stats.fileData.inputFilePath + 'teamStatsRaw' + config.request.teamid + '.json'));

              team.users.forEach(function (user, index) {
                console.log('user', index, user);
                request({
                  method: 'GET',
                  headers: {
                    "Token": token
                  },
                  url: config.request.baseurl + '/User/' + user.user + '/lolstatsdetail'
                }, function (error, response, body) {
					if(response.statusCode != 200){
						console.log('API did not send the expected result. Error is: ', JSON.parse(body));
						return;
					}else{
						MyRequestCounter.called();
					}
                })
                .pipe(fs.createWriteStream(config.player_stats.fileData.inputFilePath + 'userStatsRaw' + user.user + '.json'));
              });

          }
        });
  });
}


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


// getStats();

module.exports = {
  getStats: getStats,
};
