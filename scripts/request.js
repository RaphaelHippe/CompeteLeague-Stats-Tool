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
    console.log('body', body.Token);
    token = body.Token;
    cb();
  });
}

function getStats(cb) {
  // auth(function () {
    request({
      method: 'GET',
      headers: {
        "Token": token
      },
      url: config.request.baseurl + '/Team/' + config.request.teamid
    }, function (error, response, body) {
      if (error) {
        console.log('error', error);
      } else {
        // console.log('body', body);
        team = JSON.parse(body);
        request({
          method: 'GET',
          headers: {
            "Token": token
          },
          url: config.request.baseurl + '/Team/' + config.request.teamid + '/lolstatsdetail'
        }).pipe(fs.createWriteStream('../results/teamStatsRaw' + config.request.teamid + '.json'));
        for (var i = 0; i < team.users.length; i++) {
          console.log('user', i, team.users[i]);
          request({
            method: 'GET',
            headers: {
              "Token": token
            },
            url: config.request.baseurl + '/User/' + team.users[i].user + '/lolstatsdetail'
          }).pipe(fs.createWriteStream('../results/userStatsRaw' + team.users[i].user + '.json'));
        }
      }
    });
  // });
  cb(team.users);
}

getStats();

module.exports = {
  getStats: getStats,
};
