const { createPool } = require('mysql2')

if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
    console.log('test port111 ');
}

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10
})
module.exports = pool;