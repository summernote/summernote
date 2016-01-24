module.exports = {
  'Initialization' : function (client) {
    client
      /* jshint -W106 */
      .url(client.launch_url + '/initialization.html')
      /* jshint +W106 */
      .pause(1000);

    client.expect.element('#summernote').to.be.present.before(1000);
    client.expect.element('#summernote').to.be.not.visible;

    client.expect.element('.note-editor').to.be.present;
    client.expect.element('.note-editing-area').to.be.present;
    client.expect.element('.note-editing-area .note-editable').to.be.present;
    client.expect.element('.note-statusbar').to.be.present;
  },

  'default toolbar' : function (client) {
    // default toolbar
    client.expect.element('.note-toolbar').to.be.present;

    client.expect.element('.note-btn-group.note-style').to.be.present;
      client.expect.element('.note-btn-group.note-style .dropdown-toggle')
                   .to.have.attribute('data-original-title').which.equal('Style');;
    client.expect.element('.note-btn-group.note-font').to.be.present;
      client.expect.element('.note-btn-group.note-font .note-btn-bold')
                   .to.have.attribute('data-original-title').which.contain('Bold');
      client.expect.element('.note-btn-group.note-font .note-btn-underline')
                   .to.have.attribute('data-original-title').which.contain('Underline');
      client.expect.element('.note-btn-group.note-font > .note-btn:nth-child(3)')
                   .to.have.attribute('data-original-title').which.contain('Remove Font Style');
    client.expect.element('.note-btn-group.note-fontname').to.be.present;
      client.expect.element('.note-btn-group.note-fontname .dropdown-toggle')
                   .to.have.attribute('data-original-title').which.equal('Font Family');
    client.expect.element('.note-btn-group.note-color').to.be.present;
      client.expect.element('.note-btn-group.note-color .note-current-color-button')
                   .to.have.attribute('data-original-title').which.equal('Recent Color');
      client.expect.element('.note-btn-group.note-color .dropdown-toggle')
                   .to.have.attribute('data-original-title').which.equal('More Color');
    client.expect.element('.note-btn-group.note-para').to.be.present;
      client.expect.element('.note-btn-group.note-para > .note-btn:nth-child(1)')
                   .to.have.attribute('data-original-title').which.contain('Ordered list');
      client.expect.element('.note-btn-group.note-para > .note-btn:nth-child(2)')
                   .to.have.attribute('data-original-title').which.contain('Unordered list');
      client.expect.element('.note-btn-group.note-para .dropdown-toggle')
                   .to.have.attribute('data-original-title').which.contain('Paragraph');
    client.expect.element('.note-btn-group.note-table').to.be.present;
      client.expect.element('.note-btn-group.note-table .dropdown-toggle')
                   .to.have.attribute('data-original-title').which.equal('Table');
    client.expect.element('.note-btn-group.note-insert').to.be.present;
      client.expect.element('.note-btn-group.note-insert > .note-btn:nth-child(1)')
                   .to.have.attribute('data-original-title').which.equal('Link');
      client.expect.element('.note-btn-group.note-insert > .note-btn:nth-child(2)')
                   .to.have.attribute('data-original-title').which.equal('Picture');
      client.expect.element('.note-btn-group.note-insert > .note-btn:nth-child(3)')
                   .to.have.attribute('data-original-title').which.equal('Video');
    client.expect.element('.note-btn-group.note-view').to.be.present;
      client.expect.element('.note-btn-group.note-view > .btn-fullscreen')
                   .to.have.attribute('data-original-title').which.equal('Full Screen');
      client.expect.element('.note-btn-group.note-view > .btn-codeview')
                   .to.have.attribute('data-original-title').which.equal('Code View');
      client.expect.element('.note-btn-group.note-view > .note-btn:nth-child(3)')
                   .to.have.attribute('data-original-title').which.equal('Help');
    client.end();
  }
};
