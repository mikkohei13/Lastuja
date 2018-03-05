
/*
person_token = token = käyttäjän väliaikainen token
access_token = kehittäjän token
*/

const secrets = require('./secrets');
const request = require('request');
const fs = require('fs');


var log = function (req, res, next) {
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

    // Get user data
    const endpoint = "https://api.laji.fi/v0/person/" + personToken + "?access_token=" + secrets.accessTokenProd;
    request.get({
        url: endpoint
    },
    function(error, res, body) {
        if (undefined == body || error) {
            console.log("Error:" + error + "\n" + body);
            res.end("Error:" + error + "\n" + body);
            // TODO: redirect to login, if person token expired
        }
        else {
            console.log(body);
            req.lajifi = {};
            req.lajifi.user = JSON.parse(body);
            if (plusCodes[req.lajifi.user.id] != undefined) {
                req.lajifi.user.pluscode = plusCodes[req.lajifi.user.id];
            }
            else {
                res.end("Error: no pluscode defined for user " + req.lajifi.user.id);
            }

            console.log(req.lajifi.user);
        }
        next();
    });
}


const getUserFiles = function getUserFiles(req, res, next) {
    let files = fs.readdirSync("../../gps-havistin/fetch/files_document/"); // TODO: better relative path?
    req.files = files;
    next();
}

/*
var getPluscodeByMAcode () {
    req.lajifi = {};
    next();
}
*/

module.exports = {
    "log": log,
    "getUserData": getUserData,
    "getUserFiles": getUserFiles
}