/**
 * Project Name : Asset Management System
 * @company YMSLI
 * @author  Abhinandan Kumar
 * @date    February 15, 2024
 * Copyright (c) 2024, Yamaha Motor Solutions (INDIA) Pvt Ltd.
 *
 * Module: License TCP Client
 * Description
 * -----------------------------------------------------------------------------------
 * Contains all the Middleware function.
 *
 * This module has following public functions:
 *
 *
 * 1. multer              - Function to configure multer middleware to upload quotation
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By              Modified On           Description
 * Abhinandan Kumar         February 15, 2024      Initially Created
 * -----------------------------------------------------------------------------------
 */


const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './resources');
    },
    filename: function (req, file, cb) {
        // Generate a unique filename using the current timestamp and a random number
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Ensure the file extension is preserved
        const ext = path.extname(file.originalname);
        cb(null, 'quotation-' + uniqueSuffix + ext);
    }
});

// const fileFilter = (req, file, cb) => {
//     // Check if the file's MIME type is PDF
//     if (file.mimetype === 'application/pdf') {
//         cb(null, true); // Accept the file
//     } else {
//         // Reject the file
//         cb(new Error('Only PDF files are allowed'), false);
//     }
// };

const upload = multer({
    storage:storage,
    // fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB limit
    }
}).single('uploadQuotation');


// Multer error handling middleware
const multerErrorHandling = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer error occurred
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'File size too large' });
        }
        // Handle other Multer errors as needed
    }
    // Forward to the next middleware if the error is not from Multer
    next(err);
};

module.exports = {upload};




