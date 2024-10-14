// db.js
const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    trustedConnection: true,
    enableArithAbort: true,
    driver: 'msnodesqlv8'
  }
};

const connectToDb = async () => {
  try {
    await sql.connect(config);
    console.log('Connected to the database');
  } catch (err) {
    console.error('Database connection failed', err);
  }
};

module.exports = {
  connectToDb,
  sql
};

// require('dotenv').config();
// const sql = require('mssql');

// const config = {
//   server: process.env.DB_SERVER,
//   database: process.env.DB_NAME,
//   options: {
//     trustedConnection: true,
//     enableArithAbort: true,
//     trustServerCertificate: true
//   }
// };

// async function connectToDb() {
//   try {
//     await sql.connect(config);
//     console.log('Connected to the database successfully');
//   } catch (err) {
//     console.error('Database connection failed', err);
//   }
// }

// module.exports = {
//   connectToDb,
//   sql
// };
