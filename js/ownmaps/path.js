"use strict";

getTrackData();

function getTrackData() {
    let limit = 50;
    $.ajax({
        url: (bowerbird_host + "/get?apikey=" + bowerbird_apikey + "&bowerbird_set=owntracks&limit=" + limit + "&sort=tst:DESC"),
        cache: false
    })
    // Todo: use a promise?
        .done(function(json) {
            let documentArray = JSON.parse(json);
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

function createCircle(documentObj)
{
    let lat = documentObj.lat;
    let lon = documentObj.lon;
    let text = "Accuracy: " + documentObj.acc + " m";
    let radius = Math.floor(documentObj.acc * 1.2); // c. 95 % of positioning fall within this accuracy

    let minimumRadius = 100;
    if (radius < minimumRadius) {
        radius = minimumRadius;
    }

    let circle = L.circle([lat, lon], {
        color: '#006AA7',
        fillColor: '#006AA7',
        fillOpacity: 0.01,
        weight: 1,
        radius: radius
    });
//    console.log("r = " + radius);
    circle.bindPopup(text);
    return circle;
}