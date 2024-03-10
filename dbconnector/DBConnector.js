/**
 * Project Name : Asset Management
 * @company YMSLI
 * @author  Abhinandan Kumar
 * @date    January 30,2024
 * Copyright (c) 2024, Yamaha Motor Solutions (INDIA) Pvt Ltd.
 *
 * Module : DBConnector
 * Description
 * -----------------------------------------------------------------------------------
 * Used for all DB operations
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By          Modified On         Description
 * Abhinandan Kumar     30 Jan 2024         Initially created and added custom queries
 * -----------------------------------------------------------------------------------
 */


// Module dependencies
// const { Pool, Client } = require('pg');
// const settings = require('../config/appConfig');

// const message = require('../message/message'); 

// let pool
// try {
//   // Create a new Pool instance with database connection details
//   pool = new Pool({
//     user: settings.USERNAME,
//     host: settings.HOSTNAME,
//     database: settings.DATABASE_NAME,
//     password: settings.PASSWORD,
//     port: settings.PORT_NO, 
//   });

//   // Listen for connection errors
//   pool.on('error', (err) => {
    
//     console.error('Unexpected error on idle client', err);
//     process.exit(-1);
//   });

  
// } catch (e) {
  
//   console.error(message.DB_CONNECTION_ERROR, e.message);  
// }

// module.exports = {pool};


// const { Client } = require('pg');
// const settings = require('../config/appConfig');
// const message = require('../message/message');

// let client;

// try {
//   // Create a new Client instance with database connection details
//   client = new Client({
//     user: settings.USERNAME,
//     host: settings.HOSTNAME,
//     database: settings.DATABASE_NAME,
//     password: settings.PASSWORD,
//     port: settings.PORT_NO,
//   });

//   // Connect to the database
//   client.connect();

//   // Listen for connection errors
//   client.on('error', (err) => {
//     console.error('Unexpected error on client', err);
//     process.exit(-1);
//   });

// } catch (e) {
//   console.error(message.DB_CONNECTION_ERROR, e.message);
// }

// module.exports = { client };


// // Module dependencies
const { Pool, Client } = require('pg');
const settings = require('../config/appConfig');
const message = require('../message/message');

// Create a Pool instance with database connection details
const pool = new Pool({
  user: settings.USERNAME,
  host: settings.HOSTNAME,
  database: settings.DATABASE_NAME,
  password: settings.PASSWORD,
  port: settings.PORT_NO,
});

// Create a Client instance with database connection details
const client = new Client({
  user: settings.USERNAME,
  host: settings.HOSTNAME,
  database: settings.DATABASE_NAME,
  password: settings.PASSWORD,
  port: settings.PORT_NO,
});

// Connect the Client to the database
client.connect();

// Listen for connection errors on the Client
client.on('error', (err) => {
  console.error('Unexpected error on client', err);
  process.exit(-1);
});

// Listen for connection errors on the Pool
pool.on('error', (err) => {
  console.error('Unexpected error on pool', err);
  process.exit(-1);
});

module.exports = { pool, client };