"use strict";

getTrackData();

function getTrackData() {
    let limit = 300;
    $.ajax({
        url: (bowerbird_host + "/get?apikey=" + bowerbird_apikey + "&bowerbird_set=owntracks&limit=" + limit + "&sort=tst:DESC"),
        cache: false
    })
    // Todo: use a promise?
        .done(function(json) {
            let documentArray = JSON.parse(json); // Check: why can/must be parsed? See http://stackoverflow.com/questions/15617164/parsing-json-giving-unexpected-token-o-error
            drawMarkerGroup(documentArray);
        });
}

function drawMarkerGroup(documentArray) {
    let coordinatePairArray = [];
    let circles = documentArray.map(function createMarkerCaller(documentObj) {

        // Polyline coordinates
        let coordinatePair = [];
        coordinatePair.push(documentObj.lat, documentObj.lon);
        coordinatePairArray.push(coordinatePair); // side effect

        // Circle markers
        return createCircle(documentObj);
    });

//    console.log(coordinatePairArray);

    let circleGroup = L.layerGroup(circles);
    circleGroup.addTo(mymap);

    let polyline = L.polyline(coordinatePairArray, {color: 'red'});
    polyline.addTo(mymap);
    mymap.fitBounds(polyline.getBounds());
}
