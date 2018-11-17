'use strict';

const Excel = require('exceljs');
const path = require('path');
const fs = require('fs');
const Model = require('./model/migrator_object');

global.response = {};

async function migarateExcel (modelName) {
    let migrateFilePath;
    let documentRowStart;
    let sheetId;
    let recordToRead;
    switch (modelName) {
        case 'masterlokasiujiannonregular':
            migrateFilePath = './data/MasterLokasiUjianOnlineNonReguler.xlsx';
            documentRowStart = 6;
            recordToRead = 358;
            sheetId = 1;
            break;
        case 'masternomorrekening':        
            migrateFilePath = './data/MasterNomorRekening2.xlsx';
            documentRowStart = 7;
            recordToRead = 164;
            sheetId = 'Sheet1';
            break;
        case 'masterlokasiujiandanperjanjiankerjasama':
            migrateFilePath = './data/MasterLokasiUjiandanPerjanjianKerjasama.xlsx';
            documentRowStart = 6;
            recordToRead = 164;
            break;
        default:
            break;
    }
    
    console.log('Loading...')
    const masterRecord = await Model.getMasterRecord(modelName);
    var workbook = new Excel.Workbook();
    const records = [];
    let queryInsert;
    
    await workbook.xlsx.readFile(migrateFilePath)
        .then(function(res) {
            // workbook.eachSheet(function(worksheet, sheetId) {
            //     console.log(sheetId);
            // })

            const worksheet = workbook.getWorksheet(sheetId);
            const limit = documentRowStart + recordToRead;
            for (let startRow = documentRowStart; startRow !== limit; startRow++) {
                const rowValues = worksheet.getRow(startRow).values;
                const value = Model.convertValuesByModel(rowValues, modelName);                
                const valueToInsert = Model.getRecordToInsert(value, masterRecord, modelName);
                records.push(valueToInsert);
            }
            console.log(`${records.length} record Readed`);

            queryInsert = Model.getQueryInsert(modelName, records);
        });

    const response = {
        report: global.response,
        record: records
    }

    fs.writeFile('./query.sql', String(queryInsert), 'utf8', (err, success) => {
        console.log("Query written");
    });

    fs.writeFile('./response.json', JSON.stringify(response, null, 4), 'utf8', (err, success) => {
        console.log("Response written");
        process.exit()
    });
}

/**
 * Execute by params below:
 * masterlokasiujiannonregular
 * masternomorrekening
 * masterlokasiujiandanperjanjiankerjasama    
 */
migarateExcel('masterlokasiujiannonregular');
