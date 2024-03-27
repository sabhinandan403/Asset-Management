/**
 * Project Name : Asset Management
 * @company YMSLI
 * @author  Abhinandan Kumar
 * @date    January 30,2024
 * Copyright (c) 2024, Yamaha Motor Solutions (INDIA) Pvt Ltd.
 *
 * Module : amqpConnection
 * Description
 * -----------------------------------------------------------------------------------
 * Used for amqp connection
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By          Modified On         Description
 * Abhinandan Kumar     30 Jan 2024         Initially created and added custom queries
 * -----------------------------------------------------------------------------------
 */

const amqp = require('amqplib')
const settings = require('../config/appConfig')
async function connect () {
  try {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()

    // Assert a queue for receiving messages
    const queue = settings.queue
    await channel.assertQueue(queue, { durable: true })

    return { connection, channel }
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error)
    throw error // Re-throw the error for the calling code to handle
  }
}

async function closeConnection (connection) {
  try {
    await connection.close()
    console.log('RabbitMQ connection closed')
  } catch (error) {
    console.error('Error closing RabbitMQ connection:', error)
  }
}

module.exports = { connect, closeConnection }
