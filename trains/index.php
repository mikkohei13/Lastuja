<?php

// TODO: security
if (!ctype_digit($_GET['width']) || !ctype_digit($_GET['height']))
{
    exit("width and height must be integers");
}
$width = $_GET['width'];
$height = $_GET['height'];


if (isset($_GET['bgrcolor']))
{
	if (!ctype_xdigit($_GET['bgrcolor']))
	{
        exit("bgrcolor must be hexadecimal");
	}

	$bgrColor = "#" . $_GET['bgrcolor'];
}
else
{
	$bgrColor = "#003399";
}

if (isset($_GET['traincolor']))
{
	if (!ctype_xdigit($_GET['traincolor']))
	{
        exit("traincolor must be hexadecimal");
	}

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
	$trains[$id]['id'] = $id; // needed because sorting changes array id's
	$trains[$id]['lat'] = $latlon[0];
	$trains[$id]['lon'] = $latlon[1];
	$trains[$id]['speed'] = (int) $train->speed;
	$trains[$id]['from'] = (string) $train->from;
	$trains[$id]['to'] = (string) $train->to;
}

// Sort by speed desc
usort($trains, function($a, $b) {
    return $b['speed'] - $a['speed'];
});

$trainCount = count($trains);

//echo "<pre>"; print_r ($trains); exit(); // debug

$im = imagecreate($width, $height);

$background_color = hexColorAllocate($im, $bgrColor);

// choose a color for the ellipse
$ellipseColor = hexColorAllocate($im, $trainColor);

$prevX = 0;
$prevY = $height;

foreach($trains as $id => $arr)
{
	$y = scaleLat($arr['lat']);
	$x = scaleLon($arr['lon']);

	/*
	// New color for each line/dot
	$rgb = randomPleasingColorRGB();
	$ellipseColor = imagecolorallocate($im, $rgb['R'], $rgb['G'], $rgb['B']);
	*/

	if (isset($_GET['showdots']))
	{
		// draw the ellipse
		$h = 7;
		$w = 7;
		imagefilledellipse($im, $x, $y, $w, $h, $ellipseColor);
	}

	if (isset($_GET['showline']))
	{
		// Line between trains
		imageline($im, $prevX, $prevY, $x, $y, $ellipseColor);
		$prevX = $x;
		$prevY = $y;
	}

	// Info
	$font = 5;
	if (isset($_GET['showid']))
	{
		imagestring ($im, $font, $x, $y, $arr['id'], $ellipseColor);
	}
	elseif (isset($_GET['showspeed']))
	{
		imagestring ($im, $font, $x, $y, $arr['speed'], $ellipseColor);
	}



//	echo "$id : $y, $x <br />"; // debug
}

//echo "<pre>"; print_r(get_defined_vars()); // debug

// Corners: testing that scaling works correctly
/*
$ellipseColor = imagecolorallocate($im, 255, 255, 0);
imagefilledellipse($im, scaleLon($W), scaleLat($S), 10, 10, $ellipseColor);
imagefilledellipse($im, scaleLon($W), scaleLat($N), 10, 10, $ellipseColor);
imagefilledellipse($im, scaleLon($E), scaleLat($S), 10, 10, $ellipseColor);
imagefilledellipse($im, scaleLon($E), scaleLat($N), 10, 10, $ellipseColor);
*/

if (isset($_GET['showcount']))
{
	imagestring($im, 5, 4, 4, $trainCount, $ellipseColor);
}

/*
// Save image
$timestamp = date("YmdHis");
$fileName = "images/trn_" . $timestamp . ".png";
imagepng($im, $fileName);
*/

header("Content-Type: image/png");
imagepng($im);

imagedestroy($im);


// balamm
// http://forums.devshed.com/php-development-5/gd-hex-resource-imagecolorallocate-265852.html
// http://stackoverflow.com/questions/2957609/how-can-i-give-a-color-to-imagecolorallocate

function hexColorAllocate($im, $hex){
    $hex = ltrim($hex,'#');
    $a = hexdec(substr($hex,0,2));
    $b = hexdec(substr($hex,2,2));
    $c = hexdec(substr($hex,4,2));
    return imagecolorallocate($im, $a, $b, $c); 
}

function scaleLat($lat)
{
	global $height;
	global $S;
	global $scaleN;

	$y = $height - (($lat - $S) * $scaleN);
	return $y;
}

function scaleLon($lon)
{
	global $W;
	global $scaleE;

	$x = ($lon - $W) * $scaleE;

	return $x;
}

function randomPleasingColorRGB()
{
	$seedR = 13;
	$seedG = 67;
	$seedB = 127;

	$randR = mt_rand(0, 100) / 100 * 255;
	$randG = mt_rand(0, 100) / 100 * 255;
	$randB = mt_rand(0, 100) / 100 * 255;

	$color['R'] = round(($seedR + $randR) / 2, 0);
	$color['G'] = round(($seedG + $randG) / 2, 0);
	$color['B'] = round(($seedB + $randB) / 2, 0);

	return $color;
}

