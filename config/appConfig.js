const path = require('path')

module.exports = {
  // Log file naming and location
  PATH_LOG_FILE: path.join(__dirname, '..', 'Logs'),
  LOG_FILE_NAME: 'app.log',
  LOG_FILE_EXTENSION: '.log',
  LOGGER_AUDIT_FILE_NAME: 'audit.log',

  // Log rotation settings
  DATE_PATTERN: 'YYYY-MM-DD',
  ZIPPED_ARCHIVE: false,
  LOG_FILE_MAX_SIZE: '20m',
  LOGS_DELETE_LIMIT: '7d',

  // Server configuration
  SERVER_PORT: 4000,

  // Database configuration
  DATABASE_TYPE: 'postgres',
  DATABASE_NAME: 'assetManagement',
  USERNAME: 'postgres',
  PASSWORD: 'YAMAHA',
  PORT_NO: '5432',
  HOSTNAME: 'localhost',

  // Configuration
  SALT_ROUNDS: 10,
  queue: 'new-issues-queue',

  // auth Configuration
  githubClientID: 'db94200aca908ed23864',
  githubClientSecret: '8ab86012b670b5348294360de02023222f136f8d',
  githubCallbackUrl: 'http://localhost:4000/auth/github/callback'
}
