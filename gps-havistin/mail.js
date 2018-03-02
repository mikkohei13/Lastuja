
/*
This will:
- Read all messages in inbox
- Saves attachments to directories:
   - with pluscodes: datafiles
   - without pluscodes: temp_datafiles

This should
- Read messages
- Save new attachments
- Return / call callbacks with names of new files

Filenames are format {pluscode}_{original_filename}, where pluscode cannot have underscores but original_filename can. Therefore they are separated by the first underscore.fire

Messages and attachments are read separately and asynchronously, so connecting pluscodes (from message) and filenames (from attachment) will have to be done afterwards, combining data from pluscodes and filenames variables.

*/

const Imap = require('imap');
const inspect = require('util').inspect;

const secrets = require('./secrets');

var fs      = require('fs');
var base64  = require('base64-stream');

let pluscodes = {};
let filenames = {};

let tempFileDir = "./temp_datafiles/";
let finalFileDir = "./datafiles/";



// Prefixes filenames with plusoces and moves them to final directory. Leaves files without pluscodes to the temporary directory. 
function organizeFiles() {
    for(var key in pluscodes) {
        if (pluscodes[key] !== "NA" && filenames[key] !== undefined) {
            let source = tempFileDir + filenames[key];
            let destination = finalFileDir + pluscodes[key] + "_" + filenames[key];
            fs.copyFileSync(source, destination);
            fs.unlinkSync(source);
            console.log(destination);
        }
    }
}

var imap    = new Imap({
    user: secrets.email.address,
    password: secrets.email.password,
    host: 'imap.gmail.com',
    port: 993,
    tls: true
    //,debug: function(msg){console.log('imap:', msg);}
});

// Fetching messages and attachments asynchronously by Christiaan Westerbeek
// https://stackoverflow.com/questions/25247207/how-to-read-and-save-attachments-using-node-imap


function toUpper(thing) {
    return thing && thing.toUpperCase ? thing.toUpperCase() : thing;
}

function findAttachmentParts(struct, attachments) {
  attachments = attachments ||  [];
  for (var i = 0, len = struct.length, r; i < len; ++i) {
    if (Array.isArray(struct[i])) {
      findAttachmentParts(struct[i], attachments);
    } else {
      if (struct[i].disposition && ['INLINE', 'ATTACHMENT'].indexOf(toUpper(struct[i].disposition.type)) > -1) {
        attachments.push(struct[i]);
      }
    }
  }
  return attachments;
}

function buildAttMessageFunction(attachment) {
  var filename = attachment.params.name;
  var encoding = attachment.encoding;

  return function (msg, seqno) {
    var prefix = seqno + " ";
    msg.on('body', function(stream, info) {

      //Create a write stream so that we can stream the attachment to file;
      console.log(prefix + 'Streaming this attachment to file', filename, info);
      var writeStream = fs.createWriteStream((tempFileDir + filename));
      writeStream.on('finish', function() {
        console.log(prefix + 'Done writing to file %s', filename);
      });

      //stream.pipe(writeStream); this would write base64 data to the file.
      //so we decode during streaming using 
      if (toUpper(encoding) === 'BASE64') {
        //the stream is base64 encoded, so here the stream is decode on the fly and piped to the write stream (file)
        stream.pipe(base64.decode()).pipe(writeStream);
      } else  {
        //here we have none or some other decoding streamed directly to the file which renders it useless probably
        stream.pipe(writeStream);
      }
    });
    msg.once('end', function() {
      console.log(prefix + 'Finished attachment %s', filename);
      filenames[prefix] = filename;
    });
  };
}

imap.once('ready', function() {

  // Open inbox
  imap.openBox('INBOX', true, function(err, box) {

    if (err) throw err;

    // Fetch messages
    var f = imap.seq.fetch('1:1000', {
      bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)'],
      struct: true,
      markSeen: true // mark message as read, DOESN'T SEEM TO WORK
    });

    // Handling all messages one by one
    f.on('message', function (msg, seqno) {

      console.log('Message #%d', seqno);
      var prefix = seqno + " ";

      // Handling all message bodies one by one
      msg.on('body', function(stream, info) {
        var buffer = '';
        stream.on('data', function(chunk) {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', function() {
          let parsedHeader = Imap.parseHeader(buffer);
          let toEmails = parsedHeader.to;

          // Checks to email addresses
          toEmails.forEach(function(toEmail) {
            let parts = toEmail.split("@");
            let prefixParts = parts[0].split("+");
            if (prefixParts[1] == undefined) {
                prefixParts[1] = "NA";
            }
            console.log("PP: " + prefix + " / " + prefixParts[1]);
            pluscodes[prefix] = prefixParts[1];
          });

          console.log(prefix + 'Parsed header: %s', JSON.stringify(parsedHeader));
        });
      });

      // Handling single message's attributes, once per message
      msg.once('attributes', function(attrs) {
        var attachments = findAttachmentParts(attrs.struct);
        console.log(prefix + 'Has attachments: %d', attachments.length);

        for (var i = 0, len=attachments.length ; i < len; ++i) {
            var attachment = attachments[i];
            /*This is how each attachment looks like {
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
            console.log(prefix + 'Fetching attachment %s', attachment.params.name);

            var f = imap.fetch(attrs.uid , { //do not use imap.seq.fetch here
                bodies: [attachment.partID],
                struct: true
            });

            //build function to process attachment message
            f.on('message', buildAttMessageFunction(attachment));
        }

      });

      msg.once('end', function() {
        console.log(prefix + 'Finished email');
      });

    });
    // Handling one email message ends

    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });
    f.once('end', function() {
      console.log('Done fetching all messages!');
      imap.end();
    });

  });

});

imap.once('error', function(err) {
  console.log(err);
});

imap.once('end', function() {
  console.log('Connection ended');
  console.log("filenames: " + JSON.stringify(filenames));
  console.log("pluscodes: " + JSON.stringify(pluscodes));
  organizeFiles();
});

const fetchNewFiles = function() {
    imap.connect();
    console.log('Fetching email...');
}


module.exports = {
    "fetchNewFiles" : fetchNewFiles
}
