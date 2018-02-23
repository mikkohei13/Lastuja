//const express = require('express');
//const app = express();
const gpx2laji = require('./gpx2laji');
const fs = require('fs');
const request = require('request');

const secrets = require('./secrets');

/*
app.get('/', function response(req, res) {
    let parsed = gpx2laji.parser();
    res.send(parsed);
})

app.listen(3000, () => console.log('Example app listening on port 3000!'));
*/

const fromFile = false;

if (fromFile) {
    const filename = "files/mytracks02-pkkorset.gpx";
    const gpxString = fs.readFileSync(filename, 'utf8');

    let parsed = gpx2laji.parseString(gpxString, (err, document) => {
        validateLajifiDocument(document);
    });
}
else {
    let parsed = gpx2laji.parseExample((err, document) => {
        validateLajifiDocument(document);
    });    
}

function validateLajifiDocument(document) {
    const validationEndpoint = "https://api.laji.fi/v0/documents/validate?type=error&lang=en&validationErrorFormat=object&access_token=" + secrets.lajifiApiToken;

    console.log(document); // debug

    request.post({
        url: validationEndpoint,
        json: document
    },
    function(error, response, body) {
        console.log("Validated: ");
        console.log(body);
    });
}
