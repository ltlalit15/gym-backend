
// live server

const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'gondola.proxy.rlwy.net',
    port: 32521,                    
    user: 'root',                   
    password: 'yNhhVAiBMtCVSMqAqIsKDgWDNqhGvRsr',  
    database: 'railway',                
    multipleStatements: true       
});

console.warn('Connected to Railway MySQL Database');

module.exports = db;


