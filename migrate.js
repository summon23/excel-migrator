'use strict';

const Excel = require('exceljs');
const mysql = require('mysql');
const Model = require('./model/migrator_object');

const migrateFilePath = './data/MasterLokasiUjianOnlineNonReguler.xlsx';
const documentRowStart = 6;

var workbook = new Excel.Workbook();
const records = [];
workbook.xlsx.readFile(migrateFilePath)
    .then(function(res) {
        // console.log(res);
        const worksheet = workbook.getWorksheet(1);
        for (let startRow = documentRowStart; true; startRow++) {
            const rowValues = worksheet.getRow(startRow).values;
            const val = Model.convertValuesByModel(rowValues, 'masterlokasiujiannonregular');            
            if (val.documentkey === undefined) break;
            records.push(val);
        }
    });

    
 
// pipe from stream
// var workbook = new Excel.Workbook();
// stream.pipe(workbook.xlsx.createInputStream());



// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'me',
//   password : 'secret',
//   database : 'my_db'
// });
 
// connection.connect();
 
// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });
 
// connection.end();