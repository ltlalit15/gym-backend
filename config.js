
// live server

const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'shuttle.proxy.rlwy.net',   // Updated host
    port: 32074,                      // Updated port
    user: 'root',                     // User
    password: 'zkfLLtwLtzgONVIHWnOHNpnfMAGeuIeL', // Updated password
    database: 'railway',              // Database name
    multipleStatements: true         // Allow multiple SQL statements
});

console.warn('Connected to Railway MySQL Database');

module.exports = db;


