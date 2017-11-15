// from: https://github.com/RTICWDT/college-scorecard/blob/8029b46f1283ed94c7f13662689374c399ff6740/test/sauce.js
const request = require('request');

const reportResult = (client, done) => {
  if (!process.env.TRAVIS) { return done(); }

  const user = client.options.username;
  const key = client.options.accessKey;
  const jobId = client.capabilities['webdriver.remote.sessionid'];

  if (user && key && jobId) {
    const passed = client.currentTest.results.failed === 0;
    console.log('* updating job status:', jobId, passed);
    const url = 'https://saucelabs.com/rest/v1/' + user + '/jobs/' + jobId;
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
  reportResult: reportResult
};
