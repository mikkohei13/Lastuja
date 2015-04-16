<!DOCTYPE html>
<html>
<head>
	<title>Espoon hakkuusuunnitelmat</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.1/leaflet.css" />
	<style>
	body
	{
		padding: 0;
		margin: 0;
	}
	html, body, #map
	{
    	height: 100%;
	}
	#map
	{
      height: 70vh;
      width: 100vw;
	}
	#btn {
		text-align: center;
		margin: 1em;
		display: block;
	  background: #3498db;
	  background-image: -webkit-linear-gradient(top, #3498db, #2980b9);
	  background-image: -moz-linear-gradient(top, #3498db, #2980b9);
	  background-image: -ms-linear-gradient(top, #3498db, #2980b9);
	  background-image: -o-linear-gradient(top, #3498db, #2980b9);
	  background-image: linear-gradient(to bottom, #3498db, #2980b9);
	  -webkit-border-radius: 10;
	  -moz-border-radius: 10;
	  border-radius: 10px;
	  font-family: Arial;
	  color: #ffffff;
	  font-size: 20px;
	  padding: 10px 20px 10px 20px;
	  text-decoration: none;
	}

	#btn:hover {
	  background: #3cb0fd;
	  background-image: -webkit-linear-gradient(top, #3cb0fd, #3498db);
	  background-image: -moz-linear-gradient(top, #3cb0fd, #3498db);
	  background-image: -ms-linear-gradient(top, #3cb0fd, #3498db);
	  background-image: -o-linear-gradient(top, #3cb0fd, #3498db);
	  background-image: linear-gradient(to bottom, #3cb0fd, #3498db);
	  text-decoration: none;
	}
	.info
	{
		margin: 1em;
	}

	</style>
</head>
<body>
	<div id="map"></div>
	<a id="btn" src="#">Paikanna</a>
	<p class="info">Saat paikannuksen nopeimmin, jos pidät GPS:n koko ajan päällä.</p>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
	<script src="http://cdn.leafletjs.com/leaflet-0.7.1/leaflet.js"></script>
	<script>
		var map;

		var mapquestOSM = new L.TileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
			maxZoom: 17,
			subdomains: ["otile1", "otile2", "otile3", "otile4"],
			attribution: 'Tiles <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Map data <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors CC-BY-SA'
		});

		var mbTiles = new L.tileLayer('mbtiles.php?db=Espoo-hakkuut3.mbtiles&z={z}&x={x}&y={y}', {
		    tms: true,
		    attribution: 'Hakkuukartat: Espoon kaupunki',
		    opacity: 0.7
		});

		map = new L.Map("map",{
			zoom: 13,
			maxZoom: 16,
            center: [60.235864, 24.642099],
			layers: [mapquestOSM, mbTiles]
		});

		var baseLayers = {
			"Taustakartta": mapquestOSM
		};
		var overlays = {
			"Hakkuukartat": mbTiles,
		};

		layersControl = new L.Control.Layers(baseLayers, overlays, {
			collapsed: false
		});

		map.addControl(layersControl);

		map.locate({setView: true, maxZoom: 16, watch: true, maximumAge: 10000});

		// http://gis.stackexchange.com/questions/90225/how-to-add-a-floating-crosshairs-icon-above-leaflet-map
		// Add in a crosshair for the map
		var crosshairIcon = L.icon({
		    iconUrl: 'crosshair4.png',
		    iconSize:     [44, 44], // size of the icon
		    iconAnchor:   [22, 22], // point of the icon which will correspond to marker's location
		});
		crosshair = new L.marker(map.getCenter(), {icon: crosshairIcon, clickable:false});
		crosshair.addTo(map);

		// Move the crosshair to the center of the map when the user pans
		map.on('move', function(e) {
		    crosshair.setLatLng(map.getCenter());
		});

	</script>
	<script>
		$( "#btn" ).click(function() {
			/*
			var marker;
			var circle;
			if (map.hasLayer(marker))
			{
	            map.removeLayer(marker);
			}
			if (map.hasLayer(circle))
			{
	            map.removeLayer(circle);
			}
			*/

		  	map.locate({ setView: true, maxZoom: 16, watch: true, maximumAge: 10000 })
			  	.on('locationfound', function(e) {
		            var marker = L.marker([e.latitude, e.longitude]).bindPopup('Olet täällä');
		            var circle = L.circle([e.latitude, e.longitude], e.accuracy/2, {
		                weight: 1,
		                color: 'blue',
		                fillColor: '#cacaca',
		                fillOpacity: 0.01
		            });
		            map.addLayer(marker);
		            map.addLayer(circle);
	        	})
		       .on('locationerror', function(e){
		            console.log(e);
		        });
		});
	</script>
</body>
</html>
