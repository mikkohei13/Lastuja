//const express = require('express');
//const app = express();
const gpx2laji = require('./gpx2laji');
const fs = require('fs');
const request = require('request');
const nodemailer = require('nodemailer');

const secrets = require('./secrets');

/*
app.get('/', function response(req, res) {
    let parsed = gpx2laji.parser();
    res.send(parsed);
})

app.listen(3000, () => console.log('Example app listening on port 3000!'));
*/

const fromFile = true;

if (fromFile) {
    let filename;
    filename = "files/mytracks01.gpx";
    filename = "files/mytracks02-pkkorset.gpx";
    filename = "files/mytracks03-hasseludden.gpx";
//    filename = "files/mytracks04-orminge.gpx";

    const gpxString = fs.readFileSync(filename, 'utf8');

    gpx2laji.parseString(gpxString, (err, documentMeta) => {
        validateLajifiDocument(documentMeta.document, (err) => {

            // Message sent to user
            let messageForUser = "\n";
            if (err === null) {
                messageForUser += "GPX-file converted to laji.fi document successfully.\n";
            }
            else {
                messageForUser += "Converting GPX file to laji.fi document failed: " + JSON.stringify(err) + "\n"; 
            }
            
            messageForUser += "* Name: " + documentMeta.document.gatherings[0].notes + "\n";
            messageForUser += "* Date: " + documentMeta.document.gatheringEvent.dateBegin + "\n";            
            messageForUser += "* " + documentMeta.waypointCount + " waypoints\n";
            messageForUser += "* " + documentMeta.segmentCount + " segments\n";
            console.log(messageForUser);

//            emailResults();

        });

    });
}
else {
    gpx2laji.parseExample((err, documentMeta) => {
        validateLajifiDocument(documentMeta.document);
        // todo: add same functionality as with previous branch
    });    
}

function validateLajifiDocument(document, functionCallback) {
    const validationEndpoint = "https://api.laji.fi/v0/documents/validate?type=error&lang=en&validationErrorFormat=object&access_token=" + secrets.lajifiApiToken;
    let err;

//    console.log(document); // debug

    request.post({
        url: validationEndpoint,
        json: document
    },
    function(error, response, body) {
        if (body.error !== undefined) {
            err = body.error;
//            console.log("Validation failed");
        }
        else {
            err = null;
//            console.log("Validation successful");
        }
//        console.log(body);

        functionCallback(err);
    });
}

function emailResults() {
    // https://medium.com/@manojsinghnegi/sending-an-email-using-nodemailer-gmail-7cfa0712a799

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: secrets.email.address,
            pass: secrets.email.password
        }
    });

    const mailOptions = {
        from: secrets.email.address,
        to: secrets.testEmail,
        subject: "GPX to laji.fi",
        html: "Test \n foo bar ÅÄÖåäö"
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err);
        else
            console.log(info);
    });

    console.log("Email sending in progress...")

}
