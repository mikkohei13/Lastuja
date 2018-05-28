
/*
Methods for accessing the database.
*/

const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

// -----------------------------------------------------------
// Setup

const adapter = new FileSync("../db.json");
const db = lowdb(adapter);
//db.defaults({ files: [] })
//  .write();

// -----------------------------------------------------------
// Functions
  
// TODO: Use this from shared source; secrets
const plusCodes = {
    "MA.3" : "cehmic",
    "MA.0" : "testtest"
}

const getUserFiles = function getUserFiles(callback) {

    callback();

    // TODO: Get files based on pluscode
    /*
    const exists = db.get("files")
    .find({ id })
    .value();
*/

    /*
    let basePath = "../../gps-havistin/fetch/";
    let files = fs.readdirSync(basePath + "files_document/"); // TODO: better relative path?

    // Filter by user's pluscode
    const userFiles = files.filter((filename) => {
        let filenameParts = filename.split("_");
        return (plusCodes[req.lajifi.user.id] === filenameParts[0]);
    });

    // Filter by unsent
    const unsentUserFiles = userFiles.filter((filename) => {
        let path = basePath + "files_document_sent/" + filename;
        console.log(path);
        if (fs.existsSync(path)) {
            return false;
        }
        else {
            return true;
        }
    });
    */
    
    /*
    req.userFiles = userFiles;
    req.unsentUserFiles = unsentUserFiles;
    next();
    */
}

module.exports = {
    "getUserFiles": getUserFiles
}