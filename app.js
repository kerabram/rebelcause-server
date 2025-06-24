require("dotenv").config();
require("./config/connection");
require("./config/authStrategy");


//initialize express environment
const express = require("express");
//allow the app to use the express package
const app = express();
//define a port number for the server to listen for a connection.
const PORT = process.env.PORT || 3000; 

//---------Middleware----------
//cors
const cors = require("cors");

//morgan
const morgan = require("morgan");

//NEW: add the path module
const path = require("node:path");

const helmet = require("helmet"); //make sure you have helmet from this classwork on

const session = require("express-session");
const passport = require("passport");

//Define the routing variable for
const protestsubmitRoutes = require('./routes/protestsubmitRoutes')
const authRoutes = require('./routes/authRoutes')


app.use(cors());
app.use(morgan("dev"));
//combined - show a log that is more comprehensive
//dev - show simpler information

//Tell the app to use express to bundle all of the files within the public directory
app.use(express.static(path.join(__dirname + "/public")));

//Tell the app to use express and JSON to read data
app.use(express.json());

//Tell the app to use express and urlencoded to scramble form information and set to true.
app.use(express.urlencoded({extended: true}));

//end Middleware
app.use(
  session({
    resave: false,
    saveUninitialized: false, // saveUninitialized is false because we do not want to create a session in every call
    secret: process.env.SECRET_KEY,

    // We include cookie in our sessions
    cookie: {
      httpOnly: true, // httpOnly true because of security
      secure: false, // secure is false in development, true in production
      maxAge: 1000 * 60 * 60 * 24, //this is the length the session should last, aka 24 hours or one day.
    },
  })
);

//----- PER 2:  PASSPORT INITIALIZATION ------
app.use(passport.initialize());
// passport.session below will take care of creating a session on calls that require passport authentication
app.use(passport.session());


const siteData = require('./data/siteData');
app.get("/", (request, response, next) => {
  response.status(200).json({success: {message: "This route points to the Home page"}, data: siteData , statusCode: 200});
});

app.get("/admin", (req, res, next) => {
    //res.send("This route points to the Admin Console page");
    res.status(200).json({
        success: {message: "This route points to the Admin Console page"},
        //key of data and a value of an object that has isSignedIn as the parameter.
        data: {
            isSignedIn: isSignedIn
        },
        statusCode: 200
    });
});

//Tell the app to use the routing variables you defined earlier, booksRoutes and authorsRoutes
// app.use("/api/books", booksRoutes);
app.use("/auth", authRoutes);
app.use("/api/protestsubmit", protestsubmitRoutes);

//--- PER 1 UPGRADE: ERR HANDLING CODE  ---
app.use((error, request, response, next) => {
    //Our condition should be if MongoDB detects the error code 11000, we need to flag the user as a duplicate
    let condition = error.code === 11000

    //PER 1: Refactor status handling with variables 
    const authErrStatus = error.status || 400;
    const serverErrStatus = error.status || 500;

    if (condition) {
        //Refactor status handling with variables 
      return response.status(authErrStatus).json({
        error: {message: "Error detected!!!"},
        statusCode: authErrStatus,
        })
    } else {
        //console.log that account check passed
        console.log("We passed the error handling middleware, you're good to go")
    }

    //Any other errors are caught
    //Refactor status handling with variables 
    return response.status(serverErrStatus).json({
      error: {message: error.message || "Internal server error, oh no!"},
      statusCode: serverErrStatus
    })
    //UNREACHABLE

//have the app listen at the PORT where a console.log says `Server is listening on ${PORT}. Connection established.`
app.listen(PORT, () => { //http://localhost:3000
    console.log( Rebel Cause server is listening on port http://localhost:${PORT}. Connection established.`);
});

//Upgrade ALL routes
//Skeleton: 
// app.get("", (req, res, next) => {
//   res.status().json({
//     success: {}, //the str that registers when we get an OK response
//     data: {},   //the data that should render within this object
//     statusCode:  //this should be a number
//   });
// });

//Use the question against itself!!!

//Refactor home

//Refactor admin

//Refactor books

//Refactor books/id

//--------- ^PREVIOUS CLASSWORK^ -------------
//START HERE: 
/*
Node.js server Review

With the same five basic ROUTES you just made, comment out the .send() method

REFACTOR the handler from .send() to .status().json with a success message and the statusCode
*/
//--------- PER 2: CW: Dynamic Node Review ------------
/*
Create 4 NEW GET routes that send a request, receive a response, and move to the next block of code w/ .status().json and a success message :
PATH: /books/create, HANDLER:"This route points to the Create Book page”
PATH: /books/:_id, HANDLER: "This route points to the specific book via the ID”
PATH: /authors/create, HANDLER: "This route points to the Create Author page”
PATH: /authors/:_id, HANDLER: "This route points to the specific author via the ID”
*/  ``