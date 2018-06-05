
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
        const endpoint = "https://api.laji.fi/v0/person/" + personToken + "?access_token=" + secrets.lajifiApiToken;
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

    const documentJSON = fs.readFileSync("../fetch/files_document_archive/" + fileId + ".json");
//    const documentJSON = fs.readFileSync("../fetch/files_document_archive/mytracks_20180217_070424.gpx.json"); // debug, NOTE .json suffix!

    // This expects the file to be already validated using the api. This may break if validation rules have changed since the file was first validated.

    const endpoint = `https://api.laji.fi/v0/documents?access_token=${secrets.lajifiApiToken}&personToken=${personToken}`;
    console.log("Endpoint: " + endpoint);
  
    // TODO: look into how request.post handles JSON vs. objects

    const postData = {
        url: endpoint,
        json: JSON.parse(documentJSON)
    };
    console.log(JSON.stringify(postData));
  
    // Request to validation API
    request.post(
        postData,
        (error, response, body) => {

            if (error) {
                // Generic error
                console.log("POSTing to APi failed with error: " + error);
                callback(error);
            }
            else if (undefined === body) {
                // Problem with reaching validator
                console.log("Error reaching " + endpoint);
                callback("Error reaching " + endpoint);
            }
            else if (body.error) {
                // Validation or save failed
                console.log("Error saving into laji.fi: " + JSON.stringify(body.error));
                callback("Error saving into laji.fi: " + JSON.stringify(body.error));
            }
            else {
                // Success
                console.log("Successfully saved into laji.fi");
                console.log(body);

                // Don't trust that reponse is valid JSON
                // TODO: What if api responds ok with unexpected JSON?
                callback(null, body);
/*
                try {
                    bodyObject = JSON.parse(body);
                    callback(null, bodyObject);
                }
                catch (jsonParseError) {
                    callback("Successfully saved, but API returned invalid response.");
                }
*/                
            }
        },
    );
}

module.exports = {
    "log": log,
    "getUserData": getUserData,
    "sendFile": sendFile,
}