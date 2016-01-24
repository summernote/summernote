module.exports = {
  'i18n ko-KR' : function (client) {
    client
      /* jshint -W106 */
      .url(client.launch_url + '/i18n-kokr.html')
      /* jshint +W106 */
      .waitForElementPresent('#summernote', 1000);

    client.expect.element('.note-btn-group.note-font .note-btn-bold')
                 .to.have.attribute('data-original-title').which.contain('굵게');
    client.expect.element('.note-btn-group.note-font .note-btn-underline')
                 .to.have.attribute('data-original-title').which.contain('밑줄');
    client.expect.element('.note-btn-group.note-color .note-current-color-button')
                 .to.have.attribute('data-original-title').which.equal('마지막으로 사용한 색');
    client.expect.element('.note-btn-group.note-view > .btn-fullscreen')
                 .to.have.attribute('data-original-title').which.equal('전체 화면');
    client.expect.element('.note-btn-group.note-view > .btn-codeview')
                 .to.have.attribute('data-original-title').which.equal('코드 보기');
    client.end();
  }
};
