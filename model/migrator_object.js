'use strict';

const Mysql = require('../model/mysql');

const strC = function (s) {
    return String(s).trim().toLocaleLowerCase()
}

exports.getMasterRecord = async function (modelName) {
    let masterRecord = null;
    let listCity;
    let field = [];
    switch (modelName) {
        case 'masterlokasiujiannonregular':
            field = ['city', 'company'];
            const listCompany = await Mysql.runQuery('SELECT * from `master_company`');
            listCity = await Mysql.runQuery('SELECT * from `master_province`');  
        
            /**
            * Add External Record 
            * Push the record here to masterRecord
            */
            listCompany.push({
                id: 99999,
                nama_perusahaan: 'example'
            });                               

            masterRecord = {
                listCompany: listCompany,
                listCity: listCity
            };            
            break;
        case 'masternomorrekening':
            field = ['city', 'bank'];
            listCity = await Mysql.runQuery('SELECT * from `master_province`');  
            const listBank = await Mysql.runQuery('SELECT * from `master_bank`');  
        
            /**
            * Add External Record 
            * Push the record here to masterRecord
            */                       

            masterRecord = {
                listCity: listCity,
                listBank: listBank
            };            
            break;
        case 'masterlokasiujiandanperjanjiankerjasama':
            break;
        /**
         * Add New ModelName Case Here
         */
        default:
            break;
    }

    /**
     * Initiate Global Variable
    */
    field.forEach(el => {
        global.response[el] = {};
        global.response[el].nonRecognizeRecord = [];
        global.response[el].recognizeRecord = [];
    });

    return masterRecord;
}

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
                'Capacity',
                'Biaya Ujian Konven',
                'Biaya Ujian Konven Syariah'];
            break;
        case 'masternomorrekening':
            key = [
                '',
                'documentKey',
                'KOTA',
                'NAMA PO/PROCTOR/PENGAWAS',
                'KODE',
                'ALAMAT',
                'HANDPHONE',
                'NAMA PENERIMA BANK',
                'BANK',
                'NOMOR REKENING',
                'STATUS',
                'No PKS LEGAL',
                'No PKS SERTIFIKASI',
                'BERGABUNG SEJAK',
                'BERLAKU SAMPAI DENGAN']
            break;
        case 'masterlokasiujiandanperjanjiankerjasama':
            key = [
                '',
                'documentKey',
                'METODE',
                'KOTA',
                'NAMA TEMPAT UJIAN',
                'KODE',
                'ALAMAT',
                'NOMOR PKS LEGAL',
                'NOMOR PKS SERTIFIKASI',
                'PERIODE AWAL',
                'PERIODE AKHIR',
                'STATUS',
                'SEJAK',
                'PIHAK PERTAMA',
                'JABATAN',
                'PIHAK SAKSI',
                'JABATAN2',
                'PO',
                'PERPANJANGAN KE',
                'BANK',
                'NAMA PENERIMA',
                'NOMOR REKENING' 
            ]
            break;
        /**
         * Add New ModelName Case Here
         */
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

exports.getRecordToInsert = function (val, masterRecord, modelName) {
    let city;
    switch (modelName) {
        case 'masterlokasiujiannonregular':
            city = masterRecord.listCity.find(city => strC(city.nama) === strC(val.Daerah));
            const company = masterRecord.listCompany.find(company => strC(company.nama_perusahaan) === strC(val.Company));

            if (!city) {
                global.response.city.nonRecognizeRecord.push(val.Daerah); 
            } else{
                global.response.city.recognizeRecord.push(val.Daerah); 
            }

            if (!company) {
                global.response.company.nonRecognizeRecord.push(val.Company); 
            } else{
                global.response.company.recognizeRecord.push(val.Company); 
            }

            val.Daerah = city ? city.id : null;
            val.Company = company ? company.id : null;
            val['Print Card/Certificate'] = val['Print Card/Certificate'] === 'Available' ? 1 : 0;
            break;
        case 'masternomorrekening':    
            city = masterRecord.listCity.find(city => strC(city.nama) === strC(val.KOTA));
            const bank = masterRecord.listBank.find(bank => strC(bank.name) === strC(val.BANK));

            if (!city) {
                global.response.city.nonRecognizeRecord.push(val.KOTA); 
            } else{
                global.response.city.recognizeRecord.push(val.KOTA); 
            }

            if (!bank) {
                global.response.bank.nonRecognizeRecord.push(val.BANK); 
            } else{
                global.response.bank.recognizeRecord.push(val.BANK); 
            }

            val.KOTA = city ? city.id : null;
            val.BANK = bank ? bank.id : null;
            val['STATUS'] = val['STATUS'] === 'AKTIF' ? 1 : 0;
            break;
        case 'masterlokasiujiandanperjanjiankerjasama':
            break;
        default: 
            break;
    }
    
    return val;
}

exports.getQueryInsert = (modelName, records) => {
    let q = '';
    switch (modelName) {
        case 'masterlokasiujiannonregular':
            records.forEach(el => {
                let query = 'INSERT INTO ';          
                query = query.concat('`master_venue`'); // Table Name
                query = query.concat('(province_id, company_id, venue_name, printcard_status, capacity, konven_exam_price, syariah_exam_price) VALUES ') // Field Name
                query = query.concat(`(${el.Daerah}, ${el.Company}, '${el['Exam Venue']}', ${el['Print Card/Certificate']}, ${el.Capacity}, ${el['Biaya Ujian konvensional']}, ${el['Biaya Ujian Konven Syariah']} );`);
                q = q.concat(query);
            });
            break;
        case 'masternomorrekening':
            records.forEach(el => {
                let query = 'INSERT INTO ';          
                query = query.concat('`master_proctor_new`'); // Table Name
                query = query.concat('(name, province_id, proctor_username, address, phone, bank_id, bank_accountnumber, bank_accountname, join_date, exit_date, legal_number, pks_number, status) VALUES ') // Field Name
                query = query.concat(`('${el['NAMA PO/PROCTOR/PENGAWAS']}', ${el.KOTA}, '${el.KODE}', '${el.ALAMAT}', '${el.HANDPHONE}', ${el.BANK}, '${el['NOMOR REKENING']}', '${el['NAMA PENERIMA BANK']}', '${el['BERGABUNG SEJAK']}', '${el['BERLAKU SAMPAI DENGAN']}', '${el['No PKS LEGAL']}', '${el['No PKS SERTIFIKASI']}', ${el.STATUS}  );`);
                q = q.concat(query);
            });
            break;
        case 'masterlokasiujiandanperjanjiankerjasama':
            break;
        default:
            break;
    }

    return q;
}

module.exports = exports;
