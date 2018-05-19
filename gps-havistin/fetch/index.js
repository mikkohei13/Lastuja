
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
//    console.log(fileObjects);

    fileObjects.forEach(function(fileObject) {
        // Define id for the file
        fileObject.fileId = fileObject.pluscode + "_" + fileObject.filename;

        if (isDatabased(fileObject.fileId)) {
            winston.info("File id " + fileObject.fileId + " already in database");
        }
        else {
            winston.info("Starting to parse gpx file " + fileObject.fileId);            

            gpx2laji.parseString(fileObject.gpx, (err, documentMeta) => {

                // TODO: handle errors here when gpx2laji is ready to send them, from line ABBAX or other lines

                validateLajifiDocument(documentMeta.document, (err) => {

                    if (err) {
                        // Insert error to database
                        db.get('files')
                            .push({ id: fileObject.fileId, pluscode: fileObject.pluscode, filename: fileObject.filename, status: "error" })
                            .write();
                        winston.info("Error creating document of file " + fileObject.fileId + ": " + err);
                    }
                    else {
                        // Insert success to database
                        db.get('files')
                            .push({ id: fileObject.fileId, pluscode: fileObject.pluscode, filename: fileObject.filename, status: "valid" })
                            .write();
                        fs.writeFileSync("./files_document_archive/" + fileObject.fileId + ".json", documentMeta.document);
                        winston.info("File " + fileObject.fileId + " converted into laji-document");
                    }
                }); 
            });
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
/*
function gpxFile2metaDocument(fileObject, callback) {

    gpx2laji.parseString(fileObject.gpx, (err, documentMeta) => {

        // TODO: handle errors here when gpx2laji is ready to send them

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
*/

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
