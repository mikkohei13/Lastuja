
const winston = require("winston");
winston.add(winston.transports.File, { filename: "../logs/fetch.log" });

const fs = require("fs");
const request = require("request");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const gmail = require("./mail");
const gpx2laji = require("./gpx2laji");
const secrets = require("./secrets");

const stringHash = require("string-hash"); // debug

// -----------------------------------------------------------
// Setup

/*
 Database structure
files: [
    {
        filename: "",
        pluscode: "",
        stage "gpx, invalid, valid, sent"
    }
]

lajiObject = {
  lajiString: 
  validationSuccessful: (optional)
  validationMessage: (optional)
  ...
  ...
}
*/
const adapter = new FileSync("db.json");
const db = lowdb(adapter);
db.defaults({ files: [] })
  .write();

// -----------------------------------------------------------
// Functions

function isDatabased(id) {
//  return false; // DEBUG; disable database check

  const exists = db.get("files")
    .find({ id: id })
    .value();

  if (exists === undefined) {
    return false;
  }

  return true;
}

// Validate a laji.fi document
const validateLajiString = (lajiString, functionCallback) => {

  const validationEndpoint = `https://api.laji.fi/v0/documents/validate?type=error&lang=en&validationErrorFormat=object&access_token=${secrets.lajifiApiToken}`;
  let err;
  let validationResult = {};

//  console.log("LAHTIx2: " + lajiString);
// TODO: look into how request.post handles JSON vs. objects

  // Request to validation API
  request.post(
    {
      url: validationEndpoint,
      json: JSON.parse(lajiString),
    },
    (error, response, body) => {
      console.log("VAALIMAA: ");
      console.log(body);
//      console.log(bodyObject.error);

      if (undefined === body || error !== null) {
        // Problem with reaching validator
        const err = "Error requesting api.laji.fi";
        functionCallback(err);
      }
      else if (body.error) {
        // Validation failed
        const err = null;
        validationResult.validationFailed = true;
        validationResult.validationMessage = JSON.stringify(body.error);
        functionCallback(err, validationResult);
      }
      else {
        // Validation successful
        err = null;
        validationResult.validationFailed = false;
        functionCallback(err, validationResult);
      }
    }
  );
}


// -----------------------------------------------------------
// Main

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
// TODO: ? to be consistent, set this in const and call separately??

gmail.fetchNewAttachments((attachmentObjectArray) => {
  // Here we have array of all attachments found from Gmail inbox, processed and unprocessed ones. Gmail mail fetching is decoupled from further processing of the attachments.

  winston.info(`Succesfully fetched ${attachmentObjectArray.length} GPX attachments from email`);

  // New principle: only handle first attachment that is not yet in the database. This avoids looping async.
  // AÖ: "looping async functions is dangerous [an difficult with callbacks]"
  let i = 0;
  attachmentObjectArray.forEach((attachmentObject) => {
    if (isDatabased(attachmentObject.id)) {
      winston.info(`File id ${attachmentObject.id} already in database`);
    }
    else {
      // Call attachmentObjectHandler
      // and skip further attachments
      if (i === 0) {
        winston.info(`Parsing file number ${i}, id ${attachmentObject.id}`);
        attachmentObjectHandler(attachmentObject);
      }
      else {
        winston.info(`Skipping file number ${i}`);
      }
      i++;
    }
  })
})

const attachmentObjectHandler = (attachmentObject) => {

  gpx2laji.parseAttachmentObject(attachmentObject, (errorParseAttachmentObject, lajiObject) => {

    if (errorParseAttachmentObject) {
      winston.info("Error parsing GPX file, hash " + stringHash(lajiObject.lajiString) + " and error " + errorParseAttachmentObject);
      throw new Error("Error parsing GPX file");
    }

    // NOW WE HAVE LAJI-DOCUMENT in lajiObject

    // TODO: display lajiObject metadata here
//    console.log("LAHTI: " + lajiObject.lajiString);

    validateLajiString(lajiObject.lajiString, (errorValidateLajiString, validationResult) => {
      if (errorValidateLajiString) {
        throw new Error("Error with validator: " + errorValidateLajiString);
        winston.info(`Error with validator, when validating file file ${attachmentObject.id}: ${errorValidateLajiString}`);
      }
      else if (validationResult.validationFailed) {
        // Insert error to database
        db.get("files")
          .push({
            id: attachmentObject.id,
            pluscode: attachmentObject.pluscode,
            filename: attachmentObject.filename,
            status: "invalid",
            validationMessage: validationResult.validationMessage,
            waypointCount: lajiObject.waypointCount,
            segmentCount: lajiObject.segmentCount
          })
          .write();
        winston.info(`Error creating valid document of file ${attachmentObject.id}: ${validationResult.validationMessage}`);
      }
      else {
        // Insert success to database
        db.get("files")
          .push({
            id: attachmentObject.id,
            pluscode: attachmentObject.pluscode,
            filename: attachmentObject.filename,
            status: "valid",
            validationMessage: lajiObject.validationMessage,
            waypointCount: lajiObject.waypointCount,
            segmentCount: lajiObject.segmentCount            
          })
          .write();
        // ...and write laji.document to disk
        fs.writeFileSync("./files_document_archive/" + attachmentObject.filename + ".json", lajiObject.lajiString);
        winston.info("File converted into laji-document with hash " + stringHash(lajiObject.lajiString));
      }
    });
  });
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
function gpxFile2metaDocument(attachmentObject, callback) {

    gpx2laji.parseString(attachmentObject.gpx, (err, lajiObject) => {

        // TODO: handle errors here when gpx2laji is ready to send them

        validateLajifiDocument(lajiObject.document, (err) => {

            // Message logged or sent to user
            let messageForUser = "";

            // Only save valid documents
            if (err === null) {
                messageForUser += "GPX to laji.fi conversion succeeded for file: " + fileName + ".gpx \n";
                fs.writeFileSync("./files_document/" + fileName + ".json", lajiObject.document);
            }
            else {
                messageForUser += "GPX to laji.fi conversion failed for file: " + fileName + ".gpx " + JSON.stringify(err) + "\n";
            }

            messageForUser += "* Notes: " + lajiObject.document.gatherings[0].notes + "\n";
            messageForUser += "* Date: " + lajiObject.document.gatheringEvent.dateBegin + "\n";
            messageForUser += "* " + lajiObject.waypointCount + " waypoints\n";
            messageForUser += "* " + lajiObject.segmentCount + " segments\n";
            winston.info(messageForUser);

    //            emailResults();

        });

    });

}
*/

