/**
 * Project Name : Inventory Management System
 * @company YMSLI
 * @author  Abhinandan Kumar
 * @date    Jan 30th, 2024
 * Copyright (c) 2024, Yamaha Motor Solutions (INDIA) Pvt Ltd.
 * 
 * Module : IndexRouter
 * Description
 * ----------------------------------------------------------------------------------- 
 * Module Containing all routes containing APIs of InventoryManagementServer
 * 
 * -----------------------------------------------------------------------------------
 * 
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By             Modified On          Description
 * Abhinandan Kumar        30 Jan 2024          Initially Created
 * -----------------------------------------------------------------------------------
 */
// Module Dependencies
var Express = require("express")
var router = Express.Router()
var AdminRouter = require('./admin/AdminRouter')
var AssetRouter = require('./asset/AssetRouter')


router.use('/',AdminRouter)
router.use('/asset',AssetRouter)


module.exports = router