
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

    // Error: Persontoken not set
    if (!personToken) {
        const error = {
            type : "no-persontoken",
            message : "No person token available"
        }
        callback(error);

        // TODO: error-first callback
    }
    // OK: Persontoken set
    else {
        console.log("Person token got: " + personToken);

        // Get user data from API
        const endpoint = "https://api.laji.fi/v0/person/" + personToken + "?access_token=" + secrets.accessTokenProd;
        request.get(
            { 
                url: endpoint
            },
            function(error, apiResponse, apiBodyJSON) {

                // Don't trust that reponse is valid JSON
                try {
                    apiBodyObject = JSON.parse(apiBodyJSON); 
                }
                catch (jsonParseError) {
                    apiBodyObject = undefined;
                }

                // Error: problem using the API
                // apiBodyObject === undefined  -> network error / api.laji.fi down
                // error                        -> error making request, e.g. error within require module(?)
                // body.error != undefined      -> api.laji.fi returns error, e.g. because of erroneus call
                if (apiBodyObject === undefined || error || apiBodyObject.error !== undefined) {
                    const error = {
                        type : "api-call-error",
                        message : "API call error with JSON response: " + apiBodyJSON
                    }            
                    callback(error);

                    // TODO: redirect to login OR return error, if person token expired
                }
                // OK: Valid user data from API
                else {
                    const lajifi = {};
                    lajifi.user = apiBodyObject;

                    if (plusCodes[lajifi.user.id] != undefined) {
                        lajifi.user.pluscode = plusCodes[lajifi.user.id];
                        
                        console.log("Calling callback with " + lajifi);
                        callback(null, lajifi);
                    }
                    // Error: Pluscode missing
                    else {
                        const error = {
                            type : "user-not-defined",
                            message : "No pluscode defined for user " + req.lajifi.user.id
                        }
                        callback(error);
                    }
                }
            }
        );
    }
}

const sendFile = function(fileId, personToken, callback) {
    console.log("FORSSA: " + fileId + ", personToken: " + personToken);
    callback(null, "FORSBY 2");
}

module.exports = {
    "log": log,
    "getUserData": getUserData,
    "sendFile": sendFile,
}