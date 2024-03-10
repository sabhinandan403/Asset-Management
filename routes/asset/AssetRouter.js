/**
 * Project Name : Asset Management System 
 * @company YMSLI
 * @author  Abhinandan Kumar
 * @date    30 Jan 2024
 * Copyright (c) 2024, Yamaha Motor Solutions (INDIA) Pvt Ltd.
 * 
 * Module : Login
 * Description
 * ----------------------------------------------------------------------------------- 
 * Routes to login and logout of the application
 * 
 * This module has following routes:
 * 1. registerasset {POST}             - To add new asset
 * 2. getallassets {GET}               - To get all asset details from database
 * 3. updateassetstatus{PUT}           - To update asset status 
 * 4. deleteproduct                    - To delete product
 * -----------------------------------------------------------------------------------
 * 
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By               Modified On         Description
 * Abhinandan Kumar          30 Jan 2024         Initially Created & added routes
 * -----------------------------------------------------------------------------------
 */

const express = require('express');
const assetService = require('../../service/asset/AssetService')
const router = express.Router();
const { authorize } = require('../../middleware/authorizeMiddleware')
//const settings = require('../../config/appConfig');
const message = require('../../message/message')
//const {upload} = require('../../middleware/multerMiddleware')




/**
 * @description To register new asset
 * @param  {} req
 * @param  {} res
 */
router.post('/registerAsset', authorize, async (req, res) => {
    //if data packet is empty
    if (!req.body) {
        return res.status(404).json({ success: false, message: message.REQUEST_DATA_NOT_FOUND });
    }

    //To add new product details
    try {
        var result = await assetService.RegisterAsset(req.body)
        if (result.success) {
            res.status(201).json({ success: true, message: message.INSERT_SUCCESS })
        }
        else {
            if (result.message === message.INVALID_EMPLOYEE_ID) {
                res.status(400).json({ success: false, message: message.INVALID_EMPLOYEE_ID })
            } else {
                res.status(401).json({ success: false, message: message.INSERT_ERROR })
            }
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }

})

/**
 * @description To update asset details
 * @param  {} req
 * @param  {} res
 */

router.put('/updateAsset', authorize, async (req, res) => {
    //if data packet is empty
    if (!req.body) {
        return res.status(404).json({ success: false, message: message.REQUEST_DATA_NOT_FOUND });
    }

    //To get product details
    try {
        var result = await assetService.UpdateAsset(req.body)
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(200).json({ success: false, data: [] })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }

})

/**
 * @description To get asset count information        
 * @param  {} req
 * @param  {} res
 */
router.get('/getAssetCount', authorize, async (req, res) => {

    //To update product details
    try {
        var result = await assetService.GetAssetCount()
        if (result.success) {
            res.status(201).json({ success: true, data: result.data, message: message.STATUS_SUCCESS })
        }
        else {
            res.status(401).json({ success: false, message: message.STATUS_FAILED })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }

})

/**
 * @description To get all asssets from asset_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getAllAssets', authorize, async (req, res) => {

    try {
        var result = await assetService.GetAllAssets(req.body)
        if (result.success) {
            res.status(201).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To get allocated assets from asset_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getAllocatedAssets', async (req, res) => {

    //To delete product
    try {
        var result = await assetService.GetAllocatedAssets()
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To get unallocated assets from asset_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getUnallocatedAssets', async (req, res) => {


    try {
        var result = await assetService.GetUnallocatedAssets()
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To get assets teamwise from asset_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getTeamwiseAssets/:team', async (req, res) => {
    var { team } = req.params

    try {
        var result = await assetService.GetTeamWiseAssets(team)
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To get asset's history from asset_history
 * @param  {} req
 * @param  {} res
 */
router.get('/getAssetHistory/:asset_id', async (req, res) => {
    var asset_id = req.params.asset_id

    try {
        var result = await assetService.GetAssetHistory(asset_id)
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})
/**
 * @description To get assets teamwise from asset_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getCategorywiseAssets/:category', async (req, res) => {
    var { category } = req.params

    try {
        var result = await assetService.GetCategoryWiseAssets(category)
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To get asset's details from asset_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getAssetDetails/:asset_id', async (req, res) => {
    var asset_id = req.params.asset_id

    try {
        var result = await assetService.GetAssetDetails(asset_id)
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To get assets status type from asset_type_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getStatusType', async (req, res) => {


    try {
        var result = await assetService.GetStatusType()
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})


/**
 * @description To get assets team type from asset_team_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getTeamType', async (req, res) => {


    try {
        var result = await assetService.GetTeamType()
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To get assets category type from asset_category_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getCategoryType', async (req, res) => {


    try {
        var result = await assetService.GetCategoryType()
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To get assets vendor from asset_vendor_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getVendors/:asset_category', async (req, res) => {
    var asset_category = req.params.asset_category

    try {
        var result = await assetService.GetVendors(asset_category)
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})



/**
 * @description To register new vendor
 * @param  {} req
 * @param  {} res
 */
router.post('/registerVendor', async (req, res) => {

    if (!req.body) {
        return res.status(404).json({ success: false, message: message.REQUEST_DATA_NOT_FOUND });
    }

    try {
       
        // Construct the object with metadata and byte array
        const vendorData = {
            pricePerUnit: req.body.assetPricePerUnit,
            user_id: req.body.user_id,
            assetCategory: req.body.assetCategory,
            vendorContactNumber: req.body.vendorContactNumber,
            vendorName: req.body.vendorName,
            vendorEmail: req.body.vendorEmail,
            vendorAddress: req.body.vendorAddress,

        };

        // Call service layer function to register the vendor
        const result = await assetService.RegisterVendor(vendorData);
        // Handle response from service layer
        if (result.success) {
            console.log('Result after add vendor query :', result.rows)
            res.status(200).json({ success: true, message: message.INSERT_SUCCESS });
        } else {
            if(result.message === message.INVALID_EMPLOYEE_ID) {
                res.status(404).json({success:true , data:[]})
            }
            // Handle failure
            res.status(400).json({ success: false, message: message.INSERT_ERROR });
        }
    } catch (error) {
        // Handle internal server error
        console.error("Error registering vendor:", error);
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR });
        
    }

});


/**
 * @description To get employee's asset details from asset_new_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getEmployeeAssets/:userId', async (req, res) => {
    var user_id = req.params.userId

    try {
        var result = await assetService.GetEmployeeAssets(user_id)
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To get budget from asset_budget_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getBudget', async (req, res) => {

    try {
        var result = await assetService.GetBudget()
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To get register new budget in the asset_budget_master
 * @param  {} req
 * @param  {} res
 */
router.post('/registerBudget', async (req, res) => {
    //if data packet is empty
    if (!req.body) {
        return res.status(404).json({ success: false, message: message.REQUEST_DATA_NOT_FOUND });
    }

    try {
        var result = await assetService.RegisterBudget(req.body)
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.INSERT_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To get update  budget in the asset_budget_master
 * @param  {} req
 * @param  {} res
 */
router.put('/updateBudget', async (req, res) => {
    //if data packet is empty
    if (!req.body) {
        return res.status(404).json({ success: false, message: message.REQUEST_DATA_NOT_FOUND });
    }

    try {
        var result = await assetService.UpdateBudget(req.body)
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.UPDATE_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})



/**
 * @description To get employees from user_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getEmployees', async (req, res) => {
    var user_name = req.params.username

    try {
        var result = await assetService.GetEmployees()
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})



/**
 * @description To get employee's issue data from asset_issue_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getEmployeeIssueData/:userId', async (req, res) => {
    var user_id = req.params.userId

    try {
        var result = await assetService.GetEmployeeIssueData(user_id)
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            if (result.message === message.RECORD_NOT_FOUND) {
                res.status(200).json({ success: false, data: [] })
            } else {
                res.status(404).json({ success: false, message: message.GET_ERROR })
            }
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})


/**
 * @description To get assets issue type from asset_issue_type_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getIssueType', async (req, res) => {


    try {
        var result = await assetService.GetIssueType()
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To report issue
 * @param  {} req
 * @param  {} res
 */
router.post('/reportIssue', async (req, res) => {
    //if data packet is empty
    if (!req.body) {
        return res.status(404).json({ success: false, message: message.REQUEST_DATA_NOT_FOUND });
    }

    //To add new product details
    try {
        var result = await assetService.ReportIssue(req.body)
        if (result.success) {
            res.status(201).json({ success: true, message: message.INSERT_SUCCESS })
        }
        else {

            res.status(401).json({ success: false, message: message.INSERT_ERROR })

        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }

})

/**
 * @description To get pending issues count from asset_issue_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getPendingIssueCount', async (req, res) => {


    try {
        var result = await assetService.GetPendingIssueCount()
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To get pending issues from asset_issue_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getPendingIssue/:issue_type', async (req, res) => {

    var issue_type = req.params.issue_type
    try {
        var result = await assetService.GetPendingIssue(issue_type)
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            if (message.RECORD_NOT_FOUND == result.message) {
                res.status(200).json({ success: true, data: [] })
            } else {
                res.status(401).json({ success: false, message: message.GET_ERROR })
            }
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To get resolved issues from asset_issue_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getResolvedIssue', async (req, res) => {


    try {
        var result = await assetService.GetResolvedIssue()
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})


/**
 * @description To get issue details from asset_issue_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getIssueDetails/:issueId', async (req, res) => {
    var issue_id = req.params.issueId

    try {
        var result = await assetService.GetIssueDetails(issue_id)
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To get assets issue status type from asset_type_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getIssueStatus', async (req, res) => {


    try {
        var result = await assetService.GetIssueStatusType()
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})


/**
 * @description To get vendor from asset_vendor _master
 * @param  {} req
 * @param  {} res
 */
router.get('/getVendor', async (req, res) => {


    try {
        var result = await assetService.GetVendor()
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To update issue details
 * @param  {} req
 * @param  {} res
 */

router.put('/updateIssueStatus', async (req, res) => {
    //if data packet is empty
    if (!req.body) {
        return res.status(404).json({ success: false, message: message.REQUEST_DATA_NOT_FOUND });
    }

    //To get product details
    try {
        var result = await assetService.UpdateIssueStatus(req.body)
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(400).json({ success: false, data: [] })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }

})

/**
 * @description To update issue details
 * @param  {} req
 * @param  {} res
 */

router.post('/requestNewAsset', async (req, res) => {
    //if data packet is empty
    if (!req.body) {
        return res.status(404).json({ success: false, message: message.REQUEST_DATA_NOT_FOUND });
    }

    //To get product details
    try {
        var result = await assetService.RequestNewAsset(req.body)
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(400).json({ success: false, data: [] })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }

})

/**
 * @description To get new asset request from asset_request_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getNewAssetRequest', async (req, res) => {


    try {
        var result = await assetService.GetNewAssetRequest()
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To update new asset request from asset_request_master
 * @param  {} req
 * @param  {} res
 */
router.put('/updateNewAssetRequest', async (req, res) => {
    //if data packet is empty
    if (!req.body) {
        return res.status(404).json({ success: false, message: message.REQUEST_DATA_NOT_FOUND });
    }

    try {
        var result = await assetService.UpdateNewAssetRequest(req.body)
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To get request details from asset_request_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getRequestDetails/:issueId', async (req, res) => {
    var requestId = req.params.issueId

    try {
        var result = await assetService.GetRequestDetails(requestId)
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To get total assets issues from asset_issue_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getTotalAssetIssues/', async (req, res) => {
   

    try {
        var result = await assetService.GetTotalAssetIssues()
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})


/**
 * @description To get total pending and reported issues from asset_issue_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getTotalPendingIssues/', async (req, res) => {
    

    try {
        var result = await assetService.GetTotalPendingIssues()
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})

/**
 * @description To get total pending and reported issues from asset_issue_master
 * @param  {} req
 * @param  {} res
 */
router.get('/getCategoryWiseAssetrequest/:category', async (req, res) => {
    let category = req.params.category;

    try {
        var result = await assetService.GetCategoryWiseAssetRequest(category)
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        }
        else {
            res.status(401).json({ success: false, message: message.GET_ERROR })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: message.INTERNAL_SERVER_ERROR })
    }
})




module.exports = router