
/*
person_token = token = käyttäjän väliaikainen token
access_token = kehittäjän token
*/

const secrets = require('../secrets');
const request = require('request');
const fs = require('fs');

let log = function (req, res, next) {
    console.log(req.query);
    next()
}

const plusCodes = {
    "MA.3" : "cehmic",
    "MA.0" : "testtest"
}

const getUserData = function(req, res, next) {
    const personToken = req.query.person_token;

    // Check if person token set
    if (!personToken) {
        console.log("No person token, redirecting...");
        res.redirect("https://www.biomi.org/havistin/");    
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
                    res.send("Error: " + error + "\n" + apiBodyJSON);

                    // TODO: redirect to login, if person token expired
                }
                else {
                    req.lajifi = {};
                    req.lajifi.user = apiBodyObject;
                    if (plusCodes[req.lajifi.user.id] != undefined) {
                        req.lajifi.user.pluscode = plusCodes[req.lajifi.user.id];
                    }
                    else {
                        res.send("Error: no pluscode defined for user " + req.lajifi.user.id);
                    }

                    console.log(req.lajifi.user);
                }
                next();
            }
        );
    }
}

const getUserFiles = function getUserFiles(req, res, next) {
    let basePath = "../../gps-havistin/fetch/";
    let files = fs.readdirSync(basePath + "files_document/"); // TODO: better relative path?

    // Filter by user's pluscode
    const userFiles = files.filter((filename) => {
        let filenameParts = filename.split("_");
        return (plusCodes[req.lajifi.user.id] === filenameParts[0]);
    });

    // Filter by unsent
    const unsentUserFiles = userFiles.filter((filename) => {
        let path = basePath + "files_document_sent/" + filename;
        console.log(path);
        if (fs.existsSync(path)) {
            return false;
        }
        else {
            return true;
        }
    });
    
    req.userFiles = userFiles;
    req.unsentUserFiles = unsentUserFiles;
    next();
}

module.exports = {
    "log": log,
    "getUserData": getUserData,
    "getUserFiles": getUserFiles
}