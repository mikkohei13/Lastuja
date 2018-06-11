
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
        // apiBodyObject === undefined  -> network error / api.laji.fi down
        // error                        -> error making request, e.g. error within require module(?)
        if (apiBodyObject === undefined || error) {
          const errorToReturn = {
            type: "api-call-error",
            message: `API call failed, JSON response: ${apiBodyJSON}`,
          };
          callback(errorToReturn);
        }
        // OK: Login expired or some other error with the token
        // Example JSON in this case: {"error":{"statusCode":404,"name":"Error","message":"Not found","details":"Incorrect personToken given"}}
        else  {
          if (apiBodyObject.error !== undefined) {
            const errorToReturn = {
              type: "api-token-error",
              message: `API responded with error, JSON response: ${apiBodyJSON}`,
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
        }
      },
    );
  }
};

const sendFile = function sendFile(fileId, personToken, callback) {
  const documentJSON = fs.readFileSync(`../fetch/files_document_archive/${fileId}.json`);

  // This expects the file to be already validated using the api. This may break if validation rules have changed since the file was first validated.
  const endpoint = `https://api.laji.fi/v0/documents?access_token=${secrets.lajifiApiToken}&personToken=${personToken}`;

  // TODO: look into how request.post handles JSON vs. objects

  const postData = {
    url: endpoint,
    json: JSON.parse(documentJSON),
  };

  // Request to validation API
  request.post(
    postData,
    (error, response, body) => {
      if (error) {
        // Generic error
        callback(error);
      }
      else if (undefined === body) {
        // Problem with reaching validator
        callback(`Error reaching ${endpoint}`);
      }
      else if (body.error) {
        // Validation or save failed
        callback(`Error saving into laji.fi: ${JSON.stringify(body.error)}`);
      }
      else {
        // Success

        // TODO: What if api responds ok with unexpected JSON?
        /*
                try {
                    bodyObject = JSON.parse(body);
                    callback(null, bodyObject);
                }
                catch (jsonParseError) {
                    callback("Successfully saved, but API returned invalid response.");
                }
*/

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
      }
    },
  );
};

module.exports = {
  getUserData: getUserData,
  sendFile: sendFile,
};
