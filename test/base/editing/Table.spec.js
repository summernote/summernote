/**
 * Table.spec.js
 * (c) 2015-present Summernote Team
 * (c) 2026-present Jürgen Schwind
 * Summernote Next may be freely distributed under the MIT license.
 */
import { afterEach, describe, it, expect } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import range from '@/js/core/range';
import Table from '@/js/editing/Table';

describe('base:editing.Table', () => {
  var table = new Table();
  var originalCreate = range.create;

  afterEach(() => {
    range.create = originalCreate;
  });

  describe('tableWorker', () => {
    it('should create simple 1x1 table', () => {
      var resultTable = table.createTable(1, 1);
      expect(1).to.deep.equal(resultTable.rows.length);
      expect(1).to.deep.equal(resultTable.rows[0].cells.length);
    });

    it('should delete simple 1x1 table', () => {
      var $cont = $$('<div class="note-editable"><table><tr><td>content</td></tr></table></div>');
      var $cell = $cont.find('td');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteTable(rng);
      expect('').to.deep.equal($cont.html());
    });

    it('should add simple row to table on top', () => {
      var $cont = $$('<div class="note-editable"><table><tr><td>content</td></tr></table></div>');
      var $cell = $cont.find('td');
      var rng = range.create($cell[0].firstChild, 1);
      table.addRow(rng, 'top');
      expect('<table><tbody><tr><td><br></td></tr><tr><td>content</td></tr></tbody></table>').to.equalsIgnoreCase(
        $cont.html(),
      );
    });

    it('should add simple row to table on bottom', () => {
      var $cont = $$('<div class="note-editable"><table><tr><td>content</td></tr></table></div>');
      var $cell = $cont.find('td');
      var rng = range.create($cell[0].firstChild, 1);
      table.addRow(rng, 'bottom');
      expect('<table><tbody><tr><td>content</td></tr><tr><td><br></td></tr></tbody></table>').to.equalsIgnoreCase(
        $cont.html(),
      );
    });

    it('should add simple row to table on top between two rows', () => {
      var htmlContent =
        '<div class="note-editable"><table><tbody><tr><td>content1</td></tr><tr><td id="td2">content2</td></tr></tbody></table></div>';
      var $cont = $$(htmlContent);
      var $cell = $cont.find('#td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.addRow(rng, 'top');
      var expectedResult = '<table><tbody><tr><td>content1</td></tr><tr><td><br></td></tr><tr><td id="td2">content2</td></tr></tbody></table>';
      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add simple row to table on bottom between two rows', () => {
      var htmlContent = '<div class="note-editable"><table><tbody><tr><td id="td1">content1</td></tr><tr><td id="td2">content2</td></tr></tbody></table></div>';
      var $cont = $$(htmlContent);
      var $cell = $cont.find('#td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.addRow(rng, 'bottom');

      var expectedResult = '<table><tbody><tr><td id="td1">content1</td></tr><tr><td><br></td></tr><tr><td id="td2">content2</td></tr></tbody></table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add simple col to table on left between two cols', () => {
      var baseTable = $$('<table><tbody></tbody></table>');
      var baseTr = '<tr><td id="td1">content1</td><td id="td2">content2</td></tr>';
      baseTable.append(baseTr);
      var htmlContent = '<div class="note-editable"><table>' + $$(baseTable).html() + '</table></div>';
      var $cont = $$(htmlContent);
      var $cell = $cont.find('#td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.addCol(rng, 'left');

      var resultTable = $$('<table><tbody></tbody></table>');
      $$(resultTable).append('<tr><td id="td1">content1</td><td><br/></td><td id="td2">content2</td></tr>');
      var expectedResult = '<table>' + $$(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should move the selection to the next and previous cells when tabbing', () => {
      var selectCell = null;
      var $cont = $$('<div class="note-editable"><table><tbody><tr><td id="left">left</td><td id="right">right</td></tr></tbody></table></div>');
      var leftCell = $cont.find('#left')[0];
      var rightCell = $cont.find('#right')[0];

      range.create = function(cell) {
        return {
          select: function() {
            selectCell = cell;
          },
        };
      };

      table.tab({
        commonAncestor: function() {
          return leftCell.firstChild;
        },
      }, false);
      expect(selectCell).to.equal(rightCell);

      table.tab({
        commonAncestor: function() {
          return rightCell.firstChild;
        },
      }, true);
      expect(selectCell).to.equal(leftCell);

      selectCell = 'unchanged';
      table.tab({
        commonAncestor: function() {
          return rightCell.firstChild;
        },
      }, false);
      expect(selectCell).to.equal('unchanged');
    });

    it('should recover attributes without ids and ignore missing elements', () => {
      var td = $$('<td id="cell" data-test="1" class="alpha">x</td>')[0];

      expect(table.recoverAttributes(null)).to.equal('');
      expect(table.recoverAttributes(td)).to.equal(" data-test='1' class='alpha'");
    });

    it('should add simple col to table on right between two cols', () => {
      var baseTable = $$('<table><tbody></tbody></table>');
      var baseTr = '<tr><td id="td1">content1</td><td id="td2">content2</td></tr>';
      baseTable.append(baseTr);
      var htmlContent = '<div class="note-editable"><table>' + $$(baseTable).html() + '</table></div>';
      var $cont = $$(htmlContent);
      var $cell = $cont.find('#td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.addCol(rng, 'right');

      var resultTable = $$('<table><tbody></tbody></table>');
      $$(resultTable).append('<tr><td id="td1">content1</td><td><br/></td><td id="td2">content2</td></tr>');
      var expectedResult = '<table>' + $$(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should delete row to table between two other rows', () => {
      var baseTable = $$('<table><tbody></tbody></table>');
      var baseTr = '<tr><td id="td1">content1</td></tr>';
      baseTr += '<td id="td2">content2</td></tr>';
      baseTr += '<td id="td3">content3</td></tr>';
      baseTable.append(baseTr);
      var htmlContent = '<div class="note-editable"><table>' + $$(baseTable).html() + '</table></div>';
      var $cont = $$(htmlContent);
      var $cell = $cont.find('#td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteRow(rng);

      var resultTable = $$('<table><tbody></tbody></table>');
      $$(resultTable).append('<tr><td id="td1">content1</td></tr><tr><td id="td3">content3</td></tr>');
      var expectedResult = '<table>' + $$(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should delete col to table between two other cols', () => {
      var baseTable = $$('<table><tbody></tbody></table>');
      var baseTr = '<tr><td id="td1">content1</td><td id="td2">content2</td><td id="td3">content3</td></tr>';
      baseTable.append(baseTr);
      var htmlContent = '<div class="note-editable"><table>' + $$(baseTable).html() + '</table></div>';
      var $cont = $$(htmlContent);
      var $cell = $cont.find('#td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteCol(rng);

      var resultTable = $$('<table><tbody></tbody></table>');
      $$(resultTable).append('<tr><td id="td1">content1</td><td id="td3">content3</td></tr>');
      var expectedResult = '<table>' + $$(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should delete first col to table with colspan in column with colspan', () => {
      var baseTable = $$('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td colspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var baseTr2 = '<tr><td id="tr2td1">Col1</td><td id="tr2td2">Col2</td><td id="tr2td3">Col3</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      var htmlContent = '<div class="note-editable"><table>' + $$(baseTable).html() + '</table></div>';
      var $cont = $$(htmlContent);

      var $cell = $cont.find('#tr1td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteCol(rng);

      var resultTable = $$('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td id="tr1td1"></td><td id="tr1td2">Col2</td></tr>';
      var resultTr2 = '<tr><td id="tr2td2">Col2</td><td id="tr2td3">Col3</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      var expectedResult = '<table>' + $$(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should delete second col to table with colspan in column', () => {
      var baseTable = $$('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td colspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var baseTr2 = '<tr><td id="tr2td1">Col1</td><td id="tr2td2">Col2</td><td id="tr2td3">Col3</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      var htmlContent = '<div class="note-editable"><table>' + $$(baseTable).html() + '</table></div>';
      var $cont = $$(htmlContent);

      var $cell = $cont.find('#tr2td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteCol(rng);

      var resultTable = $$('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var resultTr2 = '<tr><td id="tr2td1">Col1</td><td id="tr2td3">Col3</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      var expectedResult = '<table>' + $$(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should delete second col to table with colspan in 3 columns', () => {
      var baseTable = $$('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td colspan="3" id="tr1td1">Col1-Span</td><td id="tr1td4">Col4</td></tr>';
      var baseTr2 =
        '<tr><td id="tr2td1">Col1</td><td id="tr2td2">Col2</td><td id="tr2td3">Col3</td><td id="tr2td4">Col4</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      var htmlContent = '<div class="note-editable"><table>' + $$(baseTable).html() + '</table></div>';
      var $cont = $$(htmlContent);

      var $cell = $cont.find('#tr2td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteCol(rng);

      var resultTable = $$('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td colspan="2" id="tr1td1">Col1-Span</td><td id="tr1td4">Col4</td></tr>';
      var resultTr2 = '<tr><td id="tr2td1">Col1</td><td id="tr2td3">Col3</td><td id="tr2td4">Col4</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      var expectedResult = '<table>' + $$(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should delete first row to table with rowspan in line with rowspan', () => {
      var htmlContent = '<div class="note-editable"><table><tbody>' +
        '<tr><td class="test" rowspan="2" id="tr1td1">Row1-Span</td><td id="tr1td2">Col2</td></tr>' +
        '<tr><td id="tr2td2">Col2</td></tr>' +
        '<tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr>' +
        '</tbody></table></div>';
      var $cont = $$(htmlContent);

      var $cell = $cont.find('#tr1td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteRow(rng);

      var expectedResult = '<table><tbody><tr><td class="test" id="tr1td1"></td><td id="tr2td2">Col2</td></tr><tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr></tbody></table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should delete second row to table with rowspan in line without rowspan', () => {
      var htmlContent = '<div class="note-editable"><table><tbody>' +
        '<tr><td rowspan="3" id="tr1td1">Row1-Span</td><td id="tr1td2">Col2</td></tr>' +
        '<tr><td id="tr2td2">Col2</td></tr>' +
        '<tr><td id="tr3td2">Col2</td></tr>' +
        '<tr><td id="tr4td1">Col1</td><td id="tr4td2">Col2</td></tr>' +
        '</tbody></table></div>';
      var $cont = $$(htmlContent);

      var $cell = $cont.find('#tr2td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteRow(rng);

      var expectedResult = '<table><tbody><tr><td rowspan="2" id="tr1td1">Row1-Span</td><td id="tr1td2">Col2</td></tr><tr><td id="tr3td2">Col2</td></tr><tr><td id="tr4td1">Col1</td><td id="tr4td2">Col2</td></tr></tbody></table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should delete second col to table with rowspan in 2 rows', () => {
      var baseTable = $$('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td rowspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var baseTr2 = '<tr><td id="tr2td2">Col2</td></tr>';
      var baseTr3 = '<tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      baseTable.append(baseTr3);
      var htmlContent = '<div class="note-editable"><table>' + $$(baseTable).html() + '</table></div>';
      var $cont = $$(htmlContent);

      var $cell = $cont.find('#tr1td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteCol(rng);

      var resultTable = $$('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td rowspan="2" id="tr1td1">Col1-Span</td></tr>';
      var resultTr2 = '<tr></tr>';
      var resultTr3 = '<tr><td id="tr3td1">Col1</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      resultTable.append(resultTr3);
      var expectedResult = '<table>' + $$(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should delete second col to table with rowspan in 2 rows on second row', () => {
      var baseTable = $$('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td rowspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var baseTr2 = '<tr><td id="tr2td2">Col2</td></tr>';
      var baseTr3 = '<tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      baseTable.append(baseTr3);
      var htmlContent = '<div class="note-editable"><table>' + $$(baseTable).html() + '</table></div>';
      var $cont = $$(htmlContent);

      var $cell = $cont.find('#tr2td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteCol(rng);

      var resultTable = $$('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td rowspan="2" id="tr1td1">Col1-Span</td></tr>';
      var resultTr2 = '<tr></tr>';
      var resultTr3 = '<tr><td id="tr3td1">Col1</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      resultTable.append(resultTr3);
      var expectedResult = '<table>' + $$(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add row on bottom rowspan cell.', () => {
      var htmlContent = '<div class="note-editable"><table><tbody>' +
        '<tr><td rowspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>' +
        '<tr><td id="tr2td2">Col2</td></tr>' +
        '<tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr>' +
        '</tbody></table></div>';
      var $cont = $$(htmlContent);

      var $cell = $cont.find('#tr2td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.addRow(rng);

      var expectedResult = '<table><tbody><tr><td rowspan="3" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr><tr><td id="tr2td2">Col2</td></tr><tr><td><br></td></tr><tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr></tbody></table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add row on bottom colspan cell.', () => {
      var htmlContent = '<div class="note-editable"><table><tbody>' +
        '<tr><td colspan="2" id="tr1td1">Col1-Span</td></tr>' +
        '<tr><td id="tr2td1">Col1</td><td id="tr2td2">Col2</td></tr>' +
        '<tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr>' +
        '</tbody></table></div>';
      var $cont = $$(htmlContent);

      var $cell = $cont.find('#tr1td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.addRow(rng, 'bottom');

      var expectedResult = '<table><tbody><tr><td colspan="2" id="tr1td1">Col1-Span</td></tr><tr><td colspan="2"><br></td></tr><tr><td id="tr2td1">Col1</td><td id="tr2td2">Col2</td></tr><tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr></tbody></table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add row above rowspan cell.', () => {
      var htmlContent = '<div class="note-editable"><table><tbody>' +
        '<tr><td rowspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>' +
        '<tr><td id="tr2td2">Col1</td></tr>' +
        '<tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr>' +
        '</tbody></table></div>';
      var $cont = $$(htmlContent);

      var $cell = $cont.find('#tr1td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.addRow(rng, 'top');

      var expectedResult = '<table><tbody><tr><td><br></td><td><br></td></tr><tr><td rowspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr><tr><td id="tr2td2">Col1</td></tr><tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr></tbody></table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add row on bottom rowspan cell and with aditional column.', () => {
      var htmlContent = '<div class="note-editable"><table><tbody>' +
        '<tr><td rowspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>' +
        '<tr><td id="tr2td2">Col1</td></tr>' +
        '</tbody></table></div>';
      var $cont = $$(htmlContent);

      var $cell = $cont.find('#tr1td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.addRow(rng, 'bottom');

      var expectedResult = '<table><tbody><tr><td rowspan="3" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr><tr><td id="tr2td2">Col1</td></tr><tr><td><br></td></tr></tbody></table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add column on right having rowspan cell and with aditional column.', () => {
      var baseTable = $$('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td rowspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var baseTr2 = '<tr><td id="tr2td2">Col1</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      var htmlContent = '<div class="note-editable"><table>' + $$(baseTable).html() + '</table></div>';
      var $cont = $$(htmlContent);

      var $cell = $cont.find('#tr1td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.addCol(rng, 'right');

      var resultTable = $$('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td rowspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td><td><br></td></tr>';
      var resultTr2 = '<tr><td id="tr2td2">Col1</td><td><br></td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      var expectedResult = '<table>' + $$(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add column on right having rowspan cell and with aditional column with focus on rowspan column.', () => {
      var baseTable = $$('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td rowspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var baseTr2 = '<tr><td id="tr2td2">Col1</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      var htmlContent = '<div class="note-editable"><table>' + $$(baseTable).html() + '</table></div>';
      var $cont = $$(htmlContent);

      var $cell = $cont.find('#tr1td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.addCol(rng, 'right');

      var resultTable = $$('<table><tbody></tbody></table> ');
      var resultTr1 =
        '<tr><td rowspan="2" id="tr1td1">Col1-Span</td><td rowspan="2"><br></td><td id="tr1td2">Col2</td></tr>';
      var resultTr2 = '<tr><td id="tr2td2">Col1</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      var expectedResult = '<table>' + $$(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should remove column after colspan column.', () => {
      var baseTable = $$('<table><tbody></tbody></table> ');
      var baseTr1 =
        '<tr><td id="tr1td1">Col1</td><td colspan="2" id="tr1td2">Col2-Span</td><td id="tr1td4">Col4</td></tr>';
      var baseTr2 =
        '<tr><td id="tr2td1">Col1</td><td id="tr2td2">Col2</td><td id="tr2td3">Col3</td><td id="tr2td4">Col4</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      var htmlContent = '<div class="note-editable"><table>' + $$(baseTable).html() + '</table></div>';
      var $cont = $$(htmlContent);

      var $cell = $cont.find('#tr1td4');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteCol(rng);

      var resultTable = $$('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td id="tr1td1">Col1</td><td colspan="2" id="tr1td2">Col2-Span</td></tr>';
      var resultTr2 = '<tr><td id="tr2td1">Col1</td><td id="tr2td2">Col2</td><td id="tr2td3">Col3</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      var expectedResult = '<table>' + $$(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should remove column before colspan column.', () => {
      var baseTable = $$('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td id="tr1td1">TR1TD1</td><td id="tr1td2" colspan="2">TR1TD2-COLSPAN</td>';
      baseTr1 += '<td id="tr1td4">TR1TD4</td></tr>';
      var baseTr2 = '<tr><td id="tr2td1">TR2TD1</td><td id="tr2td2">TR2TD2</td><td id="tr2td3">TR2TD3</td>';
      baseTr2 += '<td id="tr2td4">TR2TD4</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      var htmlContent = '<div class="note-editable"><table>' + $$(baseTable).html() + '</table></div>';
      var $cont = $$(htmlContent);

      var $cell = $cont.find('#tr1td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteCol(rng);

      var resultTable = $$('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td id="tr1td2" colspan="2">TR1TD2-COLSPAN</td>';
      resultTr1 += '<td id="tr1td4">TR1TD4</td></tr>';
      var resultTr2 = '<tr><td id="tr2td2">TR2TD2</td><td id="tr2td3">TR2TD3</td><td id="tr2td4">TR2TD4</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      var expectedResult = '<table>' + $$(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add column before colspan column.', () => {
      var baseTable = $$('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td id="tr1td1">TR1TD1</td><td id="tr1td2">TR1TD2</td></tr>';
      var baseTr2 = '<tr><td id="tr2td1" colspan="2">TR2TD1</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      var htmlContent = '<div class="note-editable"><table>' + $$(baseTable).html() + '</table></div>';
      var $cont = $$(htmlContent);

      var $cell = $cont.find('#tr1td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.addCol(rng, 'right');

      var resultTable = $$('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td id="tr1td1">TR1TD1</td><td><br></td><td id="tr1td2">TR1TD2</td></tr>';
      var resultTr2 = '<tr><td id="tr2td1" colspan="3">TR2TD1</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      var expectedResult = '<table>' + $$(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add a column to the left of a colspan cell without growing the span', () => {
      var $cont = $$('<div class="note-editable"><table><tbody><tr><td colspan="2" id="span">A</td><td id="tail">B</td></tr><tr><td>a</td><td>b</td><td>c</td></tr></tbody></table></div>');
      var $cell = $cont.find('#span');
      var rng = range.create($cell[0].firstChild, 1);

      table.addCol(rng, 'left');

      expect($cont.find('tr')[0].children[0].innerHTML).to.equal('<br>');
      expect($cont.find('#span')[0].getAttribute('colspan')).to.equal('2');
      expect($cont.find('tr')[1].children[0].innerHTML).to.equal('<br>');
    });

    it('should delete the first row of a rowspan-3 cell by cloning it into the next row', () => {
      var $cont = $$('<div class="note-editable"><table><tbody><tr><td rowspan="3" id="span">Row1-Span</td><td id="r1">A</td></tr><tr><td id="r2">B</td></tr><tr><td id="r3">C</td></tr></tbody></table></div>');
      var $cell = $cont.find('#span');
      var rng = range.create($cell[0].firstChild, 1);

      table.deleteRow(rng);

      expect($cont.html()).to.equalsIgnoreCase('<table><tbody><tr><td rowspan="2" id="span"></td><td id="r2">B</td></tr><tr><td id="r3">C</td></tr></tbody></table>');
    });

    it('should delete the first row of a rowspan-2 cell by moving the cell into the next row', () => {
      var $cont = $$('<div class="note-editable"><table><tbody><tr><td rowspan="2" id="span">Row1-Span</td><td id="r1">A</td></tr><tr><td id="r2">B</td></tr></tbody></table></div>');
      var $cell = $cont.find('#span');
      var rng = range.create($cell[0].firstChild, 1);

      table.deleteRow(rng);

      expect($cont.find('#span')[0].innerHTML).to.equal('');
      expect($cont.find('#span')[0].hasAttribute('rowspan')).to.equal(false);
    });

    it('should delete a row under a rowspan-2 cell by clearing the carried cell', () => {
      var $cont = $$('<div class="note-editable"><table><tbody><tr><td rowspan="2" id="span">Row1-Span</td><td id="r1">A</td></tr><tr><td id="r2">B</td></tr><tr><td id="r3">C</td><td id="r4">D</td></tr></tbody></table></div>');
      var $cell = $cont.find('#r2');
      var rng = range.create($cell[0].firstChild, 1);

      table.deleteRow(rng);

      expect($cont.find('#span')[0].innerHTML).to.equal('Row1-Span');
      expect($cont.find('tr').length).to.equal(2);
      expect($cont.find('#r3')[0].innerHTML).to.equal('C');
    });

    it('should delete a column from a colspan cell and clear the current cell when needed', () => {
      var $cont = $$('<div class="note-editable"><table><tbody><tr><td colspan="3" id="span">ABC</td><td id="tail">D</td></tr><tr><td>a</td><td id="selected">b</td><td>c</td><td>d</td></tr></tbody></table></div>');
      var $cell = $cont.find('#selected');
      var rng = range.create($cell[0].firstChild, 1);

      table.deleteCol(rng);

      expect($cont.html()).to.equalsIgnoreCase('<table><tbody><tr><td colspan="2" id="span">ABC</td><td id="tail">D</td></tr><tr><td>a</td><td>c</td><td>d</td></tr></tbody></table>');
    });

    it('should clear the selected colspan base cell when shrinking spans above two columns', () => {
      var $cont = $$('<div class="note-editable"><table><tbody><tr><td colspan="3" id="span">ABC</td><td id="tail">D</td></tr><tr><td>a</td><td>b</td><td>c</td><td>d</td></tr></tbody></table></div>');
      var $cell = $cont.find('#span');
      var rng = range.create($cell[0].firstChild, 1);

      table.deleteCol(rng);

      expect($cont.find('#span')[0].getAttribute('colspan')).to.equal('2');
      expect($cont.find('#span')[0].innerHTML).to.equal('');
    });

    it('should delete a selected colspan-2 base cell without leaving the span attribute', () => {
      var $cont = $$('<div class="note-editable"><table><tbody><tr><td colspan="2" id="span">AB</td><td id="tail">C</td></tr><tr><td>a</td><td>b</td><td>c</td></tr></tbody></table></div>');
      var $cell = $cont.find('#span');
      var rng = range.create($cell[0].firstChild, 1);

      table.deleteCol(rng);

      expect($cont.find('#span')[0].hasAttribute('colspan')).to.equal(false);
      expect($cont.find('#span')[0].innerHTML).to.equal('');
    });

    it('should create tables with custom table class names', () => {
      var resultTable = table.createTable(2, 1, { tableClassName: 'table table-sm' });

      expect(resultTable.className).to.equal('table table-sm');
      expect(resultTable.rows[0].cells.length).to.equal(2);
    });

    it('should delete header rows and columns using th elements', () => {
      var $rowTable = $$('<div class="note-editable"><table><thead><tr><th id="h1">A</th><th id="h2">B</th></tr></thead><tbody><tr><td>C</td><td>D</td></tr></tbody></table></div>');
      var rowRange = range.create($rowTable.find('#h1')[0].firstChild, 1);
      table.deleteRow(rowRange);
      expect($rowTable.find('th').length).to.equal(0);

      var $colTable = $$('<div class="note-editable"><table><thead><tr><th id="c1">A</th><th id="c2">B</th></tr></thead><tbody><tr><td>C</td><td>D</td></tr></tbody></table></div>');
      var colRange = range.create($colTable.find('#c1')[0].firstChild, 1);
      table.deleteCol(colRange);
      expect($colTable.find('th').length).to.equal(1);
      expect($colTable.find('th')[0].innerHTML).to.equal('B');
    });
  });
});
