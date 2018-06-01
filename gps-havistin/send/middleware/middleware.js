
/*
MIDDLEWARE WRAPPER
Business logic is in modules, this handles errors and uses the modules in correct order.
Data flows through in the req object.
*/

const lajifi_login = require('../lajifi_login');
const db_models = require('../db_models');

const request = require('request');
const fs = require('fs');


// -----------------------------------------------------------
// Setup


// -----------------------------------------------------------
// Functions
  
let log = function (req, res, next) {
    console.log(req.query);
    next()
}

// ??: if there is a problem, should the lajifi module handle it, or just return error type and let it be handled here?
// If the module should be generic, just return the error. 
const getUserData = function(req, res, next) {
    
    lajifi_login.getUserData(req.query.person_token, (error, lajifi) => {

        // Error handling
        if (error) {
            console.log(error.message);
            if (error.type === "no-persontoken") {
                res.redirect("https://www.biomi.org/havistin/"); 
            }
            else {
                res.send(error.message); 
            }
        }
        else{
            req.lajifi = lajifi;
            next();
        }
    
    });
}

const getUserFiles = function(req, res, next) {

    console.log("HERE X:" + JSON.stringify( req.lajifi ));

    // TODO: better variable names, e.g. lajifi -> userData, or can it contain other info also?

    let pluscode;
    pluscode = req.lajifi.user.pluscode;
    pluscode = "test"; // debug
    
    db_models.getUserFiles(pluscode, (error, ret) => {
        req.userFiles = ret;
        next();
    });

}


module.exports = {
    "log": log,
    "getUserData": getUserData,
    "getUserFiles": getUserFiles,
}