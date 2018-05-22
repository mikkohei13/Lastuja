
/*
This will:
- Read messages in inbox
- Saves all attachments to archive dir
- Save all attachments that have proper pluscodes to permanent dir and deletes them from archive dir
- Calls the callback function with an array of file objects

Messages and attachments are read separately and asynchronously, so connecting pluscodes (from message)
and filenames (from attachment) will have to be done afterwards (function organizeFiles),
combining data from pluscodes and filenames variables using the sequence number.

*/

const Imap = require("imap");
const fs = require("fs");
const base64 = require("base64-stream");

const secrets = require("./secrets");

let moduleCallback;
const pluscodes = {};
const filenames = {};

const archiveFileDir = "./files_gpx_archive/";

// Settings

const imap = new Imap({
  user: secrets.email.address,
  password: secrets.email.password,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  // ,debug: function(msg){console.log('imap:', msg);}
});


// Fetching messages and attachments asynchronously by Christiaan Westerbeek
// https://stackoverflow.com/questions/25247207/how-to-read-and-save-attachments-using-node-imap

function toUpper(thing) {
  return thing && thing.toUpperCase ? thing.toUpperCase() : thing;
}

function findAttachmentParts(struct, attachmentsParam) {
  let attachments = attachmentsParam;
  attachments = attachments || [];
  for (let i = 0, len = struct.length; i < len; i += 1) {
    if (Array.isArray(struct[i])) {
      findAttachmentParts(struct[i], attachments);
    }
    else if (struct[i].disposition && ["INLINE", "ATTACHMENT"].indexOf(toUpper(struct[i].disposition.type)) > -1) {
      attachments.push(struct[i]);
    }
  }
  return attachments;
}

function buildAttMessageFunction(attachment) {
  const filename = attachment.params.name;
  const encoding = attachment.encoding;

  return function building(msg, seqno) {
    const prefix = `${seqno} `;
    msg.on("body", (stream, info) => {
      // Create a write stream so that we can stream the attachment to file;
      console.log(`${prefix}Streaming this attachment to file`, filename, info);
      const writeStream = fs.createWriteStream((archiveFileDir + filename));
      writeStream.on("finish", () => {
        console.log(`${prefix}Done writing to file %s`, filename);
      });

      // stream.pipe(writeStream); this would write base64 data to the file.
      // so we decode during streaming using
      if (toUpper(encoding) === "BASE64") {
        // the stream is base64 encoded, so here the stream is decode on the fly and piped to the write stream (file)
        stream.pipe(base64.decode()).pipe(writeStream);
      }
      else {
        // here we have none or some other decoding streamed directly to the file which renders it useless probably
        stream.pipe(writeStream);
      }
    });
    msg.once("end", () => {
      console.log(`${prefix}Finished attachment %s`, filename);
      filenames[prefix] = filename;
    });
  };
}

imap.once("ready", () => {
  // Open inbox
  imap.openBox("INBOX", true, (err/*, box*/) => {
    if (err) throw err;

    // Fetch messages
    const f = imap.seq.fetch("1:1000", {
      bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)"],
      struct: true,
      markSeen: true, // mark message as read, DOESN'T SEEM TO WORK
    });

    // Handling all messages one by one
    f.on("message", (msg, seqno) => {
      console.log(`Message ${seqno}`);
      const prefix = `${seqno} `;

      // Handling all message bodies one by one
      msg.on("body", (stream/*, info*/) => {
        let buffer = "";
        stream.on("data", (chunk) => {
          buffer += chunk.toString("utf8");
        });
        stream.once("end", () => {
          const parsedHeader = Imap.parseHeader(buffer);
          //          console.log("BUFFER: " + buffer);
          const toEmails = parsedHeader.to;

          // Checks to email addresses
          toEmails.forEach((toEmail) => {
            const parts = toEmail.split("@");
            const prefixParts = parts[0].split("+");
            if (prefixParts[1] === undefined) {
              prefixParts[1] = "NA";
            }
            console.log(`PP: ${prefix} / ${prefixParts[1]}`);
            pluscodes[prefix] = prefixParts[1];
          });

          console.log(`${prefix}Parsed header: %s`, JSON.stringify(parsedHeader));
        });
      });

      // Handling single message's attributes, once per message
      msg.once("attributes", (attrs) => {
        const attachments = findAttachmentParts(attrs.struct);
        console.log(`${prefix}Has attachments: %d`, attachments.length);

        for (let i = 0, len = attachments.length; i < len; i += 1) {
          const attachment = attachments[i];
          /* This is how each attachment looks like {
                partID: '2',
                type: 'application',
                subtype: 'octet-stream',
                params: { name: 'file-name.ext' },
                id: null,
                description: null,
                encoding: 'BASE64',
                size: 44952,
                md5: null,
                disposition: { type: 'ATTACHMENT', params: { filename: 'file-name.ext' } },
                language: null
            }
            */
          console.log(`${prefix}Fetching attachment %s`, attachment.params.name);

          const f2 = imap.fetch(attrs.uid, { // do not use imap.seq.fetch here
            bodies: [attachment.partID],
            struct: true,
          });

            // build function to process attachment message
          f2.on("message", buildAttMessageFunction(attachment));
        }
      });

      msg.once("end", () => {
        console.log(`${prefix}Finished email`);
      });
    });
    // Handling one email message ends

    f.once("error", (err2) => {
      console.log(`Fetch error: ${err2}`);
    });
    f.once("end", () => {
      console.log("Done fetching all messages!");
      imap.end();
    });
  });
});

imap.once("error", (err) => {
  console.log(err);
});

// Puts files with proper pluscodes as strings into an object, to be sent as an array of file objects to the callback.
// Leaves all files to the archive directory, with original filenames.
function organizeFiles() {
  const attachmentObjectsArray = [];
  for (const key in pluscodes) { // eslint-disable-line no-restricted-syntax
    if (pluscodes[key] !== "NA" && filenames[key] !== undefined) {
      // Dev note (2018-05-19):
      // If there is a need to record the pluscode for archive files, this is the place where it should be added to the filename, by renaming the files in the directory.
      const sourceDirFile = archiveFileDir + filenames[key];

      // Create attachmentObject object
      const attachmentObject = {};
      attachmentObject.gpxString = fs.readFileSync(sourceDirFile, "utf8");
      attachmentObject.pluscode = pluscodes[key];
      attachmentObject.filename = filenames[key];
      attachmentObject.id = `${pluscodes[key]}_${filenames[key]}`;
      //            console.log(attachmentObject);
      attachmentObjectsArray.push(attachmentObject);
    }
  }
  moduleCallback(attachmentObjectsArray);
}

const fetchNewAttachments = (callback) => {
  moduleCallback = callback;
  imap.connect();
  console.log("Fetching email...");
};

imap.once("end", () => {
//  console.log('Connection ended');
//  console.log("filenames: " + JSON.stringify(filenames));
//  console.log("pluscodes: " + JSON.stringify(pluscodes));
  organizeFiles();
});


module.exports = {
  fetchNewAttachments,
};
