"use strict";

getTrackData();


function getTrackData() {
    let limit = 1;
    $.ajax({
        url: (bowerbird_host + "/get?apikey=" + bowerbird_apikey + "&bowerbird_set=owntracks&limit=" + limit + "&sort=tst:DESC"),
        cache: false
    })
    // Todo: use a promise?
        .done(function(json) {
            let documentArray = JSON.parse(json);
            drawCircle(documentArray);
        });
}

function drawCircle(documentArray) {
    let documentObj = documentArray[0];
//    console.log(JSON.stringify(documentObj));

    let circle = createCircle(documentObj);

//    console.log();

    circle.addTo(mymap);
//    mymap.fitBounds(circle.getBounds());
}

