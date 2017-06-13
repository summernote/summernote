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

      for (var idCell = 0; idCell < nbCell; idCell++) {
        var currentCell = cells[idCell];
        var tdAttributes = this.recoverAttributes(currentCell);
        html.append('<td' + tdAttributes + '>' + dom.blank + '</td>');
      }

      if (position === 'top') {
        currentTr.before(html);
      }
      else {
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

        if (position === 'right') {
          $(c).after('<td' + tdAttributes + '>' + dom.blank + '</td>');
        }
        else {
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
      var toDeleteRow = $(cell).closest('tr');
      var rowCells = toDeleteRow.children('td, th');
      var rowCellCount = rowCells.length;
      var previousRowWithDiffCellCount;
      var nextRowWithDiffCellCount;

      // Find if exists previous row with different count
      var prevRow = toDeleteRow[0].previousSibling;
      while (prevRow && prevRow.tagName.toLowerCase() === 'tr') {
        if (prevRow.cells.length !== rowCellCount) {
          previousRowWithDiffCellCount = prevRow;
          break;
        }
        prevRow = prevRow.previousSibling;
      }

      // Find if exists next row with different count
      var nextRow = toDeleteRow[0].nextSibling;
      while (nextRow && nextRow.tagName.toLowerCase() === 'tr') {
        if (nextRow.cells.length !== rowCellCount) {
          nextRowWithDiffCellCount = nextRow;
          break;
        }
        nextRow = nextRow.nextSibling;
      }

      if (previousRowWithDiffCellCount) {
        for (var prevCellIndex = 0; prevCellIndex < previousRowWithDiffCellCount.cells.length; prevCellIndex++) {
          var prevCell = previousRowWithDiffCellCount.cells[prevCellIndex];
          var hasPrevRowspan =prevCell.attributes.rowspan;
          var rowspanPrevNumber = hasPrevRowspan ? parseInt(prevCell.attributes.rowspan.value, 10) : 0;
          if (hasPrevRowspan && rowspanPrevNumber > 2) {
            rowspanPrevNumber--;
            prevCell.setAttribute('rowspan', rowspanPrevNumber);
          } else if (hasPrevRowspan && rowspanPrevNumber === 2) {
            prevCell.removeAttribute('rowspan');
          }
        }
      } else if (nextRowWithDiffCellCount && nextRowWithDiffCellCount.cells.length < rowCellCount) {
        for (var cellIndex = 0; cellIndex < rowCellCount; cellIndex++) {
          var hasRowspan = rowCells[cellIndex].attributes.rowspan;
          var rowspanNumber = hasRowspan ? parseInt(rowCells[cellIndex].attributes.rowspan.value, 10) : 0;
          var cloneRow = rowCells[cellIndex];
          if (hasRowspan && rowspanNumber > 2) {
            rowspanNumber--;
            nextRowWithDiffCellCount.insertBefore(cloneRow, nextRowWithDiffCellCount.cells[cellIndex]);
            nextRowWithDiffCellCount.cells[cellIndex].setAttribute('rowspan', rowspanNumber);
            nextRowWithDiffCellCount.cells[cellIndex].innerHTML = '';
          } else if (hasRowspan && rowspanNumber === 2) {
            nextRowWithDiffCellCount.insertBefore(cloneRow, nextRowWithDiffCellCount.cells[cellIndex]);
            nextRowWithDiffCellCount.cells[cellIndex].removeAttribute('rowspan');
            nextRowWithDiffCellCount.cells[cellIndex].innerHTML = '';
          }
        }
      }

      toDeleteRow.remove();
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
        var previousCount = 0;
        var cellCount = 0;
        for (var cIndex = 0; cIndex < $(r).children('td, th').length; cIndex++) {
          var c = $(r).children('td, th')[cIndex];
          var hasColspan = c.attributes.colspan;
          var colspanNumber = hasColspan ? parseInt(c.attributes.colspan.value, 10) : 0;

          previousCount = cellCount;
          if (!hasColspan) {
            cellCount++;
          } else {
            cellCount += colspanNumber;
          }

          if (cellPos >= previousCount && cellPos < cellCount) {
            if (hasColspan && colspanNumber > 2) {
              colspanNumber--;
              c.setAttribute('colspan', colspanNumber);
              if (c.cellIndex === cellPos) { c.innerHTML = ''; }
            } else if (hasColspan && colspanNumber === 2) {
              c.removeAttribute('colspan');
              if (c.cellIndex === cellPos) { c.innerHTML = ''; }
            } else {
              c.remove();
            }
          }
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

    /**
     * Delete current table
     *
     * @param {WrappedRange} rng
     * @return {Node}
     */
    this.deleteTable = function (rng) {
      var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      $(cell).closest('table').remove();
    };
  };
  return Table;
});
