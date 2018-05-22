{ Error: Please log in via your web browser: https://support.google.com/mail/accounts/answer/78754 (Failure)
  at Connection._resTagged (/home/mikko/code/Lastuja/gps-havistin/fetch/node_modules/imap/lib/Connection.js:1502:11)
  at Parser.<anonymous> (/home/mikko/code/Lastuja/gps-havistin/fetch/node_modules/imap/lib/Connection.js:194:10)
  at emitOne (events.js:116:13)
  at Parser.emit (events.js:211:7)
  at Parser._resTagged (/home/mikko/code/Lastuja/gps-havistin/fetch/node_modules/imap/lib/Parser.js:175:10)
  at Parser._parse (/home/mikko/code/Lastuja/gps-havistin/fetch/node_modules/imap/lib/Parser.js:139:16)
  at Parser._tryread (/home/mikko/code/Lastuja/gps-havistin/fetch/node_modules/imap/lib/Parser.js:82:15)
  at TLSSocket.Parser._cbReadable (/home/mikko/code/Lastuja/gps-havistin/fetch/node_modules/imap/lib/Parser.js:53:12)
  at emitNone (events.js:106:13)
  at TLSSocket.emit (events.js:208:7) type: 'no', textCode: 'ALERT', source: 'authentication' }
info: Succesfully fetched 0 GPX attachments from email


async.series([

          function(taskCallback) {
            validateLajifiDocument(documentMeta.document, (errorValidateLajifiDocument, validationResult) => {
              if (errorValidateLajifiDocument) {
                throw new Error("Error validating laji-document");
              }
              console.log("1 VALID RESULT: " + validationResult)
              taskCallback(null, validationResult);
            })
          },

          function(taskCallback) {
            // ReferenceError: validationResult is not defined
            console.log("VALIDATION RESULT: " + validationResult);
            // do some more stuff ...
          }

        ],
        function(err, resultsFromSeries) {
          console.log(resultsFromSeries);
            // results is now equal to ['one', 'two']
        });
        


                // SEQUENTIAL
        /*
        async.seq(
          function(callback) {
            validateLajifiDocument(documentMeta.document, (errorValidateLajifiDocument, validationResult) => {
              callback(errorValidateLajifiDocument, validationResult);
            })
          },
          function(validationResult, callback) {
            console.log("VAL: " + validationResult);
//              callback(null, array1[0]);
          }
        )(function(err, data) {
            console.log(data);
        });
        */

       validateLajifiDocument(documentMeta.document, (errorValidateLajifiDocument, validatedDocument) => {
        if (errorValidateLajifiDocument) {
          // Insert error to database
          db.get("files")
            .push({
              id: fileObject.fileId, pluscode: fileObject.pluscode, filename: fileObject.filename, status: "error",
            })
            .write();
          winston.info(`Error creating valid document of file ${fileObject.fileId}: ${errorValidateLajifiDocument}`);
        }
        else {
          // Insert success to database
          db.get("files")
            .push({
              id: fileObject.fileId, pluscode: fileObject.pluscode, filename: fileObject.filename, status: "valid",
            })
            .write();
          fs.writeFileSync(`./files_document_archive/${fileObject.fileId}.json`, JSON.stringify(validatedDocument)); // abba
          winston.info(`File ${fileObject.fileId} converted into laji-document with hash ` + stringHash(JSON.stringify(validatedDocument)));
        }
      });