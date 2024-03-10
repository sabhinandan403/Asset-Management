/**
 * Project Name : Asset Management System
 * @company YMSLI
 * @author  Abhinandan Kumar
 * @date    30 Jan 2024
 * Copyright (c) 2024, Yamaha Motor Solutions (INDIA) Pvt Ltd.
 *
 * Description
 * -----------------------------------------------------------------------------------
 * Business Logic for user authentication
 *
 * This module has following functions:-
 * 1. Authenticate - to authenticate user credentials
 * -----------------------------------------------------------------------------------
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By               Modified On         Description
 * Abhinandan Kumar          30 Jan 2024         Initially Created
 * -----------------------------------------------------------------------------------
 */

var path = require("path");
const bcrypt = require('bcrypt');
const { pool, client } = require('../../dbconnector/DBConnector')
const message = require('../../message/message')
const DBQueries = require('../../dbqueries/AdminQueries');
const settings = require('../../config/appConfig')
const saltrounds = settings.SALT_ROUNDS




module.exports = {
    /**
     * @description Function to register and verify the user
     * @param  {} req
     */
    RegisterUser: async function (req) {
        const { user_role, password, user_email } = req

        try {
            //console.log('Select Query result:', selectResult)
            if (user_role === 'admin') {
                // Encrypt Password to store in database
                var hashedPassword = bcrypt.hashSync(password, saltrounds)
                req.password = hashedPassword

                // Get query to register new user
                let queryObject = DBQueries.RegisterUserQuery(req)

                //Call db to insert new user
                let result = await client.query(queryObject)
                console.log('Result when register user ', result.rows)
                //If user is already exists
                if (result.rowCount === 0) {
                    return ({ success: false, message: message.USER_ALREADY_EXISTS })
                }
                else {
                    return { success: true, message: message.INSERT_SUCCESS, data: result.rows }

                }
            }
            else {
                // Encrypt Password to store in database
                var hashedPassword = bcrypt.hashSync(password, saltrounds)
                req.password = hashedPassword
                // Get query to register new user
                let queryObject = DBQueries.RegisterUserQuery(req)

                //Call db to insert new user
                let result = await client.query(queryObject)
                console.log('Result when register user ', result.rows)
                //If user is already exists
                if (result.rowCount === 0) {
                    return ({ success: false, message: message.USER_ALREADY_EXISTS })
                }
                else {
                    return { success: true, message: message.INSERT_SUCCESS, data: result.rows }

                }
            }

        } catch (error) {

            if (error.code === '23505') {
                return { success: true, message: message.USER_ALREADY_EXISTS };
            }
            console.log('Internal server error when register user ', error)
            throw error
        }
    },

    /**
     * @description Function to authenticate the user
     * @param  {} req
     */
    ValidateUser: async function (req) {
        try {
            const { email, password } = req;
            var queryObject = DBQueries.ValidateUser(req)
            var result = await pool.query(queryObject)
            console.log('Authenticate user ', result.rows)
            if (result.rowCount === 0) {
                return { success: false, message: message.USER_NOT_FOUND };
            }
            else {

                const storedPasswordHash = result.rows[0].password;
                // Compare the hashed password with the provided password
                const passwordMatch = bcrypt.compareSync(password, storedPasswordHash);

                if (passwordMatch) {
                    console.log('User found and password is correct');
                    return { success: true, data: result.rows[0], message: message.USER_FOUND };
                } else {
                    console.log('User found but password is incorrect');
                    return { success: false, message: message.INCORRECT_PASSWORD, data: [] };

                }

            }
        } catch (error) {
            console.log('Error in authenticating the user ', error)
            throw error
        }
    },

    /**
     * @description Function to get the user role type
     * @param  {} req
     */
    GetUserType: async function () {
        try {

            var queryObject = DBQueries.GetUserTypeQuery()
            var result = await pool.query(queryObject)
            console.log('User role type ', result.rows)
            if (result.rowCount === 0) {
                return { success: false, message: message.USER_NOT_FOUND };
            }
            else {

                return { success: true, data: result.rows }
            }
        } catch (error) {
            console.log('Error in authenticating the user ', error)
            throw error
        }
    },


    /**
     * @description Function to get the user team
     * @param  {} req
     */
    GetTeam: async function () {
        try {

            var queryObject = DBQueries.GetTeamQuery()
            var result = await pool.query(queryObject)
            console.log('User role team ', result.rows)
            if (result.rowCount === 0) {
                return { success: false, message: message.GET_ERROR };
            }
            else {

                return { success: true, data: result.rows }
            }
        } catch (error) {
            console.log('Error in authenticating the user ', error)
            throw error
        }
    },

    /**
     * @description Function to get vendors from asset_vendor_master
     * @param  {} req
     */
    GetVendorDetails: async function () {
        try {

            var queryObject = DBQueries.GetVendorDetailsQuery()
            var result = await pool.query(queryObject)
            console.log('Vendor details ', result.rows)
            if (result.rowCount === 0) {
                return { success: false, message: message.GET_ERROR };
            }
            else {
                console.log('Vendor details :', result.rows)
                return { success: true, data: result.rows }
            }
        } catch (error) {
            console.log('Error in authenticating the user ', error)
            throw error
        }
    },

    /**
     * @description Function to add vendor quotation details
     * @param  {} req
     */
    InsertQuotationDetails: async function (req) {
        var {vendorID,quotation_url, quotation_filename} = req
        var newBody = {}
        try {
            let getQuery = DBQueries.GetQuotationUrlAndFilename(vendorID)
            let getQueryResult = await client.query(getQuery)
            if (getQueryResult.rowCount === 0) {
                return ({ success: false, message: message.INSERT_ERROR })
            } else {
                const urlsObject = (getQueryResult.rows[0].quotation_url);
                // Get the maximum index in the existing quotationUrl object
                const maxIndex = Object.keys(urlsObject).length === 0 ? 0 : Math.max(...Object.keys(urlsObject).map(Number));

                var mergedUrls = {};

                // If the existing quotationUrl object is not empty
                if (Object.keys(urlsObject).length > 0) {
                    // Iterate over the existing keys and values
                    Object.entries(urlsObject).forEach(([key, value]) => {
                        // Add the key-value pair to the mergedUrls object
                        mergedUrls[key] = value;
                    });
                } else {
                    // If quotationUrl is empty, set mergedUrls to an empty object
                    mergedUrls = {};
                }


                // Iterate over the newUrl object
                Object.entries(quotation_url).forEach(([key, value]) => {
                    // Calculate the index for the new entry
                    const newIndex = maxIndex + parseInt(key);

                    // Add the new URL to the mergedUrls object with the new index
                    mergedUrls[newIndex] = value;
                });

                let mergedFileNameObject = {}
                const fileNameObject = (getQueryResult.rows[0].quotation_filename)

                // If the existing quotationUrl object is not empty
                if (Object.keys(fileNameObject).length > 0) {
                    // Iterate over the existing keys and values
                    Object.entries(fileNameObject).forEach(([key, value]) => {
                        // Add the key-value pair to the mergedUrls object
                        mergedFileNameObject[key] = value;
                    });
                } else {
                    // If quotationUrl is empty, set mergedUrls to an empty object
                    mergedFileNameObject = {};
                }

                // Iterate over the newUrl object
                Object.entries(quotation_filename).forEach(([key, value]) => {
                    // Calculate the index for the new entry
                    const newIndex = maxIndex + parseInt(key);

                    // Add the new URL to the mergedUrls object with the new index
                    mergedFileNameObject[newIndex] = value;
                });

                newBody = {
                    vendorID : vendorID,
                    quotation_url : mergedUrls,
                    quotation_filename: mergedFileNameObject
                }

            }
            let query = DBQueries.InsertQuotationDetailsQuery((newBody))
            //Call db to insert new user
            let result = await client.query(query)
            console.log('Result when isnert quotation details ', result.rows)
            //If user is already exists
            if (result.rowCount === 0) {
                return ({ success: false, message: message.INSERT_ERROR })
            }
            else {

                return { success: true, message: message.INSERT_SUCCESS, data: result.rows }

            }

        } catch (error) {

            console.log('Internal server error when inserting quotation details ', error)
            throw error
        }
    },

    /**
     * @description Function to add vendor quotation details
     * @param  {} req
     */
    GetQuotationDetails: async function (req) {

        try {
            let query = DBQueries.GetQuotationDetailsQuery(req)
            //Call db to insert new user
            let result = await client.query(query)
            console.log('Result when get quotation details for quotationDetails screen ', result.rows)
            //If user is already exists
            if (result.rowCount === 0) {
                return ({ success: false, message: message.GET_ERROR })
            }
            else {
                return { success: true, message: message.GET_SUCCESS, data: result.rows }

            }

        } catch (error) {
            console.log('Internal server error when get quotation details ', error)
            throw error
        }
    },

    /**
    * @description Function to update vendor quotation details
    * @param  {} req
    */
    UpdateQuotationDetails: async function (req) {
        try {
            let query = DBQueries.UpdateQuotationDetailsQuery(req)
            //Call db to insert new user
            let result = await client.query(query)
            console.log('Result when update quotation details for quotationDetails screen ', result.rows)
            //If user is already exists
            if (result.rowCount === 0) {
                return ({ success: false, message: message.UPDATE_FAILED })
            }
            else {
                return { success: true, message: message.UPDATE_SUCCESS, data: result.rows }

            }

        } catch (error) {
            console.log('Internal server error when update quotation details ', error)
            throw error
        }
    },

    /**
     * @description Function to get vendors from asset_vendor_master
     * @param  {} req
     */
    GetVendorDetailsForUpdate: async function (req) {
        try {
            var queryObject = DBQueries.GetVendorDetailsForUpdateQuery(req)
            var result = await pool.query(queryObject)
            console.log('Vendor details ', result.rows)
            if (result.rowCount === 0) {
                return { success: false, message: message.GET_ERROR };
            }
            else {
                console.log('Vendor details :', result.rows)
                return { success: true, data: result.rows }
            }
        } catch (error) {
            console.log('Error in authenticating the user ', error)
            throw error
        }
    },
}