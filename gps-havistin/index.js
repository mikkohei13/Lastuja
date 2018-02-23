//const express = require('express');
//const app = express();
const gpx2laji = require('./gpx2laji');
const fs = require('fs');

/*
app.get('/', function response(req, res) {
    let parsed = gpx2laji.parser();
    res.send(parsed);
})

app.listen(3000, () => console.log('Example app listening on port 3000!'));
*/

const fromFile = true;

if (fromFile) {
    const filename = "files/mytracks02-pkkorset.gpx";
    const gpxString = fs.readFileSync(filename, 'utf8');
//    console.log(gpxString);

    let parsed = gpx2laji.parseString(gpxString, (err, jsonDocument) => {
        console.log("Here file JSON:");
        console.log(jsonDocument);
    });
}
else {
    let parsed = gpx2laji.parseExample((err, jsonDocument) => {
        console.log("Here example JSON:");
        console.log(jsonDocument);
    });    
}
