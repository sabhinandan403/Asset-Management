/**
 * Project Name : Asset Management System
 * @company YMSLI
 * @author  Abhinandan Kumar
 * @date    January 31, 2024
 * Copyright (c) 2024, Yamaha Motor Solutions (INDIA) Pvt Ltd.
 *
 * Description
 * -----------------------------------------------------------------------------------
 * Bussines logic to execute command of CartID type
 *
 * This module has following public function :-

 * 1. GetAssetCount                 - To get total asset count, total allocated asset count , total unallocatd asset count, 
                                      allocated assets count teamwise and unallocated assets count teamwise
 * 2. UpdateAssetStatus             - To update asset status (allocated/unallocated)
 * 3. GetAllAssets                  - To get all assets from the asset master
 * 4. GetAllocatedAssets            - To get all allocated asset_master
 * 5. GetUnallocatedAssets          - To get all unallocated asset_master
 * 6. GetTeamwiseAssets             - To get all assets teamwise
 * 7. GetCategoryWiseAssets         - To get all assets categorywise (laptop/dongle/mobile/desktop)
 * 8. GetAssestHistory              - To get history of an asset
 * 9 AddAsset                      - To add an asset
 * -----------------------------------------------------------------------------------
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By           Modified On         Description
 * Abhinandan Kumar      31 Jan 2024         Initially created

 * -----------------------------------------------------------------------------------
 */

const { pool } = require('../../dbconnector/DBConnector')
const message = require('../../message/message')
const DBQuery = require('../../dbqueries/AssetQueries')
// const { connect, closeConnection } = require('../../utils/amqpConnection')
// const { connectAndConsumeMessages } = require('../../utils/rheaAmqp')
const settings = require('../../config/appConfig')
// const rhea = require('rhea')
// const { close } = require('fs')
module.exports = {
  /**
     * @description Function to get asset count information like total_assets,total_allocated_assets,total+unallocated_asstes
     * @param  {} req
     */
  GetAssetCount: async function () {
    try {
      const queryObject = DBQuery.GetAssetCountQuery()
      const result = await pool.query(queryObject)
      if (result.rowCount === 0) {
        return { success: false, message: message.GET_ERROR }
      } else {
        console.log('Result of asset count query is :', result.rows)
        return { success: true, data: result.rows }
      }
    } catch (error) {
      // logger.error(message.GET_ERROR, error)
      console.log('Error in getting asset count details ', error)
      throw error
    }
  },
  /**
     * @description Function to update asset status in the asset_master
     * @param  {} req
     */

  UpdateAsset: async function (req) {
    try {
      const queryObject = DBQuery.UpdateAssetQuery(req)
      const result = await pool.query(queryObject)
      if (result.rowCount === 0) {
        return { success: false, message: message.UPDATE_ERROR }
      } else {
        console.log('Result from the update status command :', result.rows[0])
        return { success: true, data: result.rows }
      }
    } catch (error) {
      console.log('Error in updating asset details :', error)
      throw error
    }
  },

  /**
     * @description Function to register new asset in the asset_master
     * @param  {} req
     */

  RegisterAsset: async function (req) {
    try {
      const queryObject = DBQuery.RegisterAssetQuery(req)
      const result = await pool.query(queryObject)
      console.log('Result from register asset command on asset_master ', result)
      if (result.rowCount === 0) {
        return { success: false, message: message.GET_ERROR }
      } else {
        return { success: true, message: message.INSERT_SUCCESS, data: result.rows }
      }
    } catch (error) {
      if (error.code === '23503') {
        return { success: false, message: message.INVALID_EMPLOYEE_ID }
      }
      // logger.error(message.GET_ERROR, error)
      console.log('Error in registering new asset details ', error)
      throw error
    }
  },

  /**
     * @description Function to get all assets from the asset_master
     * @param  {} req
     */
  GetAllAssets: async function () {
    try {
      const queryObject = DBQuery.GetAllAssetsQuery()
      const result = await pool.query(queryObject)
      console.log('Result from get all assets command on asset_master ', result.rows)
      if (result.rowCount === 0) {
        return { success: false, message: message.GET_ERROR }
      } else {
        return { success: true, data: result.rows }
      }
    } catch (error) {
      // logger.error(message.GET_ERROR, error)
      console.log('Error in getting all assets details ', error)
      throw error
    }
  },

  /**
    * @description Function to get all assets from the asset_master
    * @param  {} req
    */
  GetAllocatedAssets: async function () {
    try {
      const queryObject = DBQuery.GetAllocatedAssetsQuery()
      const result = await pool.query(queryObject)
      console.log('Result from get all allocated assets command on asset_master ', result.rows)
      if (result.rowCount === 0) {
        return { success: false, message: message.GET_ERROR }
      } else {
        return { success: true, data: result.rows }
      }
    } catch (error) {
      // logger.error(message.GET_ERROR, error)
      console.log('Error in getting allocated asset details ', error)
      throw error
    }
  },
  /**
         * @description Function to get all assets from the asset_master
         * @param  {} req
         */
  GetUnallocatedAssets: async function () {
    try {
      const queryObject = DBQuery.GetUnallocatedAssetsQuery()
      const result = await pool.query(queryObject)
      console.log('Result from get all unallocated assets command on asset_master ', result.rows)
      if (result.rowCount === 0) {
        return { success: false, message: message.GET_ERROR }
      } else {
        return { success: true, data: result.rows }
      }
    } catch (error) {
      // logger.error(message.GET_ERROR, error)
      console.log('Error in getting unallocated asset details ', error)
      throw error
    }
  },

  /**
         * @description Function to get all assets teamwise from the asset_master
         * @param  {} req
         */
  GetTeamWiseAssets: async function (req) {
    try {
      const queryObject = DBQuery.GetTeamWiseAssetsQuery(req)
      const result = await pool.query(queryObject)
      console.log('Result from get all assets teamwise command on asset_master ', result.rows)
      if (result.rowCount === 0) {
        return { success: false, message: message.GET_ERROR }
      } else {
        return { success: true, data: result.rows }
      }
    } catch (error) {
      // logger.error(message.GET_ERROR, error)
      console.log('Error in getting teamwise asset details ', error)
      throw error
    }
  },

  /**
         * @description Function to get all assets categorywise from the asset_master
         * @param  {} req
         */
  GetCategoryWiseAssets: async function (req) {
    try {
      const queryObject = DBQuery.GetCategoryWiseAssetsQuery(req)
      const result = await pool.query(queryObject)
      console.log('Result from get all assets categoriwise command on asset_master ', result.rows)
      if (result.rowCount === 0) {
        return { success: false, message: message.RECORD_NOT_FOUND }
      } else {
        return { success: true, data: result.rows }
      }
    } catch (error) {
      // logger.error(message.GET_ERROR, error)
      console.log('Error in getting categorywise asset details ', error)
      throw error
    }
  },

  /**
         * @description Function to get  asset's history  from the asset_history
         * @param  {} req
         */
  GetAssetHistory: async function (req) {
    try {
      const queryObject = DBQuery.GetAssetHistoryQuery(req)
      const result = await pool.query(queryObject)
      console.log('Result from get all assets history command on asset_master ', result.rows)
      if (result.rowCount === 0) {
        return { success: false, message: message.GET_ERROR }
      } else {
        return { success: true, data: result.rows }
      }
    } catch (error) {
      // logger.error(message.GET_ERROR, error)
      console.log('Error in asset history details ', error)
      throw error
    }
  },

  /**
         * @description Function to get  asset's details  from the asset_master
         * @param  {} req
         */
  GetAssetDetails: async function (req) {
    try {
      const queryObject = DBQuery.GetAssetDetailsQuery(req)
      const result = await pool.query(queryObject)
      console.log('Result from get all assets command on asset_master ', result.rows)
      if (result.rowCount === 0) {
        return { success: false, message: message.GET_ERROR }
      } else {
        return { success: true, data: result.rows[0] }
      }
    } catch (error) {
      // logger.error(message.GET_ERROR, error)
      console.log('Error in getting asset details ', error)
      throw error
    }
  },

  /**
     * @description Function to get asset status from the asset_status_type_master
     * @param  {} req
     */

  GetStatusType: async function () {
    try {
      const queryObject = DBQuery.GetStatusTypeQuery()
      const result = await pool.query(queryObject)
      if (result.rowCount === 0) {
        return { success: false, message: message.UPDATE_ERROR }
      } else {
        console.log('Result from the get status type command :', result.rows)
        return { success: true, data: result.rows }
      }
    } catch (error) {
      throw error
    }
  },

  /**
 * @description Function to get asset team type from the asset_team_master
 * @param  {} req
 */

  GetTeamType: async function () {
    try {
      const queryObject = DBQuery.GetTeamTypeQuery()
      const result = await pool.query(queryObject)
      if (result.rowCount === 0) {
        return { success: false, message: message.UPDATE_ERROR }
      } else {
        console.log('Result from the get team type command :', result.rows)
        return { success: true, data: result.rows }
      }
    } catch (error) {
      throw error
    }
  },

  /**
     * @description Function to update asset status in the asset_master
     * @param  {} req
     */

  GetCategoryType: async function () {
    try {
      const queryObject = DBQuery.GetCategoryTypeQuery()
      const result = await pool.query(queryObject)
      if (result.rowCount === 0) {
        return { success: false, message: message.UPDATE_ERROR }
      } else {
        console.log('Result from the get category type command :', result.rows)
        return { success: true, data: result.rows }
      }
    } catch (error) {
      throw error
    }
  },

  /**
     * @description Function to get vendor from the asset_vendor_master
     * @param  {} req
     */

  GetVendors: async function (req) {
    try {
      const queryObject = DBQuery.GetVendorQuery(req)
      var result = await pool.query(queryObject)
      if (result.rowCount === 0) {
        console.log('Result from the get vendor :', result.rows)
        return { success: false, message: message.GET_ERROR }
      } else {
        console.log('Result from the get category type command :', result.rows)
        return { success: true, data: result.rows }
      }
    } catch (error) {
      console.log('Error from the get vendor :', result.rows)
      throw error
    }
  },

  /**
    * @description Function to get budget from the asset_budget_master
    * @param  {} req
    */

  GetBudget: async function (req) {
    try {
      const queryObject = DBQuery.GetBudgetQuery(req)
      const result = await pool.query(queryObject)
      if (result.rowCount === 0) {
        console.log('Result from the get budget type command :', result.rows)
        return { success: false, message: message.GET_ERROR }
      } else {
        console.log('Result from the get budget command :', result.rows)
        return { success: true, data: result.rows }
      }
    } catch (error) {
      console.log('Error from the get budget command :', error)
      throw error
    }
  },

  /**
    * @description Function to register budget in the asset_budget_master
    * @param  {} req
    */

  RegisterBudget: async function (req) {
    try {
      const queryObject = DBQuery.InsertBudgetQuery(req)
      const result = await pool.query(queryObject)
      if (result.rowCount === 0) {
        return { success: false, message: message.INSERT_ERROR }
      } else {
        console.log('Result from the register budget command :', result.rows)
        return { success: true, data: result.rows }
      }
    } catch (error) {
      console.log('Error from the register budget command :', error)
      throw error
    }
  },

  /**
    * @description Function to update budget in the asset_budget_master
    * @param  {} req
    */

  UpdateBudget: async function (req) {
    try {
      const queryObject = DBQuery.UpdateBudgetQuery(req)
      const result = await pool.query(queryObject)
      if (result.rowCount === 0) {
        return { success: false, message: message.UPDATE_ERROR }
      } else {
        console.log('Result from the update budget command :', result.rows)
        return { success: true, data: result.rows }
      }
    } catch (error) {
      throw error
    }
  },

  /**
    * @description Function to register new vendor in the asset_vendor_master
    * @param  {} req
    */

  RegisterVendor: async function (req) {
    try {
      const queryObject = DBQuery.RegisterVendorQuery(req)
      const result = await pool.query(queryObject)
      console.log('Result from register vendor command on asset_vendor_master ', result)
      if (result.rowCount === 0) {
        return { success: false, message: message.GET_ERROR }
      } else {
        return { success: true, message: message.INSERT_SUCCESS, data: result.rows }
      }
    } catch (error) {
      if (error.code === '23503') {
        console.log('Error code when user_id is not found :', error.code)
        return { success: false, message: message.INVALID_EMPLOYEE_ID }
      }
      // logger.error(message.GET_ERROR, error)
      console.log('Error in registering new asset details ', error)
      throw error
    }
  },

  /**
    * @description Function to get  asset's details  from the asset_master
    * @param  {} req
    */
  GetEmployeeAssets: async function (req) {
    try {
      const queryObject = DBQuery.GetEmployeeAssetsQuery(req)
      const result = await pool.query(queryObject)
      console.log('Result from get employee assets command on asset_new_master ', result.rows)
      if (result.rowCount === 0) {
        return { success: false, message: message.GET_ERROR }
      } else {
        return { success: true, data: result.rows }
      }
    } catch (error) {
      // logger.error(message.GET_ERROR, error)
      console.log('Error in getting asset details ', error)
      throw error
    }
  },

  /**
    * @description Function to get  employees  from the user_master
    * @param  {} req
    */
  GetEmployees: async function () {
    try {
      const queryObject = DBQuery.GetEmployeesQuery()
      const result = await pool.query(queryObject)
      console.log('Result from get employees command on user_master ', result.rows)
      if (result.rowCount === 0) {
        return { success: false, message: message.GET_ERROR }
      } else {
        return { success: true, data: result.rows }
      }
    } catch (error) {
      // logger.error(message.GET_ERROR, error)
      console.log('Error in getting employees ', error)
      throw error
    }
  },

  /**
    * @description Function to get  employee's  issue data from the asset_master
    * @param  {} req
    */
  GetEmployeeIssueData: async function (req) {
    try {
      const queryObject = DBQuery.GetEmployeeIssueDataQuery(req)
      const result = await pool.query(queryObject)
      console.log('Result from get employee issue data query on asset_issue_master ', result.rows)
      if (result.rowCount === 0) {
        return { success: false, message: message.RECORD_NOT_FOUND }
      } else {
        return { success: true, data: result.rows }
      }
    } catch (error) {
      // logger.error(message.GET_ERROR, error)
      console.log('Error in getting asset details ', error)
      throw error
    }
  },

  /**
     * @description Function to get issue type from the asset_issue_type_master
     * @param  {} req
     */

  GetIssueType: async function () {
    try {
      const queryObject = DBQuery.GetIssueTypeQuery()
      const result = await pool.query(queryObject)
      if (result.rowCount === 0) {
        return { success: false, message: message.UPDATE_ERROR }
      } else {
        console.log('Result from the get status type command :', result.rows)
        return { success: true, data: result.rows }
      }
    } catch (error) {
      throw error
    }
  },

  /**
     * @description Function to report issue in the asset_issue_master
     * @param  {} req
     */

  ReportIssue: async function (req) {
    try {
      const queryObject = DBQuery.ReportIssueQuery(req)
      const result = await pool.query(queryObject)
      console.log('Result from report issue  command on asset_issue_master ', result)
      if (result.rowCount === 0) {
        return { success: false, message: message.INSERT_ERROR }
      } else {
        return { success: true, message: message.INSERT_SUCCESS, data: result.rows }
      }
    } catch (error) {
      if (error.code === '23503') {
        return { success: false, message: message.INVALID_EMPLOYEE_ID }
      }
      // logger.error(message.GET_ERROR, error)
      console.log('Error in reporting new issue ', error)
      throw error
    }
  },

  /**
     * @description Function to get pending issue count from the asset_issue_master
     * @param  {}
     */

  GetPendingIssueCount: async function () {
    try {
      const queryObject = DBQuery.GetPendingIssueAndRequestCountQuery()
      const result = await pool.query(queryObject)

      if (result.rowCount === 0) {
        return { success: false, message: message.GET_ERROR }
      } else {
        console.log('Result from the get pending issue count command :', result.rows[0])

        return { success: true, data: result.rows[0] }
        // console.log('issueMsg in the service funciton: ', issueMsg)
        // return { success: true, data: result.rows[0] }
      }
    } catch (error) {
      console.log('Error in getting pending issue count :', error)
      throw error
    }
  },

  /**
     * @description Function to get pending issue from the asset_issue_master
     * @param  {} req
     */

  GetPendingIssue: async function (req) {
    try {
      const queryObject = DBQuery.GetPendingIssueQuery(req)
      const result = await pool.query(queryObject)
      if (result.rowCount === 0) {
        return { success: false, message: message.RECORD_NOT_FOUND }
      } else {
        console.log('Result from the get pending issue command :', result.rows)
        return { success: true, data: result.rows }
      }
    } catch (error) {
      console.log('Error in getting pending issue :', error)
      throw error
    }
  },

  /**
     * @description Function to get pending issue from the asset_issue_master
     * @param  {} req
     */

  GetResolvedIssue: async function () {
    try {
      const queryObject = DBQuery.GetResolvedIssueQuery()
      const result = await pool.query(queryObject)
      if (result.rowCount === 0) {
        console.log('Result from the GetResolvedIssue :', result)
        return { success: true, data: [] }
      } else {
        console.log('Result from the get resolved issue command :', result.rows)
        return { success: true, data: result.rows }
      }
    } catch (error) {
      console.log('Error from the get resolved issue command :', error)
      throw error
    }
  },

  /**
     * @description Function to get issue details from the asset_issue_master
     * @param  {} req
     */
  GetIssueDetails: async function (req) {
    const issue_id = req
    try {
      const queryObject = DBQuery.GetIssueDetailsQuery(issue_id)
      const result = await pool.query(queryObject)
      if (result.rowCount === 0) {
        return { success: false, message: message.GET_ERROR }
      } else {
        console.log('Result from the get issue details command :', result.rows)
        return { success: true, data: result.rows }
      }
    } catch (error) {
      console.log('Error from get issue details command :', error)
      throw error
    }
  },

  /**
     * @description Function to get request details from the asset_issue_master
     * @param  {} req
     */
  GetRequestDetails: async function (req) {
    const requestId = req
    try {
      const queryObject = DBQuery.GetRequestDetailsQuery(requestId)
      const result = await pool.query(queryObject)
      if (result.rowCount === 0) {
        return { success: false, message: message.GET_ERROR }
      } else {
        console.log('Result from the get issue details command :', result.rows)
        return { success: true, data: result.rows }
      }
    } catch (error) {
      console.log('Error from get issue details command :', error)
      throw error
    }
  },

  /**
     * @description Function to get issue status type from the asset_issue_status_type_master
     * @param  {} req
     */
  GetIssueStatusType: async function () {
    try {
      const queryObject = DBQuery.GetIssueStatusTypeQuery()
      const result = await pool.query(queryObject)
      if (result.rowCount === 0) {
        return { success: false, message: message.GET_ERROR }
      } else {
        console.log('Result from the get issue status type command :', result.rows)
        return { success: true, data: result.rows }
      }
    } catch (error) {
      throw error
    }
  },

  /**
     * @description Function to get vendor data from the asset_vendor_master
     * @param  {} req
     */
  GetVendor: async function () {
    try {
      const queryObject = DBQuery.GetVendorQuery()
      const result = await pool.query(queryObject)
      if (result.rowCount === 0) {
        return { success: false, message: message.GET_ERROR }
      } else {
        console.log('Result from the get issue status type command :', result.rows)
        return { success: true, data: result.rows }
      }
    } catch (error) {
      throw error
    }
  },

  /**
     * @description Function to update asset status in the asset_master
     * @param  {} req
     */

  UpdateIssueStatus: async function (req) {
    try {
      const queryObject = DBQuery.UpdateIssueQuery(req)
      const result = await pool.query(queryObject)
      if (result.rowCount === 0) {
        return { success: false, message: message.UPDATE_ERROR }
      } else {
        console.log('Result from the update status command :', result.rows[0])
        return { success: true, data: result.rows }
      }
    } catch (error) {
      console.log('Error in updating asset details :', error)
      throw error
    }
  },

  /**
    * @description Function to get request new asset from the user_master
    * @param  {} req
    */
  GetNewAssetRequest: async function () {
    try {
      const queryObject = DBQuery.GetNewAssetRequestQuery()
      const result = await pool.query(queryObject)
      console.log('Result from get new asset request data from asset_request_master ', result.rows)
      if (result.rowCount === 0) {
        return { success: false, message: message.GET_ERROR }
      } else {
        return { success: true, data: result.rows }
      }
    } catch (error) {
      console.log('Error in getting new asset request ', error)
      throw error
    }
  },

  /**
     * @description Function to update request new asset status in the asset_master
     * @param  {} req
     */

  UpdateNewAssetRequest: async function (req) {
    try {
      const queryObject = DBQuery.UpdateNewAssetRequestQuery(req)
      const result = await pool.query(queryObject)
      if (result.rowCount === 0) {
        return { success: false, message: message.UPDATE_ERROR }
      } else {
        console.log('Result from the update new asset status command :', result.rows[0])
        return { success: true, data: result.rows }
      }
    } catch (error) {
      console.log('Error in updating new asset details :', error)
      throw error
    }
  },

  /**
    * @description Function to register new asset in the asset_request_master
    * @param  {} req
    */

  RequestNewAsset: async function (req) {
    try {
      const queryObject = DBQuery.RequestNewAssetQuery(req)
      const result = await pool.query(queryObject)
      console.log('Result from register new asset command on asset_request_master ', result)
      if (result.rowCount === 0) {
        return { success: false, message: message.INSERT_ERROR }
      } else {
        return { success: true, message: message.INSERT_SUCCESS, data: result.rows }
      }
    } catch (error) {
      if (error.code === '23503') {
        return { success: false, message: message.INVALID_EMPLOYEE_ID }
      }
      // logger.error(message.GET_ERROR, error)
      console.log('Error in registering new asset details ', error)
      throw error
    }
  },

  /**
         * @description Function to get all assets issues from the asset_issue_master
         * @param  {}
         */
  GetTotalAssetIssues: async function () {
    try {
      const queryObject = DBQuery.GetTotalAssetIssuesQuery()
      const result = await pool.query(queryObject)
      console.log('Result from get all assets issues command on asset_issues_master ', result.rows)
      if (result.rowCount === 0) {
        return { success: false, message: message.RECORD_NOT_FOUND }
      } else {
        return { success: true, data: result.rows }
      }
    } catch (error) {
      // logger.error(message.GET_ERROR, error)
      console.log('Error in getting assets issues  details ', error)
      throw error
    }
  },

  /**
         * @description Function to get all pending and reported assets issues from the asset_issue_master
         * @param  {}
         */
  GetTotalPendingIssues: async function () {
    try {
      const queryObject = DBQuery.GetTotalPendingIssuesQuery()
      const result = await pool.query(queryObject)
      console.log('Result from get all pending and reported assets issues command on asset_issues_master ', result.rows)
      if (result.rowCount === 0) {
        return { success: false, message: message.RECORD_NOT_FOUND }
      } else {
        return { success: true, data: result.rows }
      }
    } catch (error) {
      // logger.error(message.GET_ERROR, error)
      console.log('Error in getting pending and reported assets issues  details ', error)
      throw error
    }
  },

  /**
         * @description Function to get new assets categorywise request  from the asset_request_master
         * @param  {}
         */
  GetCategoryWiseAssetRequest: async function (req) {
    try {
      const queryObject = DBQuery.GetCategoryWiseAssetRequestQuery(req)
      const result = await pool.query(queryObject)
      console.log('Result from get all new assets categorywise command on asset_request_master ', result.rows)
      if (result.rowCount === 0) {
        return { success: false, message: message.RECORD_NOT_FOUND }
      } else {
        return { success: true, data: result.rows }
      }
    } catch (error) {
      // logger.error(message.GET_ERROR, error)
      console.log('Error in getting new assets categorywise details ', error)
      throw error
    }
  },

  /**
     * @description Function to get message from the rtaabitmq
     * @param  {} req
     */

  //   GetIssueMessage: async function () {
  //     const issueMsg = await consumeMessages()
  //     console.log('displaying data after await', issueMsg)
  //     const result = {}
  //     result.issueInformation = issueMsg
  //     // await closeConnection(connection,consumeChannel)
  //     // await new Promise((resolve) => setTimeout(resolve, 2000));

  //     return { success: true, data: result }
  //   },

}

// ------------------ Private Methods ----------------
// async function consumeMessages() {
//   const { connection } = await connect()
//   const consumeChannel = await connection.createChannel()
//   return new Promise((resolve, reject) => {
//     consumeChannel.consume(settings.queue, async (msg) => {
//       try {
//         if (msg !== null) {
//           console.log('Received:', msg.content.toString())
//           const issueInformation = msg.content.toString()
//           console.log('Information Received:', issueInformation)
//           // result.data.issueInformation = issueInformation;
//           // console.log('Result from asset service getPendingIssue:', result.data);
//           consumeChannel.ack(msg)

//           resolve(issueInformation) // Resolve the promise with issueInformation
//         } else {
//           resolve(null)
//         }
//       } catch (error) {
//         console.error('Error processing message:', error)
//         reject(error) // Reject the promise if there's an error
//       }
//     })
//   })
// }

// async function consumeMessages() {
//     try {
//         return new Promise((resolve, reject) => {
//             const receiver = rhea.open_receiver('amqp://localhost'); // Replace 'amqp://localhost' with your AMQP connection string

//             receiver.on('message', (context) => {
//                 console.log('Received:', context.message.body);
//                 resolve(context.message.body);
//             });

//             receiver.on('receiver_open', (context) => {
//                 console.log('Receiver open');
//             });

//             receiver.on('receiver_close', (context) => {
//                 console.log('Receiver close');
//                 resolve(null); // Resolve with null if no message is received
//             });

//             receiver.on('error', (context) => {
//                 console.error('Error consuming messages:', context.error);
//                 reject(context.error);
//             });
//         });
//     } catch (error) {
//         console.error('Error consuming messages:', error);
//         throw error;
//     }
// }

// const rhea = require('rhea');

// async function consumeMessages() {
//     try {
//         const receiver = await rhea.open_receiver('amqp://localhost'); // Replace 'amqp://localhost' with your AMQP connection string
//         return new Promise((resolve, reject) => {
//             receiver.on('message', (context) => {
//                 console.log('Received:', context.message.body);
//                 resolve(context.message.body); // Resolve the promise with the received message body
//             });
//             receiver.on('error', (error) => {
//                 reject(error); // Reject the promise if there's an error
//             });
//         });
//     } catch (error) {
//         console.error('Error consuming messages:', error);
//         throw error;
//     }
// }

//

// async function sendMessage() {
//     try {
//         const connectionInfo = await connectAndConsumeMessages('your_queue_name');
//         const sendMessage = connectionInfo.sendMessage;

//         // Send a message
//         await sendMessage('Hello, world!');
//     } catch (error) {
//         console.error('Error in example usage:', error);
//     }
// }
