/**
 * Organization : Yamaha Motor Solution (India)
 * Project Name : Asset Management System
 * Module       : dbqueries
 * Decription   : Generic queries of asset module
 * Created On   : February 02, 2024
 * Created By   : Abhinandan Kumar
 */


module.exports = {

    /**
     * @description Method to return query to add new product
     * @param  {} user_id
     */
    RegisterAssetQuery: function (req) {
        var { asset_category, asset_status, allocated_to, team, user_id, user_name, assetPrice, assetVendor } = req
        user_id = parseInt(user_id)
        assetPrice = parseInt(assetPrice)
        //asset_status = asset_status.toLowerCase();

        if (allocated_to == 'null' || allocated_to === '') {


            let sqlQuery = `  INSERT INTO asset_master (asset_category, asset_status, team, created_by, created_at,modified_by,modified_at, asset_price,asset_vendor)
                          VALUES (
                              (SELECT category_id FROM asset_category_type_master WHERE asset_category = $1),
                              (SELECT status_id FROM asset_status_type_master WHERE asset_status = CASE 
                                                                                                   WHEN $2 = 'unallocated' THEN 'Unallocated' 
                                                                                                   WHEN $2 = 'allocated' THEN 'Allocated' 
                                                                                                   ELSE $2 
                                                                                               END),
                              (SELECT team_id FROM asset_team_master WHERE team = $3),
                              $4,
                              current_timestamp,
                              $5,current_timestamp,
                              $6,
                              (select vendor_id from asset_vendor_master where vendor_name = $7 and asset_category = $8)
                          )
                          RETURNING *;
              
            `
            return {
                text: sqlQuery,
                values: [asset_category, asset_status, team, user_name, user_name, assetPrice, assetVendor, asset_category]
            }
        } else if (allocated_to != 'null') {
            let sqlQuery = `INSERT INTO asset_master(asset_category,asset_status,
                                                         allocated_to,
                                                         team,
                                                         created_by,
                                                         created_at,
                                                         modified_by,modified_at,asset_price,asset_vendor)
                            VALUES(
                                (SELECT category_id FROM asset_category_type_master WHERE asset_category = $1),
                                (SELECT status_id FROM asset_status_type_master WHERE asset_status = CASE 
                                                                                                     WHEN $2 = 'unallocated' THEN 'Unallocated' 
                                                                                                     WHEN $2 = 'allocated' THEN 'Allocated' 
                                                                                                     ELSE $2 
                                                                                                 END),
                                $3,
                                (SELECT team_id FROM asset_team_master WHERE team = $4),
                                $5,
                                current_timestamp,$6,current_timestamp,$7,(select vendor_id from asset_vendor_master where vendor_name=$8 and asset_category=$9)) 
                                RETURNING * ;`
            return {
                text: sqlQuery,
                values: [asset_category, asset_status, allocated_to, team, user_name, user_name, assetPrice, assetVendor, asset_category]
            }


        }


    },

    /**
     * @description Method to return query to get all inventory data 
     * @param  {} req
     */
    GetAssetCountQuery: function () {

        let sqlQuery = `							
        SELECT
                COALESCE(COUNT(*), 0) AS total_asset_count,
                COALESCE(SUM(CASE WHEN asset_status = 1 THEN 1 ELSE 0 END), 0) AS total_allocated_assets,
                COALESCE(SUM(CASE WHEN asset_status = 2 THEN 1 ELSE 0 END), 0) AS total_unallocated_assets,
                COALESCE(SUM(CASE WHEN asset_category = 1 THEN 1 ELSE 0 END), 0) AS total_laptop_assets,
                COALESCE(SUM(CASE WHEN asset_category = 2 THEN 1 ELSE 0 END), 0) AS total_desktop_assets,
                COALESCE(SUM(CASE WHEN asset_category = 4 THEN 1 ELSE 0 END), 0) AS total_mobile_assets,
                COALESCE(SUM(CASE WHEN asset_category = 3 THEN 1 ELSE 0 END), 0) AS total_dongle_assets,
                COALESCE(SUM(CASE WHEN team= 2 THEN 1 ELSE 0 END), 0) AS total_OSS_assets,
                COALESCE(SUM(CASE WHEN team= 3 THEN 1 ELSE 0 END), 0) AS total_ETI_assets,
                COALESCE(SUM(CASE WHEN team= 4 THEN 1 ELSE 0 END), 0) AS total_SAP_assets,
                COALESCE(SUM(CASE WHEN team= 6 THEN 1 ELSE 0 END), 0) AS total_YNA_assets,
                COALESCE(SUM(CASE WHEN team= 5 THEN 1 ELSE 0 END), 0) AS total_Microsoft_assets,
                COALESCE(SUM(CASE WHEN team= 1 THEN 1 ELSE 0 END), 0) AS total_Not_Allocated_assets,
                COALESCE(SUM(CASE WHEN team= 5 THEN 1 ELSE 0 END), 0) AS total_IT_Infra_assets
            FROM
                asset_master;
                `

        return { text: sqlQuery, values: [] }
    },

    /**
   * @description Method to return query to update ASSET details 
   * @param  {} user_id
   */
    UpdateAssetQuery: function (req) {
        let { asset_id, team, asset_status, allocated_to, user_id, user_name } = req
        asset_id = parseInt(asset_id),
            user_id = parseInt(user_id)
        if (allocated_to === 'null') {
            let sqlQuery = `UPDATE asset_master
                            SET 
                                team = (SELECT team_id FROM asset_team_master WHERE team = $2),
                                asset_status = (SELECT status_id FROM asset_status_type_master WHERE asset_status = CASE 
                                                                                            WHEN $3 = 'unallocated' THEN 'Unallocated' 
                                                                                            WHEN $3 = 'allocated' THEN 'Allocated' 
                                                                                            ELSE $3 
                                                                                        END),
                                allocated_to = NULL,
                                modified_at = current_timestamp,
                                modified_by = $4
                            WHERE 
                                asset_id = $1
                            RETURNING *;
                         
        `
            return { text: sqlQuery, values: [asset_id, team, asset_status, user_name] }
        } else {

            let sqlQuery = `UPDATE asset_master
                            SET 
                                team = (SELECT team_id FROM asset_team_master WHERE team = $2),
                                asset_status = (SELECT status_id FROM asset_status_type_master WHERE asset_status = CASE 
                                                                                    WHEN $3 = 'unallocated' THEN 'Unallocated' 
                                                                                    WHEN $3 = 'allocated' THEN 'Allocated' 
                                                                                    ELSE $3 
                                                                                END),
                                allocated_to = $4,
                                modified_at = current_timestamp,
                                modified_by = $5
                            WHERE 
                                asset_id = $1
                            RETURNING*;               
        `

            return { text: sqlQuery, values: [asset_id, team, asset_status, allocated_to, user_name] }

        }
    }
    ,


    /**
   * @description Method to return query to get all assets from asset_master
   * @param  {} user_id
   */
    GetAllAssetsQuery: function () {

        let sqlQuery = `
                        SELECT
                            a.asset_id,
                            actm.asset_category AS asset_category,
                            astm.asset_status AS asset_status,
                            COALESCE(um_allocated.user_name, 'Not Allocated') AS allocated_to,
                            COALESCE(atm.team, 'No Team') AS team,
                            a.created_by,
                            a.created_at,
                        a.modified_by,
                            a.modified_at
                        FROM
                            asset_master a
                        LEFT JOIN
                            asset_category_type_master actm ON a.asset_category = actm.category_id
                        LEFT JOIN
                            asset_status_type_master astm ON a.asset_status = astm.status_id
                        LEFT JOIN
                            user_master um_allocated ON a.allocated_to = um_allocated.user_id
                        LEFT JOIN
                            asset_team_master atm ON a.team = atm.team_id
                        ORDER BY asset_id;  `

        return { text: sqlQuery, values: [] }
    },

    /**
   * @description Method to return query to get allocated assets from asset_master
   * @param  {} user_id
   */
    GetAllocatedAssetsQuery: function () {

        // let sqlQuery = `SELECT asset_id,asset_category,asset_status,team,allocated_to,modified_by FROM asset_master where  asset_status = 'allocated' `

        let sqlQuery = `
                    SELECT
                        a.asset_id,
                        actm.asset_category AS asset_category,
                        astm.asset_status AS asset_status,
                        COALESCE(um_allocated.user_name, 'Not Allocated') AS allocated_to,
                        COALESCE(atm.team, 'No Team') AS team,
        
                        a.created_by,
                        a.created_at,
       
                        a.modified_by,
                        a.modified_at
                    FROM
                        asset_master a
                    LEFT JOIN
                        asset_category_type_master actm ON a.asset_category = actm.category_id
                    LEFT JOIN
                        asset_status_type_master astm ON a.asset_status = astm.status_id
                    LEFT JOIN
                        user_master um_allocated ON a.allocated_to = um_allocated.user_id
                    LEFT JOIN
                        asset_team_master atm ON a.team = atm.team_id

                    WHERE a.asset_status = 1
                    ORDER BY asset_id;
 `
        return { text: sqlQuery, values: [] }
    },


    /**
   * @description Method to return query to get unallocated assets from asset_master
   * @param  {} user_id
   */
    GetUnallocatedAssetsQuery: function () {

        // let sqlQuery = `SELECT asset_id,asset_category,asset_status,team,status_change_date,modified_by FROM asset_master where  asset_status = 'unallocated' `
        let sqlQuery = `
                        SELECT
                            a.asset_id,
                            actm.asset_category AS asset_category,
                            astm.asset_status AS asset_status,
                            COALESCE(um_allocated.user_name, 'Not Allocated') AS allocated_to,
                            COALESCE(atm.team, 'No Team') AS team,
                            a.created_by,
                            a.created_at,
                            a.modified_by,
                            a.modified_at
                        FROM
                            asset_master a
                        LEFT JOIN
                            asset_category_type_master actm ON a.asset_category = actm.category_id
                        LEFT JOIN
                            asset_status_type_master astm ON a.asset_status = astm.status_id
                        LEFT JOIN
                            user_master um_allocated ON a.allocated_to = um_allocated.user_id
                        LEFT JOIN
                            asset_team_master atm ON a.team = atm.team_id
                        WHERE a.asset_status = 2
                        ORDER BY asset_id;
 `

        return { text: sqlQuery, values: [] }
    },

    /**
   * @description Method to return query to get assets teamwise from asset_master
   * @param  {} user_id
   */
    GetTeamWiseAssetsQuery: function (req) {
        var team = req

        // let sqlQuery = `SELECT asset_id,asset_category,asset_status,allocated_to,team,created_at,created_by,modified_by FROM asset_master where  team = $1 ;`
        let sqlQuery = `SELECT
                            a.asset_id,
                            actm.asset_category AS asset_category,
                            astm.asset_status AS asset_status,
                            COALESCE(um_allocated.user_name, 'Not Allocated') AS allocated_to,
                            COALESCE(atm.team, 'No Team') AS team,
                            
                            a.created_by,
                            a.created_at,
                            
                            a.modified_by,
                            a.modified_at
                        FROM
                            asset_master a
                        LEFT JOIN
                            asset_category_type_master actm ON a.asset_category = actm.category_id
                        LEFT JOIN
                            asset_status_type_master astm ON a.asset_status = astm.status_id
                        LEFT JOIN
                            user_master um_allocated ON a.allocated_to = um_allocated.user_id
                        LEFT JOIN
                            asset_team_master atm ON a.team = atm.team_id


                        WHERE atm.team = $1
                        ORDER BY asset_id;`

        return { text: sqlQuery, values: [team] }
    },

    /**
   * @description Method to return query to get assets categorywise from asset_master
   * @param  {} user_id
   */
    GetCategoryWiseAssetsQuery: function (req) {
        var category = req

        //let sqlQuery = `SELECT asset_id,asset_category,created_by,created_at,allocated_to,status_change_date FROM asset_master where  asset_category = $1 `

        let sqlQuery = `SELECT
                            a.asset_id,
                            actm.asset_category AS asset_category,
                            astm.asset_status AS asset_status,
                            COALESCE(um_allocated.user_name, 'Not Allocated') AS allocated_to,
                            COALESCE(atm.team, 'No Team') AS team,
                            a.created_by,
                            a.created_at,
                            a.modified_by,
                            a.modified_at
                        FROM
                            asset_master a
                        LEFT JOIN
                            asset_category_type_master actm ON a.asset_category = actm.category_id
                        LEFT JOIN
                            asset_status_type_master astm ON a.asset_status = astm.status_id
                        LEFT JOIN
                            user_master um_allocated ON a.allocated_to = um_allocated.user_id
                        LEFT JOIN
                            asset_team_master atm ON a.team = atm.team_id
                        
                        WHERE actm.asset_category = $1

                        ORDER BY asset_id;`

        return { text: sqlQuery, values: [category] }
    },
    /**
   * @description Method to return query to get assets categorywise from asset_master
   * @param  {} req
   */
    GetAssetHistoryQuery: function (req) {
        var asset_id = req

        let sqlQuery = `  
        SELECT
        nah.history_id,
        nah.asset_id,
        actm.asset_category AS asset_category,
        CASE
            WHEN nah.asset_status = '0' THEN 'Introduced'
            ELSE astm.asset_status
        END AS asset_status,
        COALESCE(atm.team, 'Not Allocated') AS team,
        nah.created_by,
        nah.created_at,
        nah.modified_by,
        nah.modified_at,
        COALESCE(um.user_name, 'Not Allocated') AS allocated_to
    FROM
        asset_history nah
    LEFT JOIN
        asset_category_type_master actm ON nah.asset_category = actm.category_id::varchar
    LEFT JOIN
        asset_status_type_master astm ON nah.asset_status = astm.status_id::varchar
    LEFT JOIN
        user_master um ON nah.allocated_to = um.user_id::varchar
    LEFT JOIN
        asset_team_master atm ON nah.team = atm.team_id
    WHERE
        nah.asset_id = $1
    ORDER BY
        nah.history_id DESC;
    

 `

        return { text: sqlQuery, values: [asset_id] }
    },

    GetAssetDetailsQuery: function (req) {
        var asset_id = req

        let sqlQuery = `SELECT 
                            anm.asset_id,
                            actm.asset_category AS asset_category,
                            astm.asset_status AS asset_status,
                            anm.allocated_to,
                            atm.team AS team
                        FROM 
                            asset_master anm
                        LEFT JOIN 
                            asset_category_type_master actm ON anm.asset_category = actm.category_id
                        LEFT JOIN 
                            asset_status_type_master astm ON anm.asset_status = astm.status_id
                        LEFT JOIN 
                            asset_team_master atm ON anm.team = atm.team_id
                        WHERE 
                            anm.asset_id = $1;
          ;`

        return { text: sqlQuery, values: [asset_id] }
    },

    /**
   * @description Method to return query to get status types from asset_status_type_master
   * @param  {} 
   */
    GetStatusTypeQuery: function () {

        let sqlQuery = `SELECT asset_status FROM asset_status_type_master  ;`

        return { text: sqlQuery, values: [] }
    },

    /**
* @description Method to return query to get team types from asset_team_master
* @param  {} 
*/
    GetTeamTypeQuery: function () {

        let sqlQuery = `SELECT team FROM asset_team_master order by team_id  ;`

        return { text: sqlQuery, values: [] }
    },

    /**
   * @description Method to return query to get asset category types from asset_category_type_master
   * @param  {} 
   */
    GetCategoryTypeQuery: function () {

        let sqlQuery = `SELECT asset_category FROM asset_category_type_master ;  `

        return { text: sqlQuery, values: [] }
    },


    /**
     * @description Method to return query to add new vendor
     * @param  {} user_id
     */
    RegisterVendorQuery: function (req) {
        var { assetCategory, vendorName, vendorEmail, vendorAddress, vendorContactNumber, pricePerUnit, user_id } = req
        user_id = parseInt(user_id)
        //asset_status = asset_status.toLowerCase();

        let sqlQuery = `  INSERT INTO asset_vendor_master (
            vendor_name, category_id, asset_category, vendor_price_per_unit,
            vendor_email, vendor_contact_number, vendor_address, created_by, modified_by,created_at
            
        )
        VALUES (
            $1,
            (SELECT category_id FROM asset_category_type_master WHERE asset_category = $2),
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            current_timestamp
        )
        RETURNING *;
        
              
            `
        return {
            text: sqlQuery,
            values: [vendorName, assetCategory, assetCategory, pricePerUnit, vendorEmail, vendorContactNumber, vendorAddress, user_id, user_id]
        }

    },

    /**
     * @description Method to return query to get employee assets from asset_master
     * @param  {} user_id
     */
    GetEmployeeAssetsQuery: function (req) {
        var user_id = req

        let sqlQuery = `SELECT 
                            anm.asset_id,
                            actm.asset_category AS asset_category,
                            anm.modified_at,
                            avm.vendor_name as asset_vendor
                        FROM 
                            asset_master anm
                        LEFT JOIN 
                            asset_category_type_master actm ON anm.asset_category = actm.category_id
                        LEFT JOIN 
                            asset_vendor_master avm ON anm.asset_vendor = avm.vendor_id
                        WHERE 
                            anm.allocated_to = $1;
          ;`

        return { text: sqlQuery, values: [user_id] }
    },

    /**
     * @description Method to return query to get employee assets from asset_master
     * @param  {} user_id
     */
    GetEmployeesQuery: function () {


        let sqlQuery = `SELECT 
        um.user_id, um.user_name, atm.team
    FROM 
        user_master um
    LEFT JOIN 
        asset_team_master atm
    ON 
        um.team = atm.team_id;
                        
          `

        return { text: sqlQuery, values: [] }
    },

    /**
     * @description Method to return query to get employee issues data from asset_issue_master
     * @param  {} user_id
     */
    GetEmployeeIssueDataQuery: function (req) {
        var user_id = req

        let sqlQuery = `SELECT 
        aim.issue_id,
        aitm.issue_type as issue_type,
        actm.asset_category AS asset_category,
        aim.created_at as raised_at,
        aistm.issue_status as issue_status,
        CASE 
            WHEN aim.modified_by IS NULL OR aim.modified_by = '' THEN 'Not Modified'
            ELSE aim.modified_by
        END as modified_by,
        aim.modified_at
    FROM 
        asset_issue_master aim
    LEFT JOIN 
        asset_category_type_master actm ON aim.asset_category = actm.category_id
    LEFT JOIN 
        asset_issue_type_master aitm ON aim.issue_type = aitm.issue_type_id
    LEFT JOIN 
        asset_issue_status_type_master aistm ON aim.issue_status_id = aistm.issue_status_id
    WHERE 
        aim.user_id = $1
    
    UNION
SELECT 
    arm.request_id as issue_id,
    'New Asset Request' as issue_type,
    actm.asset_category AS asset_category,
    arm.created_at as raised_at,
    aistm.issue_status as issue_status,
    COALESCE(um.user_name, 'Not Modified') as modified_by,
    arm.modified_at
FROM 
    asset_request_master arm
LEFT JOIN 
    asset_category_type_master actm ON arm.asset_category = actm.category_id
LEFT JOIN 
    asset_issue_status_type_master aistm ON arm.request_status = aistm.issue_status_id
LEFT JOIN
    user_master um ON arm.modified_by = um.user_id::varchar
WHERE 
    arm.created_by = $2
order by issue_status 
              ;`

        return { text: sqlQuery, values: [user_id, user_id] }
    },

    /**
   * @description Method to return query to get issue types from asset_issue_type_master
   * @param  {} 
   */
    GetIssueTypeQuery: function () {

        let sqlQuery = `SELECT issue_type FROM asset_issue_type_master  ;`

        return { text: sqlQuery, values: [] }
    },


    /**
   * @description Method to return query to report issue in asset_issue_master
   * @param  {} 
   */
    ReportIssueQuery: function (req) {
        var { reportAssetID, reportAssetCategory, reportIssueType, reportIssueDescription, user_name, user_id } = req
        reportAssetID = parseInt(reportAssetID);
        let sqlQuery = `INSERT INTO asset_issue_master (
            asset_id, asset_category, issue_type, issue_description, issue_status_id,
            created_by, modified_by,created_at, user_id
        )
        VALUES (
            $1,
            (SELECT category_id FROM asset_category_type_master WHERE asset_category = $2),
            (SELECT issue_type_id FROM asset_issue_type_master WHERE issue_type=$3),
            $4,
            (SELECT issue_status_id FROM asset_issue_status_type_master WHERE issue_status ='Reported'),
            $5,
            $6,
            current_timestamp,
            $7
        )
        RETURNING *;`

        return { text: sqlQuery, values: [reportAssetID, reportAssetCategory, reportIssueType, reportIssueDescription, user_name, user_name, user_id] }
    },


    /**
     * @description Method to return query to get all pending issues count from asset_issue_master 
     * @param  {} req
     */
    GetPendingIssueCountQuery: function () {

        let sqlQuery = `
        SELECT
            COUNT(DISTINCT aim.issue_id) AS total_pending_issue_count,
            COALESCE(SUM(CASE WHEN aim.issue_type = 1 THEN 1 ELSE 0 END), 0) AS total_software_issues,
            COALESCE(SUM(CASE WHEN aim.issue_type = 2 THEN 1 ELSE 0 END), 0) AS total_hardware_issues,
            COALESCE(SUM(CASE WHEN aim.issue_type = 3 THEN 1 ELSE 0 END), 0) AS total_damage_issues,
            COALESCE(SUM(CASE WHEN aim.issue_type = 4 THEN 1 ELSE 0 END), 0) AS total_replacement_issues,
            COALESCE((SELECT COUNT(*) FROM asset_request_master WHERE request_status IN (1, 3)), 0) AS total_asset_requests
        FROM
            asset_issue_master aim
        WHERE 
            aim.issue_status_id IN (1, 3);
        
        
    
        ;`

        return { text: sqlQuery, values: [] }
    },

    /**
   * @description Method to return query to get pending issues from asset_issue_master
   * @param  {} 
   */
    GetPendingIssueQuery: function (req) {
        var issue_type = req

        let sqlQuery = `SELECT 
                            aim.issue_id,
                            aim.created_by AS raised_by,
                            aim.created_at AS raised_at,
                            actm.asset_category AS asset_category,
                            aitm.issue_type AS issue_type,
                            aistm.issue_status AS issue_status
                        FROM 
                            asset_issue_master aim
                        LEFT JOIN
                            asset_category_type_master actm ON aim.asset_category = actm.category_id 
                        LEFT JOIN
                            asset_issue_type_master aitm ON aim.issue_type = aitm.issue_type_id
                        LEFT JOIN 
                            asset_issue_status_type_master aistm ON aim.issue_status_id = aistm.issue_status_id
                        WHERE
                            aim.issue_type = (SELECT issue_type_id from asset_issue_type_master WHERE issue_type = $1) AND
                            aim.issue_status_id IN (SELECT issue_status_id from asset_issue_status_type_master WHERE issue_status = 'Pending' OR issue_status='Reported')
                        ORDER BY
                            issue_id DESC; `

        return { text: sqlQuery, values: [issue_type] }
    },

    /**
   * @description Method to return query to get resolved issues from asset_issue_master
   * @param  {} 
   */
    GetResolvedIssueQuery: function () {

        let sqlQuery = `							
        SELECT 
            aim.issue_id,
            aim.created_by AS raised_by,
            aim.created_at AS raised_at,
            actm.asset_category AS asset_category,
            aitm.issue_type AS issue_type,
            aistm.issue_status AS issue_status,
            aim.modified_by,
            aim.modified_at
        FROM 
            asset_issue_master aim
        LEFT JOIN
            asset_category_type_master actm ON aim.asset_category = actm.category_id 
        LEFT JOIN
            asset_issue_type_master aitm ON aim.issue_type = aitm.issue_type_id
        LEFT JOIN 
            asset_issue_status_type_master aistm ON aim.issue_status_id = aistm.issue_status_id
        WHERE
            aim.issue_status_id = 2
        
        UNION
        
        SELECT 
            arm.request_id AS issue_id,
            um.user_name AS raised_by,
            arm.created_at AS raised_at,
            actm.asset_category AS asset_category,
            'New Asset Request' AS issue_type,
            aistm.issue_status AS issue_status,
            umn.user_name as modified_by,
            arm.modified_at
        FROM 
            asset_request_master arm
        LEFT JOIN
            asset_category_type_master actm ON arm.asset_category = actm.category_id 
        LEFT JOIN 
            asset_issue_status_type_master aistm ON arm.request_status = aistm.issue_status_id
        LEFT JOIN
            user_master um on arm.created_by = um.user_id
        LEFT JOIN 
            user_master umn on arm.modified_by = umn.user_id::varchar
        WHERE
            arm.request_status = 2
            
        ORDER BY
            issue_id DESC;
         `

        return { text: sqlQuery, values: [] }
    },

    /**
   * @description Method to return query to get issues details from asset_issue_master
   * @param  {} 
   */
    GetIssueDetailsQuery: function (req) {
        let issue_id = req
        let sqlQuery = `SELECT 
                            aim.issue_id,
                            aim.created_by AS raised_by,
                            aim.created_at AS raised_at,
                            actm.asset_category AS asset_category,
                            aitm.issue_type AS issue_type,
                            aistm.issue_status AS issue_status,
                            aim.issue_description,
                            aim.modified_by,
                            aim.modified_at
                        FROM 
                            asset_issue_master aim
                        LEFT JOIN
                            asset_category_type_master actm ON aim.asset_category = actm.category_id 
                        LEFT JOIN
                            asset_issue_type_master aitm ON aim.issue_type = aitm.issue_type_id
                        LEFT JOIN 
                            asset_issue_status_type_master aistm ON aim.issue_status_id = aistm.issue_status_id
                        WHERE
                            aim.issue_id = $1
                        ORDER BY
                            issue_id DESC; `

        return { text: sqlQuery, values: [issue_id] }
    },

    /**
   * @description Method to return query to get issues details from asset_issue_master
   * @param  {} 
   */
    GetRequestDetailsQuery: function (req) {
        let requestId = req
        let sqlQuery = `SELECT 
        ar.request_id,
        av.vendor_name AS asset_vendor,
        actm.asset_category AS asset_category,
        aistm.issue_status AS request_status,
        um.user_name AS raised_by,
        ar.created_at AS raised_at,
        ar.request_description
    FROM 
        asset_request_master ar
    LEFT JOIN 
        asset_vendor_master av ON ar.asset_vendor = av.vendor_id
    LEFT JOIN 
        asset_category_type_master actm ON ar.asset_category = actm.category_id
    LEFT JOIN 
        asset_issue_status_type_master aistm ON ar.request_status = aistm.issue_status_id
    LEFT JOIN 
        user_master um ON ar.created_by = um.user_id
        WHERE request_id = $1
        ; `

        return { text: sqlQuery, values: [requestId] }
    },


    /**
  * @description Method to return query to get issue status from asset_issue_status_type_master
  * @param  {} 
  */
    GetIssueStatusTypeQuery: function () {

        let sqlQuery = `SELECT issue_status FROM asset_issue_status_type_master  ;`

        return { text: sqlQuery, values: [] }
    },

    /**
   * @description Method to return query to get vendor from asset_vendor_master
   * @param  {} 
   */
    GetVendorQuery: function () {

        let sqlQuery = `SELECT vendor_name as name FROM asset_vendor_master  ;`

        return { text: sqlQuery, values: [] }
    },

    /**
   * @description Method to return query to update issue status in asset_issue_master
   * @param  {} 
   */
    UpdateIssueQuery: function (req) {
        let { user_name, issue_status, issue_id } = req

        let sqlQuery = `UPDATE asset_issue_master 
                        SET 
                            issue_status_id = (Select issue_status_id from asset_issue_status_type_master where issue_status=$1),
                            modified_by = $2,
                            modified_at = current_timestamp

                        WHERE issue_id = $3
                            RETURNING *;`

        return { text: sqlQuery, values: [issue_status, user_name, issue_id] }
    },

    /**
    * @description Method to return query to get asset vendor  from asset_vendor_master
    * @param  {} 
    */
    GetVendorQuery: function (req) {
        var asset_category = req

        let sqlQuery = `SELECT avm.vendor_name,  avm.vendor_price_per_unit as vendor_price, 
                        actm.asset_category 
                        FROM asset_vendor_master avm
                        LEFT JOIN asset_category_type_master actm 
                        On avm.category_id = actm.category_id ;  `

        return { text: sqlQuery, values: [] }
    },

    /**
    * @description Method to return query to insert budget used in the asset_budget_master 
    * @param  {} 
    */
    InsertBudgetQuery: function (req) {
        var { allocatedBudget, budgetYear, user_id } = req

        let sqlQuery = `INSERT INTO asset_budget_master (allocated_budget_amount,allocated_budget_used,budget_year,created_by,created_at, modified_by)
                        VALUES ($1,0,$2,$3,current_timestamp,$4) RETURNING *;
          `

        return { text: sqlQuery, values: [allocatedBudget, budgetYear, user_id, user_id] }
    },

    /**
    * @description Method to return query to insert budget used in the asset_budget_master 
    * @param  {} 
    */
    UpdateBudgetQuery: function (req) {
        var { allocatedBudget, budgetUsed, user_id, budgetYear } = req

        let sqlQuery = `UPDATE asset_budget_master 
                        SET
                        allocated_budget_amount = $1,
                        allocated_budget_used = $2,
                        modified_by = $3,
                        modified_at = current_timestamp
                        where budget_year = $4 RETURNING *;
          `

        return { text: sqlQuery, values: [allocatedBudget, budgetUsed, user_id, budgetYear] }
    },

    /**
    * @description Method to return query to insert budget used in the asset_budget_master 
    * @param  {} 
    */
    GetBudgetQuery: function (req) {
        const currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        //currentYear = parseInt(currentYear)

        let sqlQuery = `SELECT 
        COALESCE(allocated_budget_amount, 0) AS budget_allocated, 
        COALESCE(allocated_budget_used, 0) AS utilised_budget, 
        COALESCE(allocated_budget_amount - allocated_budget_used, 0) AS available_budget,
        COALESCE(created_by, 0) AS created_by, 
        COALESCE(created_at, NULL) AS created_at, 
        COALESCE(modified_by, 0) AS modified_by, 
        COALESCE(modified_at, NULL) AS modified_at,
        COALESCE(budget_year, NULL) AS budget_year,
        u1.user_name AS created_by_username,
        u2.user_name AS modified_by_username
    FROM 
        (SELECT 1) dummy
    LEFT JOIN 
        asset_budget_master ON budget_year = $1
    LEFT JOIN 
        user_master AS u1 ON asset_budget_master.created_by = u1.user_id
    LEFT JOIN 
        user_master AS u2 ON asset_budget_master.modified_by = u2.user_id
    ;
          `

        return { text: sqlQuery, values: [currentYear] }
    },

    /**
    * @description Method to return query to insert new asset request in the asset_request_master 
    * @param  {} 
    */
    RequestNewAssetQuery: function (req) {
        //var { assetCategory, assetVendor, user_id } = req
        var { assetCategory, user_id, requestDescription } = req


        let sqlQuery = `INSERT INTO asset_request_master (asset_category,request_description,created_by,created_at, modified_by)
                        VALUES ((select category_id from asset_category_type_master where asset_category = $1),
                            $2,
                            $3,current_timestamp,$4) RETURNING *;`

        return { text: sqlQuery, values: [assetCategory, requestDescription, user_id, user_id] }
    },

    /**
    * @description Method to return query to get request new asset data from the asset_request_master 
    * @param  {} 
    */
    GetNewAssetRequestQuery: function () {

        let sqlQuery = `SELECT 
        ar.request_id,
        av.vendor_name AS asset_vendor,
        actm.asset_category AS asset_category,
        aistm.issue_status AS request_status,
        um.user_name AS raised_by,
        ar.created_at AS raised_at
    FROM 
        asset_request_master ar
    LEFT JOIN 
        asset_vendor_master av ON ar.asset_vendor = av.vendor_id
    LEFT JOIN 
        asset_category_type_master actm ON ar.asset_category = actm.category_id
    LEFT JOIN 
        asset_issue_status_type_master aistm ON ar.request_status = aistm.issue_status_id
    LEFT JOIN 
        user_master um ON ar.created_by = um.user_id; 
          `

        return { text: sqlQuery, values: [] }
    },

    /**
        * @description Method to return query to update request new asset data from the asset_request_master 
        * @param  {} 
        */
    UpdateNewAssetRequestQuery: function (req) {
        var { issueStatus, user_id, requestId } = req

        let sqlQuery = `UPDATE asset_request_master
        SET 
            request_status = (
                SELECT issue_status_id
                FROM asset_issue_status_type_master
                WHERE issue_status = $1
            ),
            modified_by = $2
        WHERE 
            request_id = $3 RETURNING *; 
          `

        return { text: sqlQuery, values: [issueStatus, user_id, requestId] }
    },

    /**
    * @description Method to return query to get total asset Issues from asset_issue_master
    * @param  {} 
    */
    GetTotalAssetIssuesQuery: function () {


        let sqlQuery = `SELECT 
        aim.issue_id,
        aim.created_by AS raised_by,
        aim.created_at AS raised_at,
        actm.asset_category AS asset_category,
        aitm.issue_type AS issue_type,
        aistm.issue_status AS issue_status,
        aim.issue_description,
        aim.modified_by,
        aim.modified_at
    FROM 
        asset_issue_master aim
    LEFT JOIN
        asset_category_type_master actm ON aim.asset_category = actm.category_id 
    LEFT JOIN
        asset_issue_type_master aitm ON aim.issue_type = aitm.issue_type_id
    LEFT JOIN 
        asset_issue_status_type_master aistm ON aim.issue_status_id = aistm.issue_status_id
    ORDER BY
        issue_id DESC; `

        return { text: sqlQuery, values: [] }
    },

    /**
    * @description Method to return query to get total pending Issues from asset_issue_master
    * @param  {} 
    */
    GetTotalPendingIssuesQuery: function () {


        let sqlQuery = `		
		                SELECT 
                            aim.issue_id,
                            aim.created_by AS raised_by,
                            aim.created_at AS raised_at,
                            actm.asset_category AS asset_category,
                            aitm.issue_type AS issue_type,
                            aistm.issue_status AS issue_status
                        FROM 
                            asset_issue_master aim
                        LEFT JOIN
                            asset_category_type_master actm ON aim.asset_category = actm.category_id 
                        LEFT JOIN
                            asset_issue_type_master aitm ON aim.issue_type = aitm.issue_type_id
                        LEFT JOIN 
                            asset_issue_status_type_master aistm ON aim.issue_status_id = aistm.issue_status_id
                        WHERE
                            aim.issue_status_id IN (SELECT issue_status_id from asset_issue_status_type_master WHERE issue_status = 'Pending' OR issue_status='Reported')
                        ORDER BY
                            issue_id DESC;
 `

        return { text: sqlQuery, values: [] }
    },


    /**
    * @description Method to return query to get categorywise asset request from asset_request_master
    * @param  {} req
    */
    GetCategoryWiseAssetRequestQuery: function (req) {
        let category = req

        let sqlQuery = `
        SELECT 
        ar.request_id,
        'New Asset Request' as issue_type,
        actm.asset_category AS asset_category,
        aistm.issue_status AS request_status,
        um.user_name AS raised_by,
        ar.created_at AS raised_at
    FROM 
        asset_request_master ar
    LEFT JOIN 
        asset_category_type_master actm ON ar.asset_category = actm.category_id
    LEFT JOIN 
        asset_issue_status_type_master aistm ON ar.request_status = aistm.issue_status_id
    LEFT JOIN 
        user_master um ON ar.created_by = um.user_id
    where ar.asset_category = (select category_id from asset_category_type_master where asset_category = $1) and (ar.request_status = 1 or ar.request_status =3) 

; 
 `

        return { text: sqlQuery, values: [category] }
    },

    /**
         * @description Method to return query to get all pending issues and requests count from asset_issue_master and asset_request_master
         * @param  {} req
         */
    GetPendingIssueAndRequestCountQuery: function () {

        let sqlQuery = `
        SELECT
        issues.total_issues_count,
        issues.total_pending_issues,
        issues.total_software_issues,
        issues.total_hardware_issues,
        issues.total_damage_issues,
        issues.total_replacement_issues,
        requests.total_request_count,
        requests.total_pending_requests,
        requests.total_laptop_request,
        requests.total_desktop_request,
        requests.total_dongle_request,
        requests.total_mobile_request
    FROM (
        SELECT
            COALESCE(COUNT(*), 0) AS total_issues_count,
            COALESCE(SUM(CASE WHEN issue_status_id = 1 OR issue_status_id = 3 THEN 1 ELSE 0 END), 0) AS total_pending_issues,
            COALESCE(SUM(CASE WHEN issue_type = 1 AND (issue_status_id = 1 OR issue_status_id = 3) THEN 1 ELSE 0 END), 0) AS total_software_issues,
            COALESCE(SUM(CASE WHEN issue_type = 2 AND (issue_status_id = 1 OR issue_status_id = 3) THEN 1 ELSE 0 END), 0) AS total_hardware_issues,
            COALESCE(SUM(CASE WHEN issue_type = 3 AND (issue_status_id = 1 OR issue_status_id = 3) THEN 1 ELSE 0 END), 0) AS total_damage_issues,
            COALESCE(SUM(CASE WHEN issue_type = 4 AND (issue_status_id = 1 OR issue_status_id = 3) THEN 1 ELSE 0 END), 0) AS total_replacement_issues
        FROM
            asset_issue_master
    ) AS issues
    CROSS JOIN (
        SELECT
            COALESCE(COUNT(*), 0) AS total_request_count,
            COALESCE(SUM(CASE WHEN request_status = 1 OR request_status = 3 THEN 1 ELSE 0 END), 0) AS total_pending_requests,
            COALESCE(SUM(CASE WHEN asset_category = 1 AND (request_status = 1 OR request_status = 3) THEN 1 ELSE 0 END), 0) AS total_laptop_request,
            COALESCE(SUM(CASE WHEN asset_category = 2 AND (request_status = 1 OR request_status = 3) THEN 1 ELSE 0 END), 0) AS total_desktop_request,
            COALESCE(SUM(CASE WHEN asset_category = 3 AND (request_status = 1 OR request_status = 3) THEN 1 ELSE 0 END), 0) AS total_dongle_request,
            COALESCE(SUM(CASE WHEN asset_category = 4 AND (request_status = 1 OR request_status = 3) THEN 1 ELSE 0 END), 0) AS total_mobile_request
        FROM
            asset_request_master
    ) AS requests;
    
    `

        return { text: sqlQuery, values: [] }
    },


}







