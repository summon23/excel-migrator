'use strict';

exports.convertValuesByModel = function (row, modelName) {
    let key = [];

    switch (modelName) {
        case 'masterlokasiujiannonregular':
            key = [
                '',
                'documentkey',
                'Daerah',
                'Company',
                'Exam Venue',
                'Biaya Ujian konvensional',
                'Print Card/Certificate',
                'Status',
                'Kapasitas tempat ujian',
                'Biaya Ujian Konven',
                'Biaya Ujian Konven Syariah'];
            break;
    
        default:
            break;
    }
    
    const objectResult = {};
    for (let i = 1; i < row.length; i++) {
        let el = row[i];
        objectResult[key[i]] = el;
    }
    return objectResult;
};

module.exports = exports;
