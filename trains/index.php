<?php

// TODO: security
$width = $_GET['width'];
$height = $_GET['height'];

if (isset($_GET['bgrcolor']))
{
	$bgrColor = "#" . $_GET['bgrcolor'];
}
else
{
	$bgrColor = "#003399";
}

if (isset($_GET['traincolor']))
{
	$trainColor = "#" . $_GET['traincolor'];
}
else
{
	$trainColor = "#FFFFFF";
}

// Junaverkon äärilaidat
$N = 67.4;
$S = 59.8;
$dN = $N - $S;
$scaleN = $height / $dN;

$W = 21.5;
$E = 30.7;
$dE = $E - $W;
$scaleE = $width / $dE;


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

$im = imagecreate($width, $height);

$background_color = hexColorAllocate($im, $bgrColor);

// choose a color for the ellipse
$ellipseColor = hexColorAllocate($im, $trainColor);

foreach($trains as $id => $arr)
{
	/*
	$y = 600 - (($arr['lat'] - 60) * 100);
	$x = ($arr['lon'] - 23) * 100;
	*/

	$y = $height - (($arr['lat'] - $S) * $scaleN);
	$x = ($arr['lon'] - $W) * $scaleE;

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

//	echo "$id : $y, $x <br />"; // debug
}

//echo "<pre>"; print_r(get_defined_vars()); // debug

// Corners
//$ellipseColor = imagecolorallocate($im, 255, 255, 0);
//imagefilledellipse($im, $x, $y, $w, $h, $ellipseColor);



$timestamp = date("YmdHis");
$fileName = "images/trn_" . $timestamp . ".png";

header("Content-Type: image/png");
imagepng($im);

imagepng($im, $fileName);
imagedestroy($im);


// balamm
// http://forums.devshed.com/php-development-5/gd-hex-resource-imagecolorallocate-265852.html
// http://stackoverflow.com/questions/2957609/how-can-i-give-a-color-to-imagecolorallocate

function hexColorAllocate($im,$hex){
    $hex = ltrim($hex,'#');
    $a = hexdec(substr($hex,0,2));
    $b = hexdec(substr($hex,2,2));
    $c = hexdec(substr($hex,4,2));
    return imagecolorallocate($im, $a, $b, $c); 
}