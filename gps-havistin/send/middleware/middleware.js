
/*
MIDDLEWARE WRAPPER
Business logic is in modules, this handles errors.
Data flows through in the req object.
*/
const winston = require("winston");
winston.add(winston.transports.File, { filename: "../logs/send.log" });

const lajifiApi = require("../lajifi_api");
const DbModels = require("../db_models");

// -----------------------------------------------------------
// Setup


// -----------------------------------------------------------
// Functions

// ??: if there is a problem, should the lajifi module handle it, or just return error type and let it be handled here?
// If the module should be generic, just return the error.
const getUserData = function getUserData(req, res, next) {
  lajifiApi.getUserData(req.query.person_token, (error, lajifi) => {
    // Error handling
    if (error) {
      winston.error(`Error getting user data: ${error.message}`);

      if (error.type === "no-persontoken" || error.type === "api-token-error") {
        res.redirect("https://www.biomi.org/havistin/");
      }
      else {
        res.send(error.message);
      }
    }
    else {
      winston.info(`Got user data: ${lajifi}`);

      req.lajifi = lajifi;
      next();
    }
  });
};

const getUserFiles = function getUserFiles(req, res, next) {
  // TODO: better variable names, e.g. lajifi -> userData, or can it contain other info also?

  let pluscode;
  pluscode = req.lajifi.user.pluscode;
//  pluscode = "test"; // debug

  DbModels.getUserFiles(pluscode, (error, ret) => {
    if (error) {
      winston.error(`Error fetching files: ${error}`);
      res.send(`Error when fething your files: ${error}`);
    }

    winston.info(`Fetched files: ${ret}`);
    req.userFiles = ret;
    next();
  });
};

const sendFile = function sendFile(req, res, next) {
  lajifiApi.sendFile(req.params.fileId, req.query.person_token, (error, ret) => {
    if (error) {
      winston.error(`Error when trying to save to laji.fi: ${error}`);      

      res.send(`Error when trying to save to laji.fi: ${error}<br/>Please go back and try again.`);
    }
    else {
      winston.info(`Sent file: ${ret}`);      

      req.sendFileResponse = ret;
      DbModels.setFileAsSent(req.params.fileId, ret.id);

      next();
    }
  });
};


module.exports = {
  getUserData: getUserData,
  getUserFiles: getUserFiles,
  sendFile: sendFile,
};
