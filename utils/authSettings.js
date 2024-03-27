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
 * Used for auth configuration for user login
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By          Modified On         Description
 * Abhinandan Kumar     26 Mar 2024         Initially created and added custom queries
 * -----------------------------------------------------------------------------------
 */

const GitHub = require('@auth/core/providers/github')
const auth = require('auth.js')
const settings = require('../config/appConfig')

const githubStrategyConfig = {
  clientId: settings.githubClientID,
  clientSecret: settings.githubClientSecret,
  callbackUrl: settings.githubCallbackUrl
}

const authSettings = {
  strategies: [
    new GithubStrategy(githubStrategyConfig)
  ]
}

const authInstance = auth(authSettings)

module.exports = authInstance
