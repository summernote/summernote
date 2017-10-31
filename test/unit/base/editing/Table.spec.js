/**
 * Table.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
import chai from 'chai';
import $ from 'jquery';
import range from '../../../../src/js/base/core/range';
import Table from '../../../../src/js/base/editing/Table';

var expect = chai.expect;

describe('base:editing.Table', () => {
  var table = new Table();
  describe('tableWorker', () => {
    it('should create simple 1x1 table', () => {
      var resultTable = table.createTable(1, 1);
      expect(1).to.deep.equal(resultTable.rows.length);
      expect(1).to.deep.equal(resultTable.rows[0].cells.length);
    });

    it('should delete simple 1x1 table', () => {
      var $cont = $('<div class="note-editable"><table><tr><td>content</td></tr></table></div>');
      var $cell = $cont.find('td');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteTable(rng);
      expect('').to.deep.equal($cont.html());
    });

    it('should add simple row to table on top', () => {
      var $cont = $('<div class="note-editable"><table><tr><td>content</td></tr></table></div>');
      var $cell = $cont.find('td');
      var rng = range.create($cell[0].firstChild, 1);
      table.addRow(rng, 'top');
      expect('<table><tbody><tr><td><br></td></tr><tr><td>content</td></tr></tbody></table>').to.equalsIgnoreCase($cont.html());
    });

    it('should add simple row to table on bottom', () => {
      var $cont = $('<div class="note-editable"><table><tr><td>content</td></tr></table></div>');
      var $cell = $cont.find('td');
      var rng = range.create($cell[0].firstChild, 1);
      table.addRow(rng, 'bottom');
      expect('<table><tbody><tr><td>content</td></tr><tr><td><br></td></tr></tbody></table>').to.equalsIgnoreCase($cont.html());
    });

    it('should add simple row to table on top between two rows', () => {
      var htmlContent = '<div class="note-editable"><table><tr><td>content1</td></tr><tr><td id="td2">content2</td></tr></table></div>';
      var $cont = $(htmlContent);
      var $cell = $cont.find('#td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.addRow(rng, 'top');
      var resultTable = $('<table><tbody><tr><td>content1</td></tr></tbody></table>');
      $(resultTable).append('<tr><td><br/></td></tr>');
      $(resultTable).append('<tr><td id="td2">content2</td></tr>');
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';
      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add simple row to table on bottom between two rows', () => {
      var baseTable = $('<table><tbody><tr><td id="td1">content1</td></tr></tbody></table>');
      $(baseTable).append('<tr><td id="td2">content2</td></tr>');
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);
      var $cell = $cont.find('#td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.addRow(rng, 'bottom');

      var resultTable = $('<table><tbody><tr><td id="td1">content1</td></tr></tbody></table>');
      $(resultTable).append('<tr><td><br/></td></tr>');
      $(resultTable).append('<tr><td id="td2">content2</td></tr>');
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add simple col to table on left between two cols', () => {
      var baseTable = $('<table><tbody></tbody></table>');
      var baseTr = '<tr><td id="td1">content1</td><td id="td2">content2</td></tr>';
      baseTable.append(baseTr);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);
      var $cell = $cont.find('#td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.addCol(rng, 'left');

      var resultTable = $('<table><tbody></tbody></table>');
      $(resultTable).append('<tr><td id="td1">content1</td><td><br/></td><td id="td2">content2</td></tr>');
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add simple col to table on right between two cols', () => {
      var baseTable = $('<table><tbody></tbody></table>');
      var baseTr = '<tr><td id="td1">content1</td><td id="td2">content2</td></tr>';
      baseTable.append(baseTr);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);
      var $cell = $cont.find('#td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.addCol(rng, 'right');

      var resultTable = $('<table><tbody></tbody></table>');
      $(resultTable).append('<tr><td id="td1">content1</td><td><br/></td><td id="td2">content2</td></tr>');
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should delete row to table between two other rows', () => {
      var baseTable = $('<table><tbody></tbody></table>');
      var baseTr = '<tr><td id="td1">content1</td></tr>';
      baseTr += '<td id="td2">content2</td></tr>';
      baseTr += '<td id="td3">content3</td></tr>';
      baseTable.append(baseTr);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);
      var $cell = $cont.find('#td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteRow(rng);

      var resultTable = $('<table><tbody></tbody></table>');
      $(resultTable).append('<tr><td id="td1">content1</td></tr><tr><td id="td3">content3</td></tr>');
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should delete col to table between two other cols', () => {
      var baseTable = $('<table><tbody></tbody></table>');
      var baseTr = '<tr><td id="td1">content1</td><td id="td2">content2</td><td id="td3">content3</td></tr>';
      baseTable.append(baseTr);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);
      var $cell = $cont.find('#td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteCol(rng);

      var resultTable = $('<table><tbody></tbody></table>');
      $(resultTable).append('<tr><td id="td1">content1</td><td id="td3">content3</td></tr>');
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should delete first col to table with colspan in column with colspan', () => {
      var baseTable = $('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td colspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var baseTr2 = '<tr><td id="tr2td1">Col1</td><td id="tr2td2">Col2</td><td id="tr2td3">Col3</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);

      var $cell = $cont.find('#tr1td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteCol(rng);

      var resultTable = $('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td id="tr1td1"></td><td id="tr1td2">Col2</td></tr>';
      var resultTr2 = '<tr><td id="tr2td2">Col2</td><td id="tr2td3">Col3</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should delete second col to table with colspan in column', () => {
      var baseTable = $('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td colspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var baseTr2 = '<tr><td id="tr2td1">Col1</td><td id="tr2td2">Col2</td><td id="tr2td3">Col3</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);

      var $cell = $cont.find('#tr2td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteCol(rng);

      var resultTable = $('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var resultTr2 = '<tr><td id="tr2td1">Col1</td><td id="tr2td3">Col3</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should delete second col to table with colspan in 3 columns', () => {
      var baseTable = $('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td colspan="3" id="tr1td1">Col1-Span</td><td id="tr1td4">Col4</td></tr>';
      var baseTr2 = '<tr><td id="tr2td1">Col1</td><td id="tr2td2">Col2</td><td id="tr2td3">Col3</td><td id="tr2td4">Col4</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);

      var $cell = $cont.find('#tr2td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteCol(rng);

      var resultTable = $('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td colspan="2" id="tr1td1">Col1-Span</td><td id="tr1td4">Col4</td></tr>';
      var resultTr2 = '<tr><td id="tr2td1">Col1</td><td id="tr2td3">Col3</td><td id="tr2td4">Col4</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should delete first row to table with rowspan in line with rowspan', () => {
      var baseTable = $('<table><tbody></tbody></table>');
      var baseTr1 = '<tr><td class="test" rowspan="2" id="tr1td1">Row1-Span</td><td id="tr1td2">Col2</td></tr>';
      var baseTr2 = '<tr><td id="tr2td2">Col2</td></tr>';
      var baseTr3 = '<tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      baseTable.append(baseTr3);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);

      var $cell = $cont.find('#tr1td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteRow(rng);

      var resultTable = $('<table><tbody></tbody></table> ');
      var resultTr1AndTr2 = '<tr><td class="test" id="tr1td1"></td><td id="tr2td2">Col2</td></tr>';
      var resultTr3 = '<tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr>';
      resultTable.append(resultTr1AndTr2);
      resultTable.append(resultTr3);
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should delete second row to table with rowspan in line without rowspan', () => {
      var baseTable = $('<table><tbody></tbody></table>');
      var baseTr1 = '<tr><td rowspan="3" id="tr1td1">Row1-Span</td><td id="tr1td2">Col2</td></tr>';
      var baseTr2 = '<tr><td id="tr2td2">Col2</td></tr>';
      var baseTr3 = '<tr><td id="tr3td2">Col2</td></tr>';
      var baseTr4 = '<tr><td id="tr4td1">Col1</td><td id="tr4td2">Col2</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      baseTable.append(baseTr3);
      baseTable.append(baseTr4);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);

      var $cell = $cont.find('#tr2td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteRow(rng);

      var resultTable = $('<table><tbody></tbody></table>');
      var resultTr1 = '<tr><td rowspan="2" id="tr1td1">Row1-Span</td><td id="tr1td2">Col2</td></tr>';
      var resultTr3 = '<tr><td id="tr3td2">Col2</td></tr>';
      var resultTr4 = '<tr><td id="tr4td1">Col1</td><td id="tr4td2">Col2</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr3);
      resultTable.append(resultTr4);
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should delete second col to table with rowspan in 2 rows', () => {
      var baseTable = $('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td rowspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var baseTr2 = '<tr><td id="tr2td2">Col2</td></tr>';
      var baseTr3 = '<tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      baseTable.append(baseTr3);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);

      var $cell = $cont.find('#tr1td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteCol(rng);

      var resultTable = $('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td rowspan="2" id="tr1td1">Col1-Span</td></tr>';
      var resultTr2 = '<tr></tr>';
      var resultTr3 = '<tr><td id="tr3td1">Col1</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      resultTable.append(resultTr3);
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should delete second col to table with rowspan in 2 rows on second row', () => {
      var baseTable = $('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td rowspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var baseTr2 = '<tr><td id="tr2td2">Col2</td></tr>';
      var baseTr3 = '<tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      baseTable.append(baseTr3);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);

      var $cell = $cont.find('#tr2td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteCol(rng);

      var resultTable = $('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td rowspan="2" id="tr1td1">Col1-Span</td></tr>';
      var resultTr2 = '<tr></tr>';
      var resultTr3 = '<tr><td id="tr3td1">Col1</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      resultTable.append(resultTr3);
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add row on bottom rowspan cell.', () => {
      var baseTable = $('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td rowspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var baseTr2 = '<tr><td id="tr2td2">Col2</td></tr>';
      var baseTr3 = '<tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      baseTable.append(baseTr3);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);

      var $cell = $cont.find('#tr2td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.addRow(rng);

      var resultTable = $('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td rowspan="3" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var resultTr2 = '<tr><td id="tr2td2">Col2</td></tr>';
      var resultTr3 = '<tr><td><br></td></tr>';
      var resultTr4 = '<tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      resultTable.append(resultTr3);
      resultTable.append(resultTr4);
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add row on bottom colspan cell.', () => {
      var baseTable = $('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td colspan="2" id="tr1td1">Col1-Span</td></tr>';
      var baseTr2 = '<tr><td id="tr2td1">Col1</td><td id="tr2td2">Col2</td></tr>';
      var baseTr3 = '<tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      baseTable.append(baseTr3);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);

      var $cell = $cont.find('#tr1td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.addRow(rng, 'bottom');

      var resultTable = $('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td colspan="2" id="tr1td1">Col1-Span</td></tr>';
      var resultTr2 = '<tr><td colspan="2"><br></td></tr>';
      var resultTr3 = '<tr><td id="tr2td1">Col1</td><td id="tr2td2">Col2</td></tr>';
      var resultTr4 = '<tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      resultTable.append(resultTr3);
      resultTable.append(resultTr4);
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add row above rowspan cell.', () => {
      var baseTable = $('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td rowspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var baseTr2 = '<tr><td id="tr2td2">Col1</td></tr>';
      var baseTr3 = '<tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      baseTable.append(baseTr3);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);

      var $cell = $cont.find('#tr1td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.addRow(rng, 'top');

      var resultTable = $('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td><br></td><td><br></td></tr>';
      var resultTr2 = '<tr><td rowspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var resultTr3 = '<tr><td id="tr2td2">Col1</td></tr>';
      var resultTr4 = '<tr><td id="tr3td1">Col1</td><td id="tr3td2">Col2</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      resultTable.append(resultTr3);
      resultTable.append(resultTr4);
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add row on bottom rowspan cell and with aditional column.', () => {
      var baseTable = $('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td rowspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var baseTr2 = '<tr><td id="tr2td2">Col1</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);

      var $cell = $cont.find('#tr1td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.addRow(rng, 'bottom');

      var resultTable = $('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td rowspan="3" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var resultTr2 = '<tr><td id="tr2td2">Col1</td></tr>';
      var resultTr3 = '<tr><td><br></td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      resultTable.append(resultTr3);
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add column on right having rowspan cell and with aditional column.', () => {
      var baseTable = $('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td rowspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var baseTr2 = '<tr><td id="tr2td2">Col1</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);

      var $cell = $cont.find('#tr1td2');
      var rng = range.create($cell[0].firstChild, 1);
      table.addCol(rng, 'right');

      var resultTable = $('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td rowspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td><td><br></td></tr>';
      var resultTr2 = '<tr><td id="tr2td2">Col1</td><td><br></td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add column on right having rowspan cell and with aditional column with focus on rowspan column.', () => {
      var baseTable = $('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td rowspan="2" id="tr1td1">Col1-Span</td><td id="tr1td2">Col2</td></tr>';
      var baseTr2 = '<tr><td id="tr2td2">Col1</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);

      var $cell = $cont.find('#tr1td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.addCol(rng, 'right');

      var resultTable = $('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td rowspan="2" id="tr1td1">Col1-Span</td><td rowspan="2"><br></td><td id="tr1td2">Col2</td></tr>';
      var resultTr2 = '<tr><td id="tr2td2">Col1</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should remove column after colspan column.', () => {
      var baseTable = $('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td id="tr1td1">Col1</td><td colspan="2" id="tr1td2">Col2-Span</td><td id="tr1td4">Col4</td></tr>';
      var baseTr2 = '<tr><td id="tr2td1">Col1</td><td id="tr2td2">Col2</td><td id="tr2td3">Col3</td><td id="tr2td4">Col4</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);

      var $cell = $cont.find('#tr1td4');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteCol(rng);

      var resultTable = $('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td id="tr1td1">Col1</td><td colspan="2" id="tr1td2">Col2-Span</td></tr>';
      var resultTr2 = '<tr><td id="tr2td1">Col1</td><td id="tr2td2">Col2</td><td id="tr2td3">Col3</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should remove column before colspan column.', () => {
      var baseTable = $('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td id="tr1td1">TR1TD1</td><td id="tr1td2" colspan="2">TR1TD2-COLSPAN</td>';
      baseTr1 += '<td id="tr1td4">TR1TD4</td></tr>';
      var baseTr2 = '<tr><td id="tr2td1">TR2TD1</td><td id="tr2td2">TR2TD2</td><td id="tr2td3">TR2TD3</td>';
      baseTr2 += '<td id="tr2td4">TR2TD4</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);

      var $cell = $cont.find('#tr1td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.deleteCol(rng);

      var resultTable = $('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td id="tr1td2" colspan="2">TR1TD2-COLSPAN</td>';
      resultTr1 += '<td id="tr1td4">TR1TD4</td></tr>';
      var resultTr2 = '<tr><td id="tr2td2">TR2TD2</td><td id="tr2td3">TR2TD3</td><td id="tr2td4">TR2TD4</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });

    it('should add column before colspan column.', () => {
      var baseTable = $('<table><tbody></tbody></table> ');
      var baseTr1 = '<tr><td id="tr1td1">TR1TD1</td><td id="tr1td2">TR1TD2</td></tr>';
      var baseTr2 = '<tr><td id="tr2td1" colspan="2">TR2TD1</td></tr>';
      baseTable.append(baseTr1);
      baseTable.append(baseTr2);
      var htmlContent = '<div class="note-editable"><table>' + $(baseTable).html() + '</table></div>';
      var $cont = $(htmlContent);

      var $cell = $cont.find('#tr1td1');
      var rng = range.create($cell[0].firstChild, 1);
      table.addCol(rng, 'right');

      var resultTable = $('<table><tbody></tbody></table> ');
      var resultTr1 = '<tr><td id="tr1td1">TR1TD1</td><td><br></td><td id="tr1td2">TR1TD2</td></tr>';
      var resultTr2 = '<tr><td id="tr2td1" colspan="3">TR2TD1</td></tr>';
      resultTable.append(resultTr1);
      resultTable.append(resultTr2);
      var expectedResult = '<table>' + $(resultTable).html() + '</table>';

      expect(expectedResult).to.equalsIgnoreCase($cont.html());
    });
  });
});
