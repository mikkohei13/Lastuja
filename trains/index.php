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

$im = imagecreate(500, 600);

$background_color = imagecolorallocate($im, 0, 51, 153);

// choose a color for the ellipse
$ellipseColor = imagecolorallocate($im, 255, 255, 255);

foreach($trains as $id => $arr)
{
	$y = 600 - (($arr['lat'] - 60) * 100);
	$x = ($arr['lon'] - 23) * 100;

/*
	$h = round(($arr['speed'] / 5), 0);
	if ($h < 5)
	{
		$h = 5;
	}
*/
	$h = 7;
	$w = 7;

	// draw the ellipse
	imagefilledellipse($im, $x, $y, $w, $h, $ellipseColor);
}

$timestamp = date("YmdHis");
$fileName = "images/trn_" . $timestamp . ".png";

header("Content-Type: image/png");
imagepng($im);

imagepng($im, $fileName);
imagedestroy($im);
