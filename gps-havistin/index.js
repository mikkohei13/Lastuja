/*
TODO:
- parse files from datafiles dir
- handle (parse, validate and email about) multiple files at a time
- append parsed files to handledFiles.json
- include person token somewhere
- send documents to API
- show success/false message

*/

const gpx2laji = require('./gpx2laji');
const fs = require('fs');
const request = require('request');
const nodemailer = require('nodemailer');
const gmail = require('./mail.js');

const secrets = require('./secrets');

// Example files
//let filename;
//filename = "files/mytracks01.gpx";
//    filename = "files/mytracks02-pkkorset.gpx";
//    filename = "files/mytracks03-hasseludden.gpx";
//    filename = "files/mytracks04-orminge.gpx";

//const gpxString = fs.readFileSync(filename, 'utf8');



// Get attachments
gmail.fetchNewFiles((fileNames) => {
    console.log("Array of succesfully fetched files: ");
    console.log(fileNames);
    let processedFiles = JSON.parse(fs.readFileSync("processed_files.json", 'utf8'));
    console.log("processedFiles:");
    console.log(processedFiles);

    // Idea: store documents as json files, use those to check what has been processed
    // Or: processed files should be .json files

    fileNames.forEach(function(fileName) {
        if (processedFiles[fileName] === true) {
            // File exists
            console.log("File exists already: " + fileName);
        }
        else {
            // File is new
            console.log("File is new: " + fileName);
//            parse(fileName); // TODO
            parse(fs.readFileSync("./datafiles/" + fileName, 'utf8'));
        }
    });
});


function parse(gpxString) {
    
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

function emailResults() {
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
