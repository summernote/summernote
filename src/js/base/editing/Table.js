define([
  'summernote/base/core/dom',
  'summernote/base/core/range',
  'summernote/base/core/list'
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

      var currentTr = $(cell).closest('tr');
      var nbCell = currentTr.find('td').length;
      var cells = currentTr.find('td');

      var trAttributes = this.recoverAttributes(currentTr);
      var html = $('<tr' + trAttributes + '></tr>');
      
      for (var idCell = 0; idCell < nbCell; idCell++)
      {
        var currentCell = cells[idCell];
        var tdAttributes = this.recoverAttributes(currentCell);
        html.append('<td' + tdAttributes + '>' + dom.blank + '</td>');
      }

      if (position === 'top')
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
      var row = $(cell).closest('tr');
      var rowsGroup = $(row).siblings();
      rowsGroup.push(row);
      var cellPos = row.children('td, th').index($(cell));

      for (var idTr = 0; idTr < rowsGroup.length; idTr++) {
        var r = rowsGroup[idTr];
        var c = $(r).children('td, th')[cellPos];
        var tdAttributes = this.recoverAttributes(c);

        if (position === 'right')
        {
          $(c).after('<td' + tdAttributes + '>' + dom.blank + '</td>');
        }
        else
        {
          $(c).before('<td' + tdAttributes + '>' + dom.blank + '</td>');
        }
      }
    };

    /*
    * Copy attributes from element.
    *
    * @param {object} Element to recover attributes.
    * @return {string} Copied string elements.
    */
    this.recoverAttributes = function (el) {
        var resultStr = '';
        
        if (!el) {
          return resultStr;
        }

        var attrList = el.attributes || [];

        for (var i = 0; i < attrList.length; i++) {
          if (attrList[i].name.toLowerCase() === 'id') {
            continue;
          }

          if (attrList[i].specified) {
            resultStr += ' ' + attrList[i].name + '=\'' + attrList[i].value + '\'';
          }
        }

        return resultStr;
      };

    /**
     * Delete current row
     *
     * @param {WrappedRange} rng
     * @return {Node}
     */
    this.deleteRow = function (rng) {
      var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      $(cell).closest('tr').remove();
    };

    /**
     * Delete current col
     *
     * @param {WrappedRange} rng
     * @return {Node}
     */
    this.deleteCol = function (rng) {
      var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      var row = $(cell).closest('tr');
      var rowsGroup = $(row).siblings();
      rowsGroup.push(row);
      var cellPos = row.children('td, th').index($(cell));

      for (var idTr = 0; idTr < rowsGroup.length; idTr++) {
        var r = rowsGroup[idTr];
        var c = $(r).children('td, th')[cellPos];
        if (c) {
          c.remove();
        }
      }
    };

    /**
     * create empty table element
     *
     * @param {Number} rowCount
     * @param {Number} colCount
     * @return {Node}
     */
    this.createTable = function (colCount, rowCount, options) {
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
      var $table = $('<table>' + trHTML + '</table>');
      if (options && options.tableClassName) {
        $table.addClass(options.tableClassName);
      }

      return $table[0];
    };
  };
  return Table;
});

