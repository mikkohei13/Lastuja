<?php

/*
Tool that creates a KML grid file

Input:
- lat & lon of the SW corner of the gridded area (decimal degrees)
- Lat & lon of the NE corner of the gridded area (decimal degrees)
- Grid size (decimal degrees)

*/

// @ temporarily suppresses errors of missing values

@$startN = $_GET['startlat'];
@$startE = $_GET['startlon'];

@$endN = $_GET['endlat'];
@$endE = $_GET['endlon'];

@$size = $_GET['size'];


$startN = 60; $startE = 24; $endN = 65; $endE = 27; $size = 1; // debug data



$helpN = 0;
$helpE = 0;


// Horizontal lines

$helpE = $startE;
while ($helpE <= $endE)
{
	echo "$startN, $helpE;\n";
	$helpE = $helpE + $size;
}
