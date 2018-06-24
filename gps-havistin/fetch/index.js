
const winston = require("winston");
winston.add(winston.transports.File, { filename: "../logs/fetch.log" });

const argumentsParser = require("./arguments_parser");
const args = argumentsParser.allowedArguments();

const fs = require("fs");
const request = require("request");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const gmail = require("./mail");
const gpx2laji = require("./gpx2laji");
const secrets = require("./secrets");
const nodemailer = require('nodemailer');

const stringHash = require("string-hash"); // debug

// -----------------------------------------------------------
// Setup

/*
 Database structure
  "files": [
    {
      "id": "test_mytracks_20180226_140839.gpx",
      "pluscode": "test",
      "status": "invalid",
      "validationMessage": "{\"statusCode\":422,\"name\":\"Error\",\"message\":\"Unprocessable Entity\",
        \"details\":{\"gatherings\":{\"0\":{\"units\":{\"errors\":[\"should NOT have less than 1 items\"]}}}}}",
      "waypointCount": 0,
      "segmentCount": 32,
      "datetime": "2018-06-05T06:50:57.163Z"
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
const adapter = new FileSync("../db.json");
const db = lowdb(adapter);
db.defaults({ files: [] })
  .write();

// -----------------------------------------------------------
// Functions

function isDatabased(id) {
//  return false; // DEBUG; disable database check by uncommenting this

  const exists = db.get("files")
    .find({ id }) // TODO: ?? po. id: id ??
    .value();

  if (exists === undefined) {
    return false;
  }

  return true;
}

// Validate a laji.fi document
const validateLajiString = (lajiString, functionCallback) => {
  const validationEndpoint = `https://api.laji.fi/v0/documents/validate?type=error&lang=en&validationErrorFormat=object&access_token=${secrets.lajifiApiToken}`;
  const validationResult = {};

  // TODO: look into how request.post handles JSON vs. objects

  // Request to validation API
  request.post(
    {
      url: validationEndpoint,
      json: JSON.parse(lajiString),
    },
    (errorRequestPost, response, body) => {
      let errorValidateLajiString;

      if (undefined === body || errorRequestPost !== null) {
        // Problem with reaching validator
        errorValidateLajiString = "Error requesting api.laji.fi";
        functionCallback(errorValidateLajiString);
      }
      else if (body.error) {
        // Validation failed
        errorValidateLajiString = null;
        validationResult.validationFailed = true;
        validationResult.validationMessage = JSON.stringify(body.error);
        functionCallback(errorValidateLajiString, validationResult);
      }
      else {
        // Validation successful
        errorValidateLajiString = null;
        validationResult.validationFailed = false;
        functionCallback(errorValidateLajiString, validationResult);
      }
    },
  );
};

const emailResponse = (messageMeta) => {
//  console.log("Debug emailResponse: " + JSON.stringify(messageMeta));

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
      to: messageMeta.recipient,
      subject: messageMeta.subject,
      html: messageMeta.body,
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

// Turns fileMeta into messageMeta object with body and subject
function formatEmail(fileMeta) {
  let messageMeta = { recipient: fileMeta.from };

  if (fileMeta.status === "valid") {
    messageMeta.subject = "Havistin: File ready for uploading"
    messageMeta.body = `Hi there!<br>\n<br>\nFollowing file is ready for uploading to Vihko. Please log in to Havistin at ${secrets.rootUrl} to upload the file.<br>\n<br>\n`;
  }
  else{
    messageMeta.subject = "Havistin: Problem creating file for upload"
    messageMeta.body = `Hi,<br>\n<br>\nThere was a problem creating a file for Vihko from the following attachment you sent. Error: ‚${fileMeta.validationMessage}<br>\n<br>\nYou can see the file on Havistin at ${secrets.rootUrl} but you cannot send it to Vihko.<br>\n<br>\n`;
  }

  let fileInfo = ` File id: ${fileMeta.id}<br>\n Observations: ${fileMeta.gpx.waypointCount}<br>\n Track segments: ${fileMeta.gpx.segmentCount}<br>\n Name: ${fileMeta.gpx.name}<br>\n Date: ${fileMeta.gpx.dateBegin}<br>\n`;

  messageMeta.body = messageMeta.body + fileInfo + "<br>\n<br>\n" + "Regards,<br>\n  Havistin";

  return messageMeta;
}

const attachmentObjectHandler = (attachmentObject) => {
  gpx2laji.parseAttachmentObject(attachmentObject, (errorParseAttachmentObject, lajiObject) => {
    if (errorParseAttachmentObject) {
      winston.warn(`Error parsing GPX file: ${errorParseAttachmentObject}`);
      return;
    }

    // NOW WE HAVE LAJI-DOCUMENT in lajiObject

    // TODO: display lajiObject metadata here

    validateLajiString(lajiObject.lajiString, (errorValidateLajiString, validationResult) => {
      const now = new Date();
      const nowISO = now.toISOString();
      const fileMeta = {
        id: attachmentObject.id,
        from: attachmentObject.fromEmail,
        pluscode: attachmentObject.pluscode,
        status: "invalid",
        validationMessage: validationResult.validationMessage,
        gpx: {
          waypointCount: lajiObject.waypointCount,
          segmentCount: lajiObject.segmentCount,
          name: lajiObject.name,
          dateBegin: lajiObject.dateBegin,
        },
        datetime: nowISO,
      };

      if (errorValidateLajiString) {
        winston.error(`Error with validator: ${errorValidateLajiString}`);
        throw new Error(`Error with validator: ${errorValidateLajiString}`);
      }
      else if (validationResult.validationFailed) {
        fileMeta.status = "invalid";
        // Insert error to database
        db.get("files")
          .push(fileMeta)
          .write();
        winston.warn(`Error creating valid document of file ${attachmentObject.id}: ${validationResult.validationMessage}`);
      }
      else {
        fileMeta.status = "valid";
        // Insert success to database
        db.get("files")
          .push(fileMeta)
          .write();
        // ...and write laji.document to disk
        const filename = `./files_document_archive/${attachmentObject.id}.json`;
        fs.writeFileSync(filename, lajiObject.lajiString);

        winston.info(`File converted into laji-document ${filename} with hash ${stringHash(lajiObject.lajiString)}`);
      }

      // Email validation results
      winston.info("Args: " + JSON.stringify(args));
      if (args.emailResponse) {
        emailResponse(formatEmail(fileMeta));
      }
      if (args.emailLog) {
        winston.info("Email stringifed: " + JSON.stringify(formatEmail(fileMeta)));
      }
    });
  });
};

const validateFilename = (filename) => {
  if (filename.substring(filename.length - 4) === ".gpx") {
    return true;
  }
  else {
    return false;
  }
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
  // "looping async functions is dangerous [and difficult with callbacks]"

  let i = 0;
  attachmentObjectArray.forEach((attachmentObject) => {
    if (isDatabased(attachmentObject.id)) {
      winston.info(`File id ${attachmentObject.id} already in database`);
    }
    else {
      // Call attachmentObjectHandler,
      // and skip further attachments, so only one attachment per email is allowed, for the system to work correctly.
      if (i === 0) {
        if (validateFilename(attachmentObject.id)) {
          winston.info(`Parsing file number ${i}, id ${attachmentObject.id}`);
          attachmentObjectHandler(attachmentObject);
          i += 1; // This affects that no other files are parsed
        }
        else {
          winston.info(`Skipping non-gpx file number ${i}, id ${attachmentObject.id}`);
        }
      }
      else {
        winston.info(`Skipping file number ${i}`);
      }
    }
  });
});
