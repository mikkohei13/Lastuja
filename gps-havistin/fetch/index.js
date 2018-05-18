
const winston = require('winston');
winston.add(winston.transports.File, { filename: '../logs/fetch.log' });

const fs = require('fs');
const request = require('request');
const nodemailer = require('nodemailer');

const gpx2laji = require('./gpx2laji');
const gmail = require('./mail');
const utils = require('./utils');

const secrets = require('./secrets');


/*
Get attachments from Gmail and process them if they are new
Todo: (later, with database) don't try to reprocess fles that have failed earlier
*/
gmail.fetchNewAttachments((fileStrings) => {

    winston.info("Succesfully fetched " + fileStrings.length + " GPX files");
    console.log(fileStrings);

    const newFiles = utils.getAddedFiles("files_gpx", "files_document");

    // Convert every new GPX file to document
    newFiles.forEach(function(newFile) {
        winston.info("Processing new GPX file: " + newFile);
        gpxFile2metaDocument(newFile);
    });
});

/*
Parse GPX file to laji.fi document
Success:
- save to disk on success
- (email user)
Failure:
- console.log
*/
function gpxFile2metaDocument(fileName) {

    const gpxString = fs.readFileSync("./files_gpx/" + fileName + ".gpx", 'utf8');

    gpx2laji.parseString(gpxString, (err, documentMeta) => {

        validateLajifiDocument(documentMeta.document, (err) => {

            // Message logged or sent to user
            let messageForUser = "";

            // Only save valid documents
            if (err === null) {
                messageForUser += "GPX to laji.fi conversion succeeded for file: " + fileName + ".gpx \n";
                fs.writeFileSync("./files_document/" + fileName + ".json", documentMeta.document);
            }
            else {
                messageForUser += "GPX to laji.fi conversion failed for file: " + fileName + ".gpx " + JSON.stringify(err) + "\n"; 
            }
            
            messageForUser += "* Notes: " + documentMeta.document.gatherings[0].notes + "\n";
            messageForUser += "* Date: " + documentMeta.document.gatheringEvent.dateBegin + "\n";            
            messageForUser += "* " + documentMeta.waypointCount + " waypoints\n";
            messageForUser += "* " + documentMeta.segmentCount + " segments\n";
            winston.info(messageForUser);

    //            emailResults();

        });

    });

}

// Validate a laji.fi document
function validateLajifiDocument(document, functionCallback) {
    const validationEndpoint = "https://api.laji.fi/v0/documents/validate?type=error&lang=en&validationErrorFormat=object&access_token=" + secrets.lajifiApiToken;
    let err;

//    console.log(document); // debug

    // Request to validation API
    request.post({
        url: validationEndpoint,
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

        functionCallback(err);
    });
}

function emailResults(message) {
    // https://medium.com/@manojsinghnegi/sending-an-email-using-nodemailer-gmail-7cfa0712a799

    // 2nd option: https://github.com/eleith/emailjs

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
        subject: "Havistin GPS file report",
        html: message
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(info);
        }
    });

    console.log("Email sending in progress...")
}
