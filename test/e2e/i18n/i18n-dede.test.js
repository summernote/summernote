module.exports = {
  'i18n de-De' : function (client) {
    client
      /* jshint -W106 */
      .url(client.launch_url + '/i18n-dede.html')
      /* jshint +W106 */
      .waitForElementPresent('#summernote', 1000);

    client.expect.element('.note-btn-group.note-font .note-btn-bold')
                 .to.have.attribute('data-original-title').which.contain('Fett');
    client.expect.element('.note-btn-group.note-font .note-btn-underline')
                 .to.have.attribute('data-original-title').which.contain('Unterstreichen');
    client.expect.element('.note-btn-group.note-color .note-current-color-button')
                 .to.have.attribute('data-original-title').which.equal('Letzte Farbe');
    client.expect.element('.note-btn-group.note-view > .btn-fullscreen')
                 .to.have.attribute('data-original-title').which.equal('Vollbild');
    client.expect.element('.note-btn-group.note-view > .btn-codeview')
                 .to.have.attribute('data-original-title').which.equal('HTML-Code anzeigen');
    client.end();
  }
};
