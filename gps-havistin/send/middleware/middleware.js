
/*
MIDDLEWARE WRAPPER
Business logic is in modules, this handles errors.
Data flows through in the req object.
*/

const lajifiLogin = require("../lajifi_login");
const DbModels = require("../db_models");

// -----------------------------------------------------------
// Setup


// -----------------------------------------------------------
// Functions

const log = function log(req, res, next) {
  console.log(req.query);
  next();
};

// ??: if there is a problem, should the lajifi module handle it, or just return error type and let it be handled here?
// If the module should be generic, just return the error.
const getUserData = function getUserData(req, res, next) {
  lajifiLogin.getUserData(req.query.person_token, (error, lajifi) => {
    // Error handling
    if (error) {
      console.log(error.message);
      if (error.type === "no-persontoken") {
        res.redirect("https://www.biomi.org/havistin/");
      }
      else {
        res.send(error.message);
      }
    }
    else {
      req.lajifi = lajifi;
      next();
    }
  });
};

const getUserFiles = function getUserFiles(req, res, next) {
//    console.log("HERE X:" + JSON.stringify( req.lajifi ));

  // TODO: better variable names, e.g. lajifi -> userData, or can it contain other info also?

  let pluscode;
  pluscode = req.lajifi.user.pluscode;
  pluscode = "test"; // debug

  DbModels.getUserFiles(pluscode, (error, ret) => {
    if (error) {
      res.send(`Error when fething your files: ${error}`);
      console.log("Error x1");
    }

    req.userFiles = ret;
    next();
  });
};

const sendFile = function sendFile(req, res, next) {
  lajifiLogin.sendFile(req.params.fileId, req.query.person_token, (error, ret) => {
    if (error) {
      res.send(`Error when trying to save to laji.fi: ${error}<br/>Please go back and try again.`);
      console.log("Error x2");
    }
    else {
      req.sendFileResponse = ret;

      DbModels.setFileAsSent(req.params.fileId, ret.id);

      next();
    }
  });
};


module.exports = {
  log: log,
  getUserData: getUserData,
  getUserFiles: getUserFiles,
  sendFile: sendFile,
};
