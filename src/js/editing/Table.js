define(['core/dom'], function (dom) {
  var Table = function () {
    /**
     * Create empty table element
     * @param nRow {number}
     * @param nCol {number}
     */
    this.createTable = function (nCol, nRow) {
      var aTD = [], sTD;
      for (var idxCol = 0; idxCol < nCol; idxCol++) {
        aTD.push('<td>' + dom.blank + '</td>');
      }
      sTD = aTD.join('');

      var aTR = [], sTR;
      for (var idxRow = 0; idxRow < nRow; idxRow++) {
        aTR.push('<tr>' + sTD + '</tr>');
      }
      sTR = aTR.join('');
      var sTable = '<table class="table table-bordered">' + sTR + '</table>';

      return $(sTable)[0];
    };
  };
  return Table;
});

