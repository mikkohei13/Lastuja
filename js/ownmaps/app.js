
function initMap()
{
    if (undefined == mymap)
    {
        // http://stackoverflow.com/questions/37166172/mapbox-tiles-and-leafletjs
        mymap = L.map('mymap').setView([62, 13], 5);
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'light-v9', // streets-v9 satellite-streets-v9 light-v9 dark-v9 outdoors-v9
            accessToken: mapboxAccessToken
        }).addTo(mymap);
    }
}
