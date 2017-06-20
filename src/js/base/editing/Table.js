define([
  'summernote/base/core/dom',
  'summernote/base/core/range',
  'summernote/base/core/list'
], function (dom, range, list) {

  /**
   * @class Create a virtual table to create what actions to do in change.
   * @param startPoint Cell selected to apply change.
   * @param where  Where change will be applied Row or Col. Use enum: TableResultAction.where
   * @param action Action to be applied. Use enum: TableResultAction.requestAction
   * @param domTable Dom element of table to make changes.
   */
  var TableResultAction = function (startPoint, where, action, domTable) {
    var _startPoint = { 'colPos': 0, 'rowPos': 0 };
    var _virtualTable = [];
    var _actionCellList = [];

    //////////////////////////////////////////////
    // Private functions
    //////////////////////////////////////////////

    /**
     * Set the startPoint of action.
     */
    function setStartPoint() {
      if (!startPoint || !startPoint.tagName || (startPoint.tagName.toLowerCase() !== 'td' && startPoint.tagName.toLowerCase() !== 'th')) {
        console.error('Impossible to identify start Cell point.', startPoint);
        return;
      }
      _startPoint.colPos = startPoint.cellIndex;
      if (!startPoint.parentElement || !startPoint.parentElement.tagName || startPoint.parentElement.tagName.toLowerCase() !== 'tr') {
        console.error('Impossible to identify start Row point.', startPoint);
        return;
      }
      _startPoint.rowPos = startPoint.parentElement.rowIndex;
    }

    /**
     * Define virtual table position info object.
     * 
     * @param {int} rowIndex Index position in line of virtual table.
     * @param {int} cellIndex Index position in column of virtual table.
     * @param {object} baseRow Row affected by this position.
     * @param {object} baseCell Cell affected by this position.
     * @param {bool} isSpan Inform if it is an span cell/row.
     */
    function setVirtualTablePosition(rowIndex, cellIndex, baseRow, baseCell, isRowSpan, isColSpan) {
      var objPosition = {
        'baseRow': baseRow,
        'baseCell': baseCell,
        'isRowSpan': isRowSpan,
        'isColSpan': isColSpan
      };
      if (!_virtualTable[rowIndex]) {
        _virtualTable[rowIndex] = [];
      }
      _virtualTable[rowIndex][cellIndex] = objPosition;
    }

    /**
     * Create action cell object.
     * 
     * @param {object} virtualTableCellObj Object of specific position on virtual table.
     * @param {enum} resultAction Action to be applied in that item.
     */
    function getActionCell(virtualTableCellObj, resultAction) {
      return {
        'baseCell': virtualTableCellObj.baseCell,
        'action': resultAction
      };
    }

    /**
     * Recover free index of row to append Cell.
     * 
     * @param {int} rowIndex Index of row to find free space.
     * @param {int} cellIndex Index of cell to find free space in table.
     */
    function recoverCellIndex(rowIndex, cellIndex) {
      if (!_virtualTable[rowIndex]) {
        return cellIndex;
      }
      if (!_virtualTable[rowIndex][cellIndex]) {
        return cellIndex;
      }

      var newCellIndex = cellIndex;
      while (_virtualTable[rowIndex][newCellIndex]) {
        newCellIndex++;
        if (!_virtualTable[rowIndex][newCellIndex]) {
          return newCellIndex;
        }
      }
    }

    /**
     * Recover info about row and cell and add information to virtual table.
     * 
     * @param {object} row Row to recover information.
     * @param {object} cell Cell to recover information.
     */
    function addCellInfoToVirtual(row, cell) {
      var cellIndex = recoverCellIndex(row.rowIndex, cell.cellIndex);
      var cellHasColspan = (cell.colSpan > 1);
      var cellHasRowspan = (cell.rowSpan > 1);
      setVirtualTablePosition(row.rowIndex, cellIndex, row, cell, cellHasRowspan, cellHasColspan);

      // Add span rows to virtual Table.
      var rowspanNumber = cell.attributes.rowspan ? parseInt(cell.attributes.rowspan.value, 10) : 0;
      if (rowspanNumber > 1) {
        for (var rp = 1; rp < rowspanNumber; rp++) {
          var rowspanIndex = row.rowIndex + rp;
          setVirtualTablePosition(rowspanIndex, cellIndex, row, cell, true, cellHasColspan);
        }
      }

      // Add span cols to virtual table.
      var colspanNumber = cell.attributes.colspan ? parseInt(cell.attributes.colspan.value, 10) : 0;
      if (colspanNumber > 1) {
        for (var cp = 1; cp < colspanNumber; cp++) {
          var cellspanIndex = recoverCellIndex(row.rowIndex, (cellIndex + cp));
          setVirtualTablePosition(row.rowIndex, cellspanIndex, row, cell, cellHasRowspan, true);
        }
      }
    }

    /**
     * Create virtual table of cells with all cells, including span cells.
     */
    function createVirtualTable() {
      var rows = domTable.rows;
      for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        var cells = rows[rowIndex].cells;
        for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
          addCellInfoToVirtual(rows[rowIndex], cells[cellIndex]);
        }
      }
    }

    /**
     * Get action to be applied on the cell.
     * 
     * @param {object} cell virtual table cell to apply action
     */
    function getResultActionToCell(cell) {
      switch (where) {
        case TableResultAction.where.Column:
          if (cell.isColSpan) {
            return TableResultAction.resultAction.SubtractSpanCount;
          }
          break;
        case TableResultAction.where.Row:
          if (cell.isRowSpan) {
            return TableResultAction.resultAction.SubtractSpanCount;
          }
          break;
      }
      return TableResultAction.resultAction.RemoveCell;
    }

    function init() {
      setStartPoint();
      createVirtualTable();
    }

    //////////////////////////////////////////////
    // Public functions
    //////////////////////////////////////////////

    /**
     * Recover array os what to do in table.
     */
    this.getActionList = function () {
      var fixedRow = (action === TableResultAction.where.Row) ? _startPoint.rowPos : -1;
      var fixedCol = (action === TableResultAction.where.Column) ? _startPoint.colPos : -1;

      var actualPosition = 0;
      var canContinue = true;
      while (canContinue) {
        var row = (fixedRow >= 0) ? _virtualTable[fixedRow] : _virtualTable[actualPosition];
        if (!row) {
          canContinue = false;
          return _actionCellList;
        }
        var cell = (fixedCol >= 0) ? row[fixedCol] : row[actualPosition];
        if (!cell) {
          canContinue = false;
          return _actionCellList;
        }

        // Define action to be applied in this cell
        var resultAction = TableResultAction.resultAction.Ignore;
        switch (action) {
          case TableResultAction.requestAction.Add:
            console.warn('Not implemented');
            break;
          case TableResultAction.requestAction.Delete:
            resultAction = getResultActionToCell(cell);
            break;
        }
        _actionCellList.push(getActionCell(cell, resultAction));
        actualPosition++;
      }

      return _actionCellList;
    };

    init();
  };
  /**
  * 
  * Where action occours enum.
  */
  TableResultAction.where = { 'Row': 0, 'Column': 1 };
  /**
  * 
  * Requested action to apply enum.
  */
  TableResultAction.requestAction = { 'Add': 0, 'Delete': 1 };
  /**
  * 
  * Result action to be executed enum.
  */
  TableResultAction.resultAction = { 'Ignore': 0, 'SubtractSpanCount': 1, 'RemoveCell': 2 };

  /**
   * 
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
      var prevRow = toDeleteRow.prev('tr')[0];
      while (prevRow && prevRow.tagName.toLowerCase() === 'tr') {
        if (prevRow.cells.length !== rowCellCount) {
          previousRowWithDiffCellCount = prevRow;
          break;
        }
        prevRow = $(prevRow).prev('tr')[0];
      }

      // Find if exists next row with different count
      var nextRow = toDeleteRow.next('tr')[0];
      while (nextRow && nextRow.tagName.toLowerCase() === 'tr') {
        if (nextRow.cells.length !== rowCellCount) {
          nextRowWithDiffCellCount = nextRow;
          break;
        }
        nextRow = $(nextRow).next('tr')[0];
      }

      if (previousRowWithDiffCellCount) {
        for (var prevCellIndex = 0; prevCellIndex < previousRowWithDiffCellCount.cells.length; prevCellIndex++) {
          var prevCell = previousRowWithDiffCellCount.cells[prevCellIndex];
          var hasPrevRowspan = prevCell.attributes.rowspan;
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
      //var rowsGroup = $(row).parent().children('tr');
      var cellPos = row.children('td, th').index($(cell));

      var vTable = new TableResultAction(cell, TableResultAction.where.Column,
        TableResultAction.requestAction.Delete, $(row).closest('table')[0]);
      var actions = vTable.getActionList();
      for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) {
        if (!actions[actionIndex]) {
          continue;
        }
        switch (actions[actionIndex].action) {
          case TableResultAction.resultAction.Ignore:
            continue;
          case TableResultAction.resultAction.SubtractSpanCount:
            var baseCell = actions[actionIndex].baseCell;
            var hasColspan = baseCell.attributes.colspan;
            if (baseCell.attributes) {
              var colspanNumber = (baseCell.attributes.colspan) ? parseInt(baseCell.attributes.colspan.value, 10) : 0;
              if (colspanNumber > 2) {
                colspanNumber--;
                baseCell.setAttribute('colspan', colspanNumber);
                if (baseCell.cellIndex === cellPos) { baseCell.innerHTML = ''; }
              } else if (hasColspan && colspanNumber === 2) {
                baseCell.removeAttribute('colspan');
                if (baseCell.cellIndex === cellPos) { baseCell.innerHTML = ''; }
              }
            }
            continue;
          case TableResultAction.resultAction.RemoveCell:
            actions[actionIndex].baseCell.remove();
            continue;
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
