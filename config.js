// local mysql

const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'gym',
    multipleStatements: true
});

 

console.warn('Connected');

module.exports = db;


// live server

// const mysql = require('mysql2/promise');

// // Update the connection details with the new URL and credentials
// const db = mysql.createPool({
//     host: 'turntable.proxy.rlwy.net',  // Updated host URL
//     port: 21573,                        // Updated port
//     user: 'root',                       // MySQL username
//     password: 'dYVNOmeRrbfJkCVkXnMwGuMKRPZsTVtP',  // Updated password
//     database: 'railway',                // Updated database name
//     multipleStatements: true           // Allow multiple statements if needed
// });

// console.warn('Connected');

// module.exports = db;


