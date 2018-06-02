
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

const getUserFiles = function getUserFiles(pluscode, callback) {

    // TODO: maybe organize files here by status??

    const userFiles = db.get("files")
    .filter({ pluscode: pluscode })
    .sortBy('filename')
    .take(100)
    .value();

    const userFilesByStatus = {
        valid: [],
        invalid: [],
        sent: []
    };

    userFiles.forEach((file) => {
        userFilesByStatus[file.status].push(file);
    });

    console.log(userFilesByStatus);

    callback(null, userFilesByStatus);
}

module.exports = {
    "getUserFiles": getUserFiles
}