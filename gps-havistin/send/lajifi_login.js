
/*
person_token = token = käyttäjän väliaikainen token
access_token = kehittäjän token
*/

// todo: inject these
const secrets = require('./secrets');

const request = require('request');
const fs = require('fs');


// -----------------------------------------------------------
// Setup


const plusCodes = secrets.plusCodes;
/*
{
    "MA.3" : "cehmic",
    "MA.0" : "testtest"
}
*/

// -----------------------------------------------------------
// Functions
  

let log = function (req, res, next) {
    console.log(req.query);
    next()
}

const getUserData = function(personToken, callback) {
    const lajifi = {};

    // Check if person token set
    if (!personToken) {
        lajifi.error = {
            type : "no-persontoken",
            message : "No person token available"
        }
        callback(lajifi);

        // TODO: error-first callback
    }
    else {
        console.log("Person token got: " + personToken);
        // Get user data
        const endpoint = "https://api.laji.fi/v0/person/" + personToken + "?access_token=" + secrets.accessTokenProd;
        request.get(
            { 
                url: endpoint
            },
            function(error, apiResponse, apiBodyJSON) {
                apiBodyObject = JSON.parse(apiBodyJSON); 

                // If some kind of error
                // undefined = body         -> network error / api.laji.fi down
                // error                    -> error with require module(?)
                // body.error != undefined  -> api.laji.fi returns error, e.g. because of erroneus call
                if (undefined == apiBodyObject || error || apiBodyObject.error != undefined) {
                    lajifi.error = {
                        type : "api-call-error",
                        message : error + " / " + apiBodyJSON
                    }            
                    // TODO: redirect to login OR return error, if person token expired
                }
                else {
                    lajifi.user = apiBodyObject;
                    if (plusCodes[lajifi.user.id] != undefined) {
                        lajifi.user.pluscode = plusCodes[lajifi.user.id];
                    }
                    else {
                        lajifi.error = {
                            type : "user-not-defined",
                            message : "No pluscode defined for user " + req.lajifi.user.id
                        }            
                    }
                }
                console.log("Calling callback with " + lajifi);
                callback(lajifi);
            }
        );
    }
}


module.exports = {
    "log": log,
    "getUserData": getUserData,
}