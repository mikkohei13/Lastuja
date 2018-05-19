
const winston = require('winston');
winston.add(winston.transports.File, { filename: '../logs/fetch.log' });

const fs = require('fs');
const request = require('request');
const nodemailer = require('nodemailer');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const gpx2laji = require('./gpx2laji');
const gmail = require('./mail');
const utils = require('./utils');

const secrets = require('./secrets');

// Lowdb setup
/*
files: [
    {
        filename: "",
        pluscode: "",
        stage "gpx, valid, sent"
    }
]
*/
const adapter = new FileSync('db.json');
const db = lowdb(adapter);
db.defaults({ files: [] })
    .write()


/*
Get attachments from Gmail and process them if they are new
Todo: (later, with database) don't try to reprocess fles that have failed earlier

- get attachments from Gmail as objects
- for each, check if they are new in database, based on pluscode and filename
- if old, do nothing
- if new, convert to laji-document and validate
- if invalid or other problem, record that is invalid
    - email user
- if ok, save to archive folder and record this to database, with status = unsentDocument
    - email user with a link

*/
gmail.fetchNewAttachments((fileObjects) => {

    winston.info("Succesfully fetched " + fileObjects.length + " GPX files");
    console.log(fileObjects);

    // Array of file names
//    const newFiles = utils.getAddedFiles("files_gpx", "files_document");

/*    // Convert every new GPX file to document
    newFiles.forEach(function(newFile) {
        winston.info("Processing new GPX file: " + newFile);
        gpxFile2metaDocument(newFile);
    });
*/
    fileObjects.forEach(function(fileObject) {
        // Define id for the file
        let fileId = fileObject.pluscode + "_" + fileObject.filename;

        if (isDatabased(fileId)) {
            winston.info("File id " + fileId + " already in database");
        }
        else {
            // Insert to database
            db.get('files')
                .push({ id: fileId, pluscode: fileObject.pluscode, filename: fileObject.filename })
                .write();
            winston.info("File id " + fileId + " written to database");
        }
    });

});

function isDatabased(fileId) {
    let exists = db.get('files')
        .find({ id: fileId })
        .value();
    
    if (exists == undefined) {
        return false;
    }
    else {
        return true;
    }
}

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
