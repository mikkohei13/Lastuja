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


$startN = 60; $startE = 22; $endN = 65; $endE = 27; $size = 1; // debug data



$helpN = 0;
$helpE = 0;

$tempPolygon = "";

$masterKML = "";

// Horizontal lines

// KML polygon format: 24.1,60.1,0 24.2,60.1,0 24.2,60.2,0 24.1,60.2,0 24.1,60.1,0 


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
	<Folder>
		<name>Grid</name>
		<open>1</open>
		<?php echo $masterKML; ?>
	</Folder>
</Document>
</kml>
