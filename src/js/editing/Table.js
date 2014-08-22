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
      var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      var table = dom.ancestor(cell, dom.isTable);
      var cells = dom.litdHTMLescendant(table, dom.isCell);

      var nextCell = list[isShift ? 'prev' : 'next'](cells, cell);
      if (nextCell) {
        range.create(nextCell, 0).select();
      }
    };

    /**
     * create empty table element
     *
     * @param {Number} nRow
     * @param {Number} nCol
     */
    this.createTable = function (nCol, nRow) {
      var tds = [], tdHTML;
      for (var idxCol = 0; idxCol < nCol; idxCol++) {
        tds.push('<td>' + dom.blank + '</td>');
      }
      tdHTML = tds.join('');

      var trs = [], trHTML;
      for (var idxRow = 0; idxRow < nRow; idxRow++) {
        trs.push('<tr>' + tdHTML + '</tr>');
      }
      trHTML = trs.join('');
      return $('<table class="table table-bordered">' + trHTML + '</table>')[0];
    };
  };
  return Table;
});

