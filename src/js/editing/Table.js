define([
  'summernote/core/dom', 'summernote/core/range', 'summernote/core/list'
], function (dom, range, list) {
  /**
   * @class editing.Table
   *
   * Table
   *
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
      var cells = dom.listDescendant(table, dom.isCell);

      var nextCell = list[isShift ? 'prev' : 'next'](cells, cell);
      if (nextCell) {
        range.create(nextCell, 0).select();
      }
    };
    
    /**
     * Add a new row
     *
     * @param {WrappedRange} rng
     * @param {String} position (top/bottom)
     * @return {Node}
     */
    this.addRow = function (rng, position) {
      var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      var table = dom.ancestor(cell, dom.isTable);

      var currentTr = $(cell).closest('tr');
      var nbCell = currentTr.find('td').length;

      var html = $('<tr></tr>');
      for(var idCell = 0; idCell < nbCell; idCell++)
      {
        html.append('<td>'+ dom.blank +'</td>');
      }

      if(position == 'top')
      {
        currentTr.before(html);
      }
      else
      {
        currentTr.after(html);
      }

    };

    /**
     * Add a new col
     *
     * @param {WrappedRange} rng
     * @param {String} position (left/right)
     * @return {Node}
     */
    this.addCol = function (rng, position) {
      var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      var table = dom.ancestor(cell, dom.isTable);

      var currentTr = $(cell).closest('tr');
      var cellPos = currentTr.find('td').index($(cell));
      var nbTr = $(table).find('tr').length;

      for(var idTr = 0; idTr < nbTr; idTr++)
      {
        var r = $(table).find('tr')[idTr];
        var c = $(r).find('td')[cellPos];
        $(c).after('<td>'+ dom.blank +'</td>');
      }

    };

    /**
     * create empty table element
     *
     * @param {Number} rowCount
     * @param {Number} colCount
     * @return {Node}
     */
    this.createTable = function (colCount, rowCount) {
      var tds = [], tdHTML;
      for (var idxCol = 0; idxCol < colCount; idxCol++) {
        tds.push('<td>' + dom.blank + '</td>');
      }
      tdHTML = tds.join('');

      var trs = [], trHTML;
      for (var idxRow = 0; idxRow < rowCount; idxRow++) {
        trs.push('<tr>' + tdHTML + '</tr>');
      }
      trHTML = trs.join('');
      return $('<table class="table table-bordered">' + trHTML + '</table>')[0];
    };
  };
  return Table;
});

