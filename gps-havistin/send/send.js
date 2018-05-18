const secrets = require('./secrets');
const request = require('request');

//accessTokenProd

function sendLajifiDocument(document, functionCallback) {

// Prod
    const postEndpoint = "https://api.laji.fi/v0/documents/?lang=en&validationErrorFormat=object&access_token=" + secrets.lajifiApiToken;

// Test
//    const postEndpoint = "https://fmnh-ws-test.it.helsinki.fi/v0/documents/?lang=en&validationErrorFormat=object&access_token=" + secrets.lajifiApiToken;
    let err;

    console.log("Sending document: " + document); // debug
    

    // Request to validation API
    request.post({
        url: postEndpoint,
        json: document
    },
    function(error, response, body) {
        if (undefined == body) {
            err = "Error connecting api.laji.fi";
        }
        else if (undefined !== body.error) {
            err = body.error;
            // Validation failed
        }
        else {
            err = null;
            // Validation successful
        }

        console.log("After POSTing");

        console.log(error);
        console.log(response);
        console.log(body);

        functionCallback(err);
    });
}

module.exports = {
    "sendLajifiDocument": sendLajifiDocument
}