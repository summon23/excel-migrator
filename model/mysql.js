'use strict';

const mysql = require('mysql');
let mysqlConnection = null;

const getContext = async function() {
    return new Promise(function(resolve, reject) {
        if (mysqlConnection === null) {
            mysqlConnection = mysql.createConnection({
                host     : '188.166.190.210',
                user     : 'hilmansyafei',
                password : 'hilman1993',
                database : 'aaji_keuangan'
              });
               
            mysqlConnection.connect(function(err) {
                if (err) {
                    console.log("Error Database Connection:", err);
                    reject(err);
                } else {
                    console.log("Database Connected!");
                }                
            });            
        }
        resolve(mysqlConnection);
    })
}

const parseResponse = function (response) {
    const r = JSON.stringify(response);
    return JSON.parse(r);
}

exports.runQuery = (sqlQuery) => {
    return new Promise(async (resolve, reject) => {
        const connection = await getContext();
        connection.query(sqlQuery, (error, result) => {
            if (error) reject(error);
            resolve(parseResponse(result));
        });
    });
}

module.exports = exports;
