const sauce = require('../libs/sauce');

module.exports = {
  after: sauce.reportResult,

  'Initialization': (client) => {
    /* eslint-disable */
    client.url(client.launch_url + '/initialization.html').pause(1000);

    client.expect.element('#summernote').to.be.present.before(1000);
    client.expect.element('#summernote').to.be.not.visible;
    client.expect.element('.note-editor').to.be.present;
    /* eslint-enable */

    client.end();
  }
};
