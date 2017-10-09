module.exports = {
  'Initialization': function (client) {
    client
      /* jshint -W106 */
      .url(client.launch_url + '/initialization.html')
      /* jshint +W106 */
      .pause(1000);

    client.expect.element('#summernote').to.be.present.before(1000);
    client.expect.element('#summernote').to.be.not.visible;
    client.expect.element('.note-editor').to.be.present;

    client.end();
  }
};
