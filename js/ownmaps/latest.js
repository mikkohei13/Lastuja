"use strict";

let circle;
let marker;
let timeUpdaterInterval;

let pollingIntervalMinutes = 5;

getTrackData();
let pollingInterval = window.setInterval(function() {
    getTrackData();
}, (pollingIntervalMinutes * 60 * 1000));

function getTrackData() {
    let limit = 1;
    $.ajax({
        url: (bowerbird_host + "/get?apikey=" + bowerbird_apikey + "&bowerbird_set=owntracks&limit=" + limit + "&sort=tst:DESC"),
        cache: false
    })
    // Todo: use a promise?
        .done(function(json) {
            let documentArray = JSON.parse(json);
            // check if valid object (lat sometimes undefined)?
            drawPosition(documentArray);
        });
}

function drawPosition(documentArray) {
    clearInterval(timeUpdaterInterval);
    if (marker) {
        mymap.removeLayer(marker);
    }
    if (circle) {
        mymap.removeLayer(circle);
    }

    let documentObj = documentArray[0];
    console.log(JSON.stringify(documentObj));

    circle = createCircle(documentObj, "#006AA7", 0.2, 2);
    circle.addTo(mymap);

    marker = L.marker([documentObj.lat, documentObj.lon]);
    marker.addTo(mymap);

    let zoom = documentObj.acc < 100 ? 15 : 14;
    mymap.setView([documentObj.lat, documentObj.lon], zoom);

    updateTime(documentObj.tst); // first update
    timeUpdaterInterval = window.setInterval(function() {
        updateTime(documentObj.tst);
    }, 60000);
}

const updateTime = function updateTime(unixtime) {
    let time = moment(unixtime, "X").fromNow();
    $("#time").html(time);
    console.log("foo:" + unixtime + " " + time);
}

