<?php
header('Content-Type: text/html; charset=utf-8');

$municipalities = Array();

$url = "http://yle.fi/uutiset/alpha.yle.fi/plus/other/2016_linnunpontot/view/php/get_per_municipality.php?false&limit=500";
$json = file_get_contents($url);
$arr = json_decode($json, TRUE);

$tringaMuni['Espoo'] = 1;
$tringaMuni['Helsinki'] = 1;
$tringaMuni['Vantaa'] = 1;
$tringaMuni['Sipoo'] = 1;
$tringaMuni['Pornainen'] = 1;
$tringaMuni['Kerava'] = 1;
$tringaMuni['Tuusula'] = 1;
$tringaMuni['Järvenpää'] = 1;
$tringaMuni['Nurmijärvi'] = 1;
$tringaMuni['Hyvinkää'] = 1;
$tringaMuni['Mäntsälä'] = 1;
$tringaMuni['Vihti'] = 1;
$tringaMuni['Karkkila'] = 1;
$tringaMuni['Kauniainen'] = 1;
$tringaMuni['Kirkkonummi'] = 1;
$tringaMuni['Lohja'] = 1;
$tringaMuni['Siuntio'] = 1;
$tringaMuni['Inkoo'] = 1;
$tringaMuni['Raasepori'] = 1;
$tringaMuni['Hanko'] = 1;
// more...

//print_r ($arr); exit(); // debug

foreach ($arr as $key => $muniItem)
{

	if (isset($tringaMuni[$muniItem['municipality']]))
	{
		$municipalities[$muniItem['municipality']] = $muniItem['count'];
	}
//	print_r ($muniItem); exit(); // debug
}

arsort($municipalities);

$i = 1;
echo "<table id='miljoonaponttoa' class='basictable'>\n";
foreach ($municipalities as $muni => $count)
{
	echo "<tr><td>" . $i . ".</td><td>" . $muni . "</td><td>" . $count . "</td></tr>\n";
	$i++;
}
echo "</table>\n";


