var expect = require('chai').expect;

module.exports = {
  'Options - focus': function (client) {
    client
      /* jshint -W106 */
      .url(client.launch_url + '/options-focus.html')
      /* jshint +W106 */
      .pause(1000);

    client.expect.element('#summernote').to.be.present.before(1000);
    client.expect.element('#summernote').to.be.not.visible;

    // focused
    client.expect.element('.note-editable:focus').to.be.present;
    client.end();
  }
};
