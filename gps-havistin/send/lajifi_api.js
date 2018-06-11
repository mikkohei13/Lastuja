
/*
person_token = token = käyttäjän väliaikainen token
access_token = kehittäjän token
*/

// todo: inject these
const secrets = require("./secrets");

const request = require("request");
const fs = require("fs");


// -----------------------------------------------------------
// Setup

const plusCodes = secrets.plusCodes;

// -----------------------------------------------------------
// Functions


const log = function log(req, res, next) {
  console.log(req.query);
  next();
};

const getUserData = function getUserData(personToken, callback) {
  // Error: Persontoken not set
  if (!personToken) {
    const error = {
      type: "no-persontoken",
      message: "No person token available",
    };
    callback(error);

    // TODO: error-first callback
  }
  // OK: Persontoken set
  else {
    console.log(`Person token got: ${personToken}`);

    // Get user data from API
    const endpoint = `https://api.laji.fi/v0/person/${personToken}?access_token=${secrets.lajifiApiToken}`;
    request.get(
      {
        url: endpoint,
      },
      (error, apiResponse, apiBodyJSON) => {
        let apiBodyObject;
        // Don't trust that reponse is valid JSON
        try {
          apiBodyObject = JSON.parse(apiBodyJSON);
        }
        catch (jsonParseError) {
          apiBodyObject = undefined;
        }

        // Error: problem using the API

        // API call error with JSON response: {"error":{"statusCode":404,"name":"Error","message":"Not found","details":"Incorrect personToken given"}}
        
        // apiBodyObject === undefined  -> network error / api.laji.fi down
        // error                        -> error making request, e.g. error within require module(?)
        // body.error != undefined      -> api.laji.fi returns error, e.g. because of erroneus call
        if (apiBodyObject === undefined || error || apiBodyObject.error !== undefined) {
          const errorToReturn = {
            type: "api-call-error",
            message: `API call error with JSON response: ${apiBodyJSON}`,
          };
          callback(errorToReturn);

          // TODO: redirect to login OR return error, if person token expired
        }
        // OK: Valid user data from API
        else {
          const lajifi = {};
          lajifi.user = apiBodyObject;

          // All ok
          if (plusCodes[lajifi.user.id] !== undefined) {
            // Pluscode and email
            lajifi.user.pluscode = plusCodes[lajifi.user.id];
            lajifi.user.secretEmail = `${secrets.email.prefix}+${lajifi.user.pluscode}${secrets.email.domain}`;

            console.log(`Calling callback with ${lajifi}`);
            callback(null, lajifi);
          }
          // Error: Pluscode missing
          else {
            const errorToReturn = {
              type: "user-not-defined",
              message: `No pluscode defined for user ${lajifi.user.id}`,
            };
            callback(errorToReturn);
          }
        }
      },
    );
  }
};

const sendFile = function sendFile(fileId, personToken, callback) {
  console.log(`FORSSA: ${fileId}, personToken: ${personToken}`); // debug

  const documentJSON = fs.readFileSync(`../fetch/files_document_archive/${fileId}.json`);
  //    const documentJSON = fs.readFileSync("../fetch/files_document_archive/mytracks_20180217_070424.gpx.json"); // debug, NOTE .json suffix!

  // This expects the file to be already validated using the api. This may break if validation rules have changed since the file was first validated.

  const endpoint = `https://api.laji.fi/v0/documents?access_token=${secrets.lajifiApiToken}&personToken=${personToken}`;
  console.log(`Endpoint: ${endpoint}`);

  // TODO: look into how request.post handles JSON vs. objects

  const postData = {
    url: endpoint,
    json: JSON.parse(documentJSON),
  };
  console.log(JSON.stringify(postData));

  // Request to validation API
  request.post(
    postData,
    (error, response, body) => {
      if (error) {
        // Generic error
        console.log(`POSTing to APi failed with error: ${error}`);
        callback(error);
      }
      else if (undefined === body) {
        // Problem with reaching validator
        console.log(`Error reaching ${endpoint}`);
        callback(`Error reaching ${endpoint}`);
      }
      else if (body.error) {
        // Validation or save failed
        console.log(`Error saving into laji.fi: ${JSON.stringify(body.error)}`);
        callback(`Error saving into laji.fi: ${JSON.stringify(body.error)}`);
      }
      else {
        // Success
        console.log("Successfully saved into laji.fi");
        console.log(body);

        // Don't trust that reponse is valid JSON
        // TODO: What if api responds ok with unexpected JSON?
        callback(null, body);

        /*
                Example body:

                {
                    creator: 'MA.3',
                    gatheringEvent:
                    { legPublic: true,
                        leg: [ 'MA.3' ],
                        dateBegin: '2018-02-17',
                        id: 'JX.47678#1',
                        '@type': 'MZ.gatheringEvent' },
                    formID: 'JX.519',
                    editors: [ 'MA.3' ],
                    secureLevel: 'MX.secureLevelNone',
                    gatherings:
                    [ { units: [Array],
                        geometry: [Object],
                        notes: 'Route from 2018-02-17 07:04 (parsed by gpx2laji on 2018-06-05T07:02:07.817Z)',
                        id: 'JX.47678#2',
                        '@type': 'MY.gathering' } ],
                    keywords: [ 'havistin', 'gpx' ],
                    publicityRestrictions: 'MZ.publicityRestrictionsPublic',
                    sourceID: 'KE.661',
                    collectionID: 'HR.1747',
                    editor: 'MA.3',
                    dateEdited: '2018-06-07T01:00:11+03:00',
                    dateCreated: '2018-06-07T01:00:11+03:00',
                    id: 'JX.47678',
                    '@type': 'MY.document',
                    '@context': 'http://schema.laji.fi/context/document.jsonld'
                }

                */
        /*
                try {
                    bodyObject = JSON.parse(body);
                    callback(null, bodyObject);
                }
                catch (jsonParseError) {
                    callback("Successfully saved, but API returned invalid response.");
                }
*/
      }
    },
  );
};

module.exports = {
  log: log,
  getUserData: getUserData,
  sendFile: sendFile,
};
