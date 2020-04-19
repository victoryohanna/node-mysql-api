const mysql = require('mysql');

// Esterblish database connection
const conn = mysql.createPool({
    connectionLimit : 20,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'bookhubdb'   
});

//Connect 
conn.getConnection((err, tempConnect)=>{
    if(err) throw JSON.stringify(err, undefined, 2)
            tempConnect.release();

    console.log('Connection to Database Established');

})

module.exports = conn;