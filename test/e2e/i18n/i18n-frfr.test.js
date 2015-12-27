module.exports = {
  'i18n fr-FR' : function (client) {
    client
      /* jshint -W106 */
      .url(client.launch_url + '/i18n-frfr.html')
      /* jshint +W106 */
      .waitForElementPresent('#summernote', 1000);

    client.expect.element('.note-btn-group.note-font .note-btn-bold')
                 .to.have.attribute('data-original-title').which.contain('Gras');
    client.expect.element('.note-btn-group.note-font .note-btn-underline')
                 .to.have.attribute('data-original-title').which.contain('Souligné');
    client.expect.element('.note-btn-group.note-color .note-current-color-button')
                 .to.have.attribute('data-original-title').which.equal('Dernière couleur sélectionnée');
    client.expect.element('.note-btn-group.note-view > .btn-fullscreen')
                 .to.have.attribute('data-original-title').which.equal('Plein écran');
    client.expect.element('.note-btn-group.note-view > .btn-codeview')
                 .to.have.attribute('data-original-title').which.equal('Afficher le code HTML');
    client.end();
  }
};
