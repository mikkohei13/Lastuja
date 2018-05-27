
/*
MIDDLEWARE WRAPPER
*/

const lajifi_login = require('../lajifi_login');
//const db_models = require('../db_models');

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
    
    lajifi_login.getUserData(req.query.person_token, (lajifi) => {

        req.lajifi = lajifi;
        console.log("HERE:" + req.lajifi);

        // Error handling
        if (req.lajifi.error !== undefined) {
            console.log(req.lajifi.error.message);
            if (req.lajifi.error.type === "no-persontoken") {
                res.redirect("https://www.biomi.org/havistin/"); 
            }
            else {
                res.send(req.lajifi.error.message); 
            }
        }
        else{
            next();
        }
    
    });
}


module.exports = {
    "log": log,
    "getUserData": getUserData,
}