<?php

/*
Tool that creates a KML grid file

Input:
- lat & lon of the SW corner of the gridded area (decimal degrees)
- Lat & lon of the NE corner of the gridded area (decimal degrees)
- Grid size (decimal degrees)

*/

// @ temporarily suppresses errors of missing values

$debug = FALSE;

@$startN = $_GET['startlat'];
@$startE = $_GET['startlon'];

@$endN = $_GET['endlat'];
@$endE = $_GET['endlon'];

@$size = $_GET['size'];


$startN = 59.75; $startE = 22.75; $endN = 61.05; $endE = 25.65; $size = 0.1; // debug data
$startN = 59.75; $startE = 22.75; $endN = 61.42; $endE = 26.32; $size = 0.1; // debug data
$startN = 55; $startE = 20; $endN = 65; $endE = 30; $size = 1.27; // debug data


$styleWidth = "2";
$styleColor = "ccffccff";

// ---------------------


$helpN = 0;
$helpE = 0;

$tempPolygon = "";

$masterKML = "";

// KML polygon format: 24.1,60.1,0 24.2,60.1,0 24.2,60.2,0 24.1,60.2,0 24.1,60.1,0 


// Horizontal lines

$helpN = $startN;
while ($helpN <= $endN)
{
	$tempPolygon = "";
	$helpE = $startE;
	while ($helpE <= $endE)
	{
		$tempPolygon .= "$helpE,$helpN,0 ";
		$helpE = $helpE + $size;
	}

	addPolygon($tempPolygon);
	$helpN = $helpN + $size;
}

// Vertical lines

$helpE = $startE;
while ($helpE <= $endE)
{
	$tempPolygon = "";
	$helpN = $startN;
	while ($helpN <= $endN)
	{
		$tempPolygon .= "$helpE,$helpN,0 ";
		$helpN = $helpN + $size;
	}

	addPolygon($tempPolygon);
	$helpE = $helpE + $size;
}


function addPolygon($polygon)
{
	global $masterKML;

	$partialKML = "
		<Placemark id=\"poly\">
			<name>Polygon</name>
			<styleUrl>#gridCreatorStyle</styleUrl>
			<LineString>
				<coordinates>
					" . $polygon . " 
				</coordinates>
			</LineString>
		</Placemark>
	";

	$masterKML .= $partialKML;
}

$debug = FALSE;

if (! $debug)
{
	header('Content-type: application/vnd.google-earth.kml+xml');
	header('Content-Disposition: attachment; filename="grid.kml"');
	echo '<?xml version="1.0" encoding="UTF-8"?>';
}

?>

<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
<Document>
	<name>Grid</name>
	<open>1</open>
	<description>Made with KML Grid Creator</description>
	<Style id="gridCreatorStyle">
		<LineStyle>
			<color><?php echo $styleColor; ?></color>
			<width><?php echo $styleWidth; ?></width>
		</LineStyle>
	</Style>
	<Folder>
		<name>Grid</name>
		<open>1</open>
		<?php echo $masterKML; ?>
	</Folder>
</Document>
</kml>
