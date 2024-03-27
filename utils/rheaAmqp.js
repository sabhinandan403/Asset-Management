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
 * Used for amqp connection
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By          Modified On         Description
 * Abhinandan Kumar     30 Jan 2024         Initially created and added custom queries
 * -----------------------------------------------------------------------------------
 */

const rhea = require('rhea');
const settings = require('../config/appConfig')

async function connectAndConsumeMessages() {
    try {
        const connection = rhea.create_connection({
            transport: 'tcp',
            host: 'localhost', // Replace with your AMQP server host
            port: 5672, // Replace with your AMQP server port
            username: 'guest', // Replace with your AMQP username
            password: 'password', // Replace with your AMQP password
        });

        await new Promise((resolve, reject) => {
            connection.on('connection_open', (context) => {
                console.log('Connected to AMQP server');
                resolve();
            });
            connection.on('error', (error) => {
                console.error('Error establishing connection:', error);
                reject(error);
            });

            connection.open();
        });

        const receiver = connection.open_receiver(settings.queue);

        return {
            consumeMessages: async function(callback) {
                try {
                    receiver.on('message', (context) => {
                        console.log('Received message:', context.message.body);
                        callback(context.message.body);
                    });
                } catch (error) {
                    console.error('Error consuming message:', error);
                    throw error;
                }
            }
        };
    } catch (error) {
        console.error('Error connecting and consuming messages:', error);
        throw error;
    }
}

async function connectAndSendMessages() {
    try {
        const connection = rhea.create_connection({
            transport: 'http',
            host: 'localhost', // Replace with your AMQP server host
            port: 5672, // Replace with your AMQP server port
            username: 'guest', // Replace with your AMQP username
            password: 'guest', // Replace with your AMQP password
        });

        await new Promise((resolve, reject) => {
            connection.on('connection_open', (context) => {
                console.log('Connected to AMQP server');
                resolve();
            });
            connection.on('error', (error) => {
                console.error('Error establishing connection:', error);
                reject(error);
            });

            connection.open();
        });

        await new Promise((resolve, reject) => {
            connection.once('sendable', (context) => {
                console.log('Sender is ready to send messages');
                resolve();
            });
        });

        const sender = connection.open_sender(settings.queue);

        return {
            sendMessage: async function(message) {
                try {
                    await new Promise((resolve, reject) => {
                        sender.send({ body: message }, (error) => {
                            if (error) {
                                console.error('Error sending message:', error);
                                reject(error);
                            } else {
                                console.log('Message sent successfully:', message);
                                resolve();
                            }
                        });
                    });
                } catch (error) {
                    console.error('Error sending message:', error);
                    throw error;
                }
            }
        };
    } catch (error) {
        console.error('Error connecting and sending messages:', error);
        throw error;
    }
}

module.exports = {
    connectAndSendMessages,
    connectAndConsumeMessages
};

