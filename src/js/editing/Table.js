define([
  'summernote/core/dom', 'summernote/core/range', 'summernote/core/list'
], function (dom, range, list) {
  /**
   * Table
   * @class
   */
  var Table = function () {
    /**
     * handle tab key
     *
     * @param {WrappedRange} rng
     * @param {Boolean} isShift
     */
    this.tab = function (rng, isShift) {
      var elCell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      var elTable = dom.ancestor(elCell, dom.isTable);
      var aCell = dom.listDescendant(elTable, dom.isCell);

      var elNext = list[isShift ? 'prev' : 'next'](aCell, elCell);
      if (elNext) {
        range.create(elNext, 0).select();
      }
    };

    /**
     * create empty table element
     *
     * @param {Number} nRow
     * @param {Number} nCol
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

