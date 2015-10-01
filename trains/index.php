<?php

$url = "http://188.117.35.14/TrainRSS/TrainService.svc/AllTrains?showspeed=true&hash=3144";
$xmlString = file_get_contents($url);
$xmlString = str_replace("georss:point", "georss_point", $xmlString);
$xml = simplexml_load_string($xmlString);

foreach($xml->channel->item as $train)
{
	$id = (string) $train->guid;
	$latlon = explode(" ", (string) $train->georss_point);
	$trains[$id]['lat'] = $latlon[0];
	$trains[$id]['lon'] = $latlon[1];
	$trains[$id]['speed'] = (int) $train->speed;
	$trains[$id]['from'] = (string) $train->from;
	$trains[$id]['to'] = (string) $train->to;
}

// echo "<pre>"; print_r ($trains); exit(); // debug

$im = imagecreate(500, 500);

$background_color = imagecolorallocate($im, 0, 200, 0);

// choose a color for the ellipse
$ellipseColor = imagecolorallocate($im, 0, 255, 255);

foreach($trains as $id => $arr)
{
	// draw the ellipse
	imagefilledellipse($im, $arr['lat'], $arr['lon'], 10, 10, $ellipseColor);
}

header("Content-Type: image/png");
imagepng($im);
imagedestroy($im);
