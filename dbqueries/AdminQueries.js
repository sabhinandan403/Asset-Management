/**
 * Organization : Yamaha Motor Solution (India)
 * Project Name : Inventory Management System
 * Module       : dbqueries
 * Decription   : Generic queries for user registeration
 * Created On   : January 30, 2024
 * Modified on  : January 31, 2024 - Modified AddUser and RegisterUser for user_role
 * Created By   : Abhinandan Kumar
 */


module.exports = {
    /**
     * @description Method to return query to check user details in the database if the email is not already exists otherwise return false
     * @param  {} req
     */
    CheckUserEmail: function (req) {
        let user_email = req;
        let sqlQuery = `SELECT * FROM user_master WHERE user_email='${user_email}' ;`


        return {
            text: sqlQuery,
            values: []
        };
    },
    /**
     * @description Method to return query to insert user details in the database if the email is not already exists otherwise return false
     * @param  {} req
     */
    RegisterUserQuery: function (req) {
        let { user_name, user_email, user_role, password, team } = req;
        user_name = user_name.toLowerCase();

        if (user_role === 'admin') {
            user_role = 2
            let sqlQuery = `
                            INSERT INTO user_master (user_name,user_email,user_role,password,team)   
                            VALUES ($1, $2,$3,$4,(select team_id from asset_team_master where team = $5));
                        
        `
            return {
                text: sqlQuery,
                values: [user_name, user_email, user_role, password, team]
            }
        } else {
            user_role = 1
            let sqlQuery = `INSERT INTO user_master(user_name,user_email,user_role,password, team)
                            VALUES ($1,$2,$3,$4,(select team_id from asset_team_master where team = $5));
                           
                            `

            return {
                text: sqlQuery,
                values: [user_name, user_email, user_role, password, team]
            }
        };
    },

    /**
    * @description Method to return query to verify user details while login 
    * @param  {} user_id
    */
    ValidateUser: function (req) {
        const { email } = req
        let sqlQuery = `SELECT * FROM user_master
                        WHERE user_email = $1
       ;
       `
        return {
            text: sqlQuery,
            values: [email]
        }
    },

    /**
    * @description Method to return query to get user type while user registration 
    * @param  {} user_id
    */
    GetUserTypeQuery: function () {

        let sqlQuery = `SELECT user_role FROM user_role_type_master
                        
       ;
       `
        return {
            text: sqlQuery,
            values: []
        }
    },

    /**
    * @description Method to return query to get user type while user registration 
    * @param  {} user_id
    */
    GetTeamQuery: function () {

        let sqlQuery = `SELECT team FROM asset_team_master
                        
       ;
       `
        return {
            text: sqlQuery,
            values: []
        }
    },

    /**
    * @description Method to return query to get all the vendors from asset_vendor_master for addQuotation screen 
    * @param  {} user_id
    */
    GetVendorDetailsQuery: function () {

        let sqlQuery = `
        SELECT
            avm.vendor_id,
            avm.vendor_name,
            avm.asset_category,
            avm.vendor_price_per_unit AS vendor_price,
            COALESCE(um.user_name, '') AS added_by,
            avm.created_at AS added_at,
            COALESCE(avm.quotation_url, '{}') AS quotation_url,
            COALESCE(avm.quotation_filename, '{}') AS quotation_filename,
            COALESCE(avm.quotation_delete_token, '{}') AS quotation_delete_token
        FROM 
            asset_vendor_master avm
        LEFT JOIN
            user_master um ON avm.created_by = um.user_id;
`
        return {
            text: sqlQuery,
            values: []
        }
    },

    /**
    * @description Method to return query to get all the vendors from asset_vendor_master for addQuotation screen 
    * @param  {} user_id
    */
    GetVendorDetailsForUpdateQuery: function (req) {
        let vendorId = req
        let sqlQuery = `
        SELECT
            avm.vendor_id,
            avm.vendor_name,
            avm.asset_category,
            avm.vendor_price_per_unit AS vendor_price,
            avm.vendor_address,
            avm.vendor_contact_number,
            avm.vendor_email
            
        FROM 
            asset_vendor_master avm
        Where
            vendor_id = $1;
`
        return {
            text: sqlQuery,
            values: [vendorId]
        }
    },

    /**
    * @description Method to return query to insert vendor quotation details in the asset_vendor_master
    * @param  {} req
    */
    InsertQuotationDetailsQuery: function (req) {
        let { vendorID, quotation_url, quotation_filename } = req
        let sqlQuery = `UPDATE asset_vendor_master
                        SET 
                            quotation_url =  $2::json,
                            quotation_filename = $3::json
                        WHERE 
                            vendor_id = $1 RETURNING *;`
        return {
            text: sqlQuery,
            values: [vendorID, quotation_url, quotation_filename]
        }
    },

    /**
    * @description Method to return query to get  the quotation details from asset_vendor_master for quotatioDetails screen 
    * @param  {} req
    */
    GetQuotationUrlAndFilename: function (req) {
        let vendorID = req
        let sqlQuery = ` 
                        SELECT COALESCE(quotation_url::json, '{}'::json) AS quotation_url,
                        COALESCE(quotation_filename::json, '{}'::json) AS quotation_filename
                        FROM asset_vendor_master where vendor_id = $1;
        
        `
        return {
            text: sqlQuery,
            values: [vendorID]
        }
        
    },


    /**
    * @description Method to return query to get  the quotation details from asset_vendor_master for quotatioDetails screen 
    * @param  {} req
    */
    GetQuotationDetailsQuery: function (req) {
        let vendorId = req
        let sqlQuery = `
            SELECT
        avm.quotation_url AS quotation_url,
        avm.quotation_filename AS quotation_filename
        from 
        asset_vendor_master avm
        where vendor_id = $1;
    
    `
        return {
            text: sqlQuery,
            values: [vendorId]
        }
    },

    /**
    * @description Method to return query to update  the quotation details in asset_vendor_master for quotatioDetails screen 
    * @param  {} req
    */
    UpdateQuotationDetailsQuery: function (req) {
        let { vendorId, quotationName, quotationUrl } = req
        let sqlQuery = `  UPDATE asset_vendor_master
                        SET 
                            quotation_url =  $2::json,
                            quotation_filename = $3::json
                        WHERE 
                            vendor_id = $1 RETURNING *;
    
    `
        return {
            text: sqlQuery,
            values: [vendorId, JSON.stringify(quotationUrl), JSON.stringify(quotationName)]
        }
    },

}