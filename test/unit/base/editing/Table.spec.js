/**
 * Table.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
/* jshint unused: false */
define([
  'chai',
  'jquery',
  'summernote/base/core/range',
  'summernote/base/editing/Table'
], function (chai, $, range, Table) {
  'use strict';

  var expect = chai.expect;

  describe('base:editing.Table', function () {
    var table = new Table();
    describe('tableWorker', function () {
      it('should create simple 1x1 table', function () {
        var resultTable = table.createTable(1, 1);
        expect(resultTable.rows.length).to.deep.equal(1);
        expect(resultTable.rows[0].cells.length).to.deep.equal(1);
      });

      it('should delete simple 1x1 table', function () {
        var $cont = $('<div class="note-editable"><table><tr><td>content</td></tr></table></div>');
        var $cell = $cont.find('td');
        var rng = range.create($cell[0].firstChild, 1);
        table.deleteTable(rng);
        expect($cont.html()).to.deep.equal('');
      });

      it('should add simple row to table on top', function () {
        var $cont = $('<div class="note-editable"><table><tr><td>content</td></tr></table></div>');
        var $cell = $cont.find('td');
        var rng = range.create($cell[0].firstChild, 1);
        table.addRow(rng, 'top');
        expect($cont.html()).to.deep.equal('<table><tbody><tr><td><br></td></tr><tr><td>content</td></tr></tbody></table>');
      });

      it('should add simple row to table on bottom', function () {
        var $cont = $('<div class="note-editable"><table><tr><td>content</td></tr></table></div>');
        var $cell = $cont.find('td');
        var rng = range.create($cell[0].firstChild, 1);
        table.addRow(rng, 'bottom');
        expect($cont.html()).to.deep.equal('<table><tbody><tr><td>content</td></tr><tr><td><br></td></tr></tbody></table>');
      });

      it('should add simple row to table on top between two rows', function () {
        var htmlContent = '<div class="note-editable"><table><tr><td>content1</td></tr><tr><td id="td2">content2</td></tr></table></div>';
        var $cont = $(htmlContent);
        var $cell = $cont.find('#td2');
        var rng = range.create($cell[0].firstChild, 1);
        table.addRow(rng, 'top');
        var resultTable = $('<table><tbody><tr><td>content1</td></tr></tbody></table>');
        $(resultTable).append('<tr><td><br/></td></tr>');
        $(resultTable).append('<tr><td id="td2">content2</td></tr>');
        var expectedResult = '<table>' + $(resultTable).html() + '</table>';
        expect($cont.html()).to.deep.equal(expectedResult);
      });

      it('should add simple row to table on bottom between two rows', function () {
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

        expect($cont.html()).to.deep.equal(expectedResult);
      });

      it('should add simple col to table on left between two cols', function () {
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

        expect($cont.html()).to.deep.equal(expectedResult);
      });

      it('should add simple col to table on right between two cols', function () {
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

        expect($cont.html()).to.deep.equal(expectedResult);
      });

      it('should delete row to table between two other rows', function () {
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

        expect($cont.html()).to.deep.equal(expectedResult);
      });

      it('should delete col to table between two other cols', function () {
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

        expect($cont.html()).to.deep.equal(expectedResult);
      });

    });
  });
});
