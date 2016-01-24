var expect = require('chai').expect;

module.exports = {
  'Options - height': function (client) {
    client
      /* jshint -W106 */
      .url(client.launch_url + '/options-height.html')
      /* jshint +W106 */
      .waitForElementPresent('#summernote', 1000);

    client.expect.element('.note-editable')
                 .to.have.css('height').which.equals('400px');
    client.expect.element('.note-editable')
                 .to.have.css('max-height').which.equals('600px');
    client.expect.element('.note-editable')
                 .to.have.css('min-height').which.equals('200px');
    client.end();
  }
};
