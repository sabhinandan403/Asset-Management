// Import required modules
var Express = require("express");
const router = require("./routes/indexRouter");
const BodyParser = require("body-parser");
const cors = require("cors");
const session = require('express-session');
const path = require('path');
const settings = require('./config/appConfig.js')
const messages = require('./message/message')
const multer = require('multer');
const upload = multer(); // Initialize multer


const fs = require('fs');
 

// Generate .env file content
const envContent = Object.entries(settings)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

// Check if .env file exists
if (!fs.existsSync('.env')) {
    // Write content to .env file
    fs.writeFileSync('.env', envContent);
} else {
    console.log('.env file already exists. Ignoring...');
}

// Create an instance of Express
var server = Express();
  
// Middleware to parse incoming JSON requests
server.use(BodyParser.json());
server.use(upload.none());

// Enable Cross-Origin Resource Sharing (CORS)
server.use(cors());
    
// Set up session middleware
server.use(session({
    secret: 'assetManagement', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));


// Set the view engine to Pug and specify the directory for views
server.set('view engine', 'pug');
// Serve static files from the 'public'  directory
server.use(Express.static(path.join(__dirname, '/public')));
server.use(Express.static(path.join(__dirname+ '/views')));

  
// Use the defined router for handling routes
server.use(router);
// Define the port to listen on, using environment variable
const Port = process.env.PORT || settings.SERVER_PORT;

// Start the server and listen on the specified port
server.listen(Port, () => {
    console.log(messages.SERVER_START, settings.SERVER_PORT);
});


/* USER_ROLE TYPE MAPPING
*  role_id             user_role
*    1                 employee
*    2                 admin
*/



