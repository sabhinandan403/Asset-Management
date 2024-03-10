/**
 * Project Name : Inventory Management System 
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
 * 1. / {GET}                      - To get login screen
 * 2. /signup  {GET}               - To get register screen
 * 3. /register {POST}             - To register user details
 * 4. /validate {POST}             - To check user credentials when logging in
 * 5. /logout                      - To redirect to home page if session exists
 * 6. /home {GET}                  - To show admin dashboard
 * -----------------------------------------------------------------------------------
 * 
 * Revision History
 * ---------------request objectuest object-----------------------------------------------------------------
 * Modified By               Modified On         Description
 * Abhinandan Kumar          30 Jan 2024         Initially Created & added routes
 * -----------------------------------------------------------------------------------
 */
var express = require('express');
var path = require('path')
var adminService = require('../../service/admin/AdminService')
var router = express.Router();
const jwtMiddleware = require('../../middleware/jwtMiddleware');
const { authorize } = require('../../middleware/authorizeMiddleware')
const message = require('../../message/message');


/**
 * @description To show login screen
 * @param  {} req
 * @param  {} response
 */
router.get('/', (req, res) => {
    //res.sendFile(path.join(__dirname, '../../views/login.html'));
    res.render('login')

})

/**
 * @description To show login screen
 * @param  {} req
 * @param  {} response
 */
router.get('/adminPortal', (req, res) => {
    //res.sendFile(path.join(__dirname, '../../views/newDashboard.html'));
    res.render('adminPortal')

})

/**
 * @description To show asset history screen
 * @param  {} req
 * @param  {} response
 */
router.get('/assetHistory', (req, res) => {
    //res.sendFile(path.join(__dirname, '../../views/assetHistory.html'));
    res.render('assetHistory')

})



/**
 * @description To show track issues page
 * @param  {} req
 * @param  {} response
 */
router.get('/trackIssues', (req, res) => {
    //res.sendFile(path.join(__dirname, '../../views/trackIssues.html'));
    res.render('newTrackIssues')

})

/**
 * @description To show add vendor page
 * @param  {} req
 * @param  {} response
 */
router.get('/addVendor', (req, res) => {
    //res.sendFile(path.join(__dirname, '../../views/addVendor.html'));
    res.render('addVendor')

})

/**
 * @description To show add quotations page
 * @param  {} req
 * @param  {} response
 */
router.get('/addQuotation', (req, res) => {
    //res.sendFile(path.join(__dirname, '../../views/addVendor.html'));
    res.render('addQuotation')

})

/**
 * @description To show add quotations page
 * @param  {} req
 * @param  {} response
 */
router.get('/getVendorDetails', async (req, res) => {
    //res.sendFile(path.join(__dirname, '../../views/addVendor.html'));
    try {
        var result = await adminService.GetVendorDetails();
        if (result.success) {
            //res.redirect('http:/localhost:3000/login')
            if (result.message === message.USER_ALREADY_EXISTS) {
                return res.status(409).json({ success: true, message: message.USER_ALREADY_EXISTS })
            } else {
                res.status(200).json({ success: true, data: result.data })
            };
        } else {
            return res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.log("Error in connecting with the database ", error);
        res.status(500).json({ success: false, message: message.GET_ERROR });
    }

})


/**
 * @description To show register User screen
 * @param  {} req
 * @param  {} response
 */

router.get('/addUser', authorize, (req, res) => {
    // console.log(req.session)
    // console.log(req)
    const regex = /username=([^&]+)&email=([^&]+)&userRole=([^&]+)/;
    const match = req.originalUrl.match(regex);
    console.log(req.originalUrl)
    if (match) {
        // Reload the previous page by redirecting to the referer
        //res.redirect('back');
        return;
    }

    //res.sendFile(path.join(__dirname, '../../views/registerUser.html'))
    res.render('registerUser')
});

/**
 * @description To show dashboard screen
 * @param  {} req
 * @param  {} response
 */

router.get('/dashboard', authorize, (req, res) => {
    //res.sendFile(path.join(__dirname, '../../views/dashboard.html'))
    res.render('dashboard')
});

/**
 * @description To show issues details screen
 * @param  {} req
 * @param  {} response
 */

router.get('/pendingIssueDetails', authorize, (req, res) => {
    res.render('pendingIssues')
    //res.sendFile(path.join(__dirname, '../../views/pendingIssues.html'))
});

/**
 * @description To show views button's issue details screen
 * @param  {} req
 * @param  {} response
 */

router.get('/issueDetails', authorize, (req, res) => {
    res.render('issueDetails')
    //res.sendFile(path.join(__dirname, '../../views/pendingIssues.html'))
});



/**
 * @description To show dashboard screen
 * @param  {} req
 * @param  {} response
 */

router.get('/assetDetails', authorize, (req, res) => {
    //res.sendFile(path.join(__dirname, '../../views/assetdata.html'))
    res.render('assetDetails')
});


/**
 * @description To show employee portal screen
 * @param  {} req
 * @param  {} response
 */

router.get('/employeePortal', authorize, (req, res) => {
    //res.sendFile(path.join(__dirname, '../../views/employeePortal.html'))
    res.render('employeePortal')
});


/**
 * @description To register user for asset management system
 * @param  {} req
 * @param  {} response
 */
router.post('/registerUser', async (req, res) => {
    //if data packet is empty
    if (!req.body) {
        return res.status(403).json({ success: false, message: message.REQUEST_DATA_NOT_FOUND });
    }
    try {
        var result = await adminService.RegisterUser(req.body);
        if (result.success) {
            //res.redirect('http:/localhost:3000/login')
            if (result.message === message.USER_ALREADY_EXISTS) {
                return res.status(409).json({ success: true, message: message.USER_ALREADY_EXISTS })
            } else {
                res.status(200).json({ success: true, data: result.data })
            };
        } else {
            return res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.log("Error in connecting with the database ", error);
        res.status(500).json({ success: false, message: message.GET_ERROR });
    }
});

/**
 * @description To validate the user if it exists
 * @param  {} jwtMiddleware
 * @param  {} req
 * @param  {} response
 * @param  {} next
 */
router.post('/validate', jwtMiddleware, async (req, res) => {
    var userdata = req.body;

    try {
        var result = await adminService.ValidateUser(userdata);
        if (result.success) {
            //Store jwt token in the session when user exists
            req.session.token = res.locals.token
            res.status(200).json({ success: true, data: result.data, token: res.locals.token });
        } else if (result.message === message.USER_UNAUTHORIZED) {
            res.status(401).json({ success: false, message: result.message })
        }
        else {
            res.status(401).json({ success: false, data: result.data, message: message.INCORRECT_PASSWORD });
        }
    } catch (error) {
        console.log("Error in connecting with the database ", error);
        res.status(500).json({ success: false, message: message.GET_ERROR });
    }
});

/**
 * @description To destroy session and redirect to login page
 * @param  {} req
 * @param  {} response
 */

router.get('/logout', authorize, (req, res) => {
    // Delete the token from req.session.token
    req.session.token = null; // or use delete req.session.token;

    // Optionally, you can destroy the entire session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        // Set cache control headers to prevent caching
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        // Redirect or respond as needed
        res.redirect('/');
    })
});


/**
 * @description To get user types from database for login page
 * @param  {} req
 * @param  {} response
 */

router.get('/getUserType', authorize, async (req, res) => {

    try {
        var result = await adminService.GetUserType();
        if (result.success) {
            res.status(200).json({ success: true, data: result.data });
        }
        else {
            res.status(400).json({ success: false, message: message.GET_ERROR });
        }
    } catch (error) {
        console.log("Error in connecting with the database ", error);
        res.status(500).json({ success: false, message: message.GET_ERROR });
    }
});


/**
 * @description To get user teams from database for login page
 * @param  {} req
 * @param  {} response
 */

router.get('/getTeam', authorize, async (req, res) => {

    try {
        var result = await adminService.GetTeam();
        if (result.success) {
            res.status(200).json({ success: true, data: result.data });
        }
        else {
            res.status(400).json({ success: false, message: message.GET_ERROR });
        }
    } catch (error) {
        console.log("Error in connecting with the database ", error);
        res.status(500).json({ success: false, message: message.GET_ERROR });
    }
});

/**
 * @description To insert quotation details of user in the asset_vendor_master
 * @param  {} req
 * @param  {} response
 */
router.put('/insertQuotationDetails', async (req, res) => {
    //if data packet is empty
    if (!req.body) {
        return res.status(403).json({ success: false, message: message.REQUEST_DATA_NOT_FOUND });
    }
    try {
        var result = await adminService.InsertQuotationDetails(req.body);
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        } else {
            return res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.log("Error in inserting quotation details in thedatabase ", error);
        res.status(500).json({ success: false, message: message.INSERT_ERROR });
    }
});

/**
 * @description To shoe vendor and uploaded quotation details screen
 * @param  {} req
 * @param  {} response
 */

router.get('/quotationDetails', authorize, async (req, res) => {

    res.render('quotationDetails')
});

/**
 * @description To get quotation details of vendor from the asset_vendor_master
 * @param  {} req
 * @param  {} response
 */
router.get('/getQuotationDetails/:vendorId', async (req, res) => {
    let vendorId = req.params.vendorId;
    try {
        var result = await adminService.GetQuotationDetails(vendorId);
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        } else {
            return res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.log("Error in fetching quotation details from the database ", error);
        res.status(500).json({ success: false, message: message.GET_ERROR });
    }
});

/**
 * @description To get quotation details of vendor from the asset_vendor_master
 * @param  {} req
 * @param  {} response
 */
router.put('/updateQuotationDetails', async (req, res) => {

    //if data packet is empty
    if (!req.body) {
        return res.status(403).json({ success: false, message: message.REQUEST_DATA_NOT_FOUND });
    }

    try {
        var result = await adminService.UpdateQuotationDetails(req.body);
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        } else {
            return res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.log("Error in fetching quotation details from the database ", error);
        res.status(500).json({ success: false, message: message.GET_ERROR });
    }
});

/**
 * @description To get vendor details for update modal
 * @param  {} req
 * @param  {} response
 */
router.get('/getVendorDetails/:vendorId', async (req, res) => {
    let vendorId = req.params.vendorId;
    try {
        var result = await adminService.GetVendorDetailsForUpdate(vendorId);
        if (result.success) {
            //res.redirect('http:/localhost:3000/login')
            if (result.message === message.USER_ALREADY_EXISTS) {
                return res.status(409).json({ success: true, message: message.USER_ALREADY_EXISTS })
            } else {
                res.status(200).json({ success: true, data: result.data })
            };
        } else {
            return res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.log("Error in connecting with the database ", error);
        res.status(500).json({ success: false, message: message.GET_ERROR });
    }



})

/**
 * @description To udpate vendor details of vendor in the asset_vendor_master
 * @param  {} req
 * @param  {} response
 */
router.put('/updateVendorDetails', async (req, res) => {
    //if data packet is empty
    if (!req.body) {
        return res.status(403).json({ success: false, message: message.REQUEST_DATA_NOT_FOUND });
    }
    try {
        var result = await adminService.UpdateVendorDetails(req.body);
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        } else {
            return res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.log("Error in updating vendor details in thedatabase ", error);
        res.status(500).json({ success: false, message: message.UPDATE_ERROR });
    }
});




module.exports = router;