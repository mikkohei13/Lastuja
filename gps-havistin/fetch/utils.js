const fs = require('fs');


function getDirFiles2Object(directory) {
    let filesArray = fs.readdirSync(directory);
    let filesObject = {};

    filesArray.forEach(function(fileName) {
        filesObject[fileName.split(".")[0]] = fileName.split(".")[0];
    });

    return filesObject;
}

// Returns array of file names of those files that exist in newFilesDirecotry but not in oldFilesDirectory
function getAddedFiles(moreFilesDir, lessFilesDir) {
    const lessFiles = getDirFiles2Object(lessFilesDir);
    const moreFiles = getDirFiles2Object(moreFilesDir);
    let addedFiles = [];
    for(file in moreFiles) {
        if (lessFiles[file] === undefined) {
            addedFiles.push(file);
        }
    }
    return addedFiles;
}

module.exports = {
    "getDirFiles2Object": getDirFiles2Object,
    "getAddedFiles": getAddedFiles
}

