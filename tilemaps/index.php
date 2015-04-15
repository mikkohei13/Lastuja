<!DOCTYPE html>
<html>
<head>
	<title>Espoon hakkuusuunnitelmat</title>
	<meta charset="utf-8" />

	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.1/leaflet.css" />
	<style>
	body
	{
		padding: 0;
		margin: 0;
	}
	#map
	{
      height: 100vh;
      width: 100vw;
	}

	</style>
</head>
<body>
	<div id="map"></div>

	<script src="http://cdn.leafletjs.com/leaflet-0.7.1/leaflet.js"></script>
	<script>
		var map;

		var mapquestOSM = new L.TileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
			maxZoom: 17,
			subdomains: ["otile1", "otile2", "otile3", "otile4"],
			attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
		});

		var mbTiles = new L.tileLayer('mbtiles.php?db=Espoo-hakkuut3.mbtiles&z={z}&x={x}&y={y}', {
		    tms: true,
		    attribution: 'Hakkuukartat: Espoon kaupunki',
		    opacity: 0.7
		});

		map = new L.Map("map",{
			zoom: 13,
            center: [60.235864, 24.642099],
			layers: [mapquestOSM, mbTiles]
		});

		var baseLayers = {
			"MapQuest Streets": mapquestOSM
		};
		var overlays = {
			"Local MBTiles File": mbTiles,
		};

		layersControl = new L.Control.Layers(baseLayers, overlays, {
			collapsed: false
		});

		map.addControl(layersControl);
	</script>
</body>
</html>
