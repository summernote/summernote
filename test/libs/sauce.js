// from: https://github.com/RTICWDT/college-scorecard/blob/8029b46f1283ed94c7f13662689374c399ff6740/test/sauce.js
var request = require('request');

var reportPassed = function(client, done) {
  if (!process.env.TRAVIS) { return done(); }

  var user = client.options.username;
  var key = client.options.accessKey;
  var jobId = client.sessionId;
  // console.log('client options:', client.options, '->', [user, key, jobId]);
  if (user && key && jobId) {
    var passed = client.currentTest.results.failed === 0;
    console.log('* updating job status:', jobId, passed);
    var url = 'https://saucelabs.com/rest/v1/' + user + '/jobs/' + jobId;
    return request.put({
      url: url,
      auth: {
        username: user,
        password: key
      },
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({passed: passed})
    }, function(res, status, body) {
      console.log('Sauce response:', body);
      done();
    });
  } else {
    console.log('not updating job status (no sauce creds?)');
    return done();
  }
};

module.exports = {
  reportPassed: reportPassed
};
