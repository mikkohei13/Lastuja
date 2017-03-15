<!DOCTYPE html>
<html lang="en" class="no-js">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Ownmaps</title>
		<link rel="shortcut icon" href="favicon.ico">

		<link rel="stylesheet" href="media/app.css?c=<?php echo rand(0,10000); ?>" media="all" />
		<link rel="stylesheet" href="node_modules/leaflet/dist/leaflet.css" media="all" />

	    <script src="node_modules/jquery/dist/jquery.min.js"></script>
	    <script src="node_modules/leaflet/dist/leaflet.js"></script>
	    <script src="node_modules/moment/moment.js"></script>

	</head>
	<body>
		<header>
		</header>
		<div id="content">
			<div id="mymap"></div>
		</div>
		<div id="time"></div>

		<script src="keys.js"></script>
		<script src="map.js"></script>
		<?php
        $u = rand(0, 10000);
		if ("path" == $_GET['p']) {
			echo "<script src='path.js?$u'></script>";
		}
		if ("latest" == $_GET['p']) {
            echo "<script src='latest.js?$u'></script>";
		}
		?>
	</body>
</html>
