
/*
Methods for accessing the database.
*/

const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

// -----------------------------------------------------------
// Setup

const adapter = new FileSync("../db.json");
const db = lowdb(adapter);

// -----------------------------------------------------------
// Functions

// TODO: create another function that returns userfiles by status, calling getuserfiles.
// ?? Should these be sync instead of async?

const organizeUserFilesByStatus = function organizeUserFilesByStatus(userFiles) {
  const userFilesByStatus = {
    valid: [],
    invalid: [],
    sent: [],
  };

  userFiles.forEach((file) => {
    userFilesByStatus[file.status].push(file);
  });

  return userFilesByStatus;
};

const getUserFiles = function getUserFiles(pluscode, callback) {
  // TODO: maybe organize files here by status??
  // TODO: error handling

  const userFiles = db.get("files")
    .filter({ pluscode: pluscode })
    .sortBy("filename")
    .take(100)
    .value();

  callback(null, organizeUserFilesByStatus(userFiles));
};

const setFileAsSent = function setFileAsSent(fileId, vihkoFileId) {
  // TODO: error handling

  db.get("files")
    .find({ id: fileId })
    .assign({
      status: "sent",
      vihkoFileId: vihkoFileId,
    })
    .write();

  return true;
};

module.exports = {
  getUserFiles: getUserFiles,
  setFileAsSent: setFileAsSent,
};
