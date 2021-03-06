"use strict";

let mymap;
initMap();

function initMap()
{
    console.log("map initialized");
    // http://stackoverflow.com/questions/37166172/mapbox-tiles-and-leafletjs
    mymap = L.map('mymap').setView([60.2, 24.6], 10);
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'outdoors-v9', // streets-v9 satellite-streets-v9 light-v9 dark-v9 outdoors-v9
        accessToken: mapboxAccessToken
    }).addTo(mymap);
}

function createCircle(documentObj, color = '#006AA7', fillOpacity = 0.01, weight = 1)
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
        "color": color,
        "fillColor": color,
        "fillOpacity": fillOpacity,
        "weight": weight,
        "radius": radius
    });
//    console.log("r = " + radius);
    circle.bindPopup(text);
    return circle;
}