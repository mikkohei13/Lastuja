<?php
header('Content-Type: text/html; charset=utf-8');

$url = "http://yle.fi/uutiset/alpha.yle.fi/plus/other/2016_linnunpontot/view/php/get_per_municipality.php?false&limit=500";
$json = file_get_contents($url);
$arr = json_decode($json, TRUE);

$tringaMuni['Espoo'] = 1;
$tringaMuni['Helsinki'] = 1;
$tringaMuni['Vantaa'] = 1;
$tringaMuni['Sipoo'] = 1;
$tringaMuni['Pornainen'] = 1;
$tringaMuni['Mäntsälä'] = 1;
$tringaMuni['Kauniainen'] = 1;
$tringaMuni['Kirkkonummi'] = 1;
$tringaMuni['Raasepori'] = 1;
$tringaMuni['Hanko'] = 1;
// more...

foreach ($arr as $key => $muniItem)
{
	if ($tringaMuni[$muniItem[1]])
	{
		$municipalities[$muniItem[1]] = $municipalities[$muniItem[1]];
	}
}

arsort($municipalities);

echo "<pre>";
foreach ($municipalities as $muni => $count)
{
	echo $muni . "\t" . $count . "\n";
}


