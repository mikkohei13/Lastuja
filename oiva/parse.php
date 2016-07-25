<?php
header('Content-Type: text/html; charset=utf-8');

$qRaw = $_GET['q'];
$q = urlencode(utf8_decode($qRaw));
$url = "https://oiva.evira.fi/kohteet/basic/?text=" . $q . "&ov=1.2.1&mode=";

//exit($url); // debug

$dataJSON = file_get_contents($url);
 
$dataArr = json_decode($dataJSON, TRUE);

$simpleDataArr = Array();

foreach ($dataArr as $number => $restaurantArr)
{
	$id = sha1($restaurantArr['uniqueKey']);
	$simpleDataArr[$id]['name'] = $restaurantArr['markkinointiNimi'];

	$reportCount = 0;
	$reportGradeTotal = 0;

	foreach ($restaurantArr['raporttiList'] as $reportNumber => $reportArr)
	{
		$reportGradeTotal = $reportGradeTotal + $reportArr['arvosana'];
		$reportCount++;
	}

	$simpleDataArr[$id]['gradeAverage'] = round(($reportGradeTotal / $reportCount), 1);
	$simpleDataArr[$id]['reportCount'] = $reportCount;
}

// Sort by gradeAverage
uasort($simpleDataArr, function($b, $a) {
	if ($a['gradeAverage'] > $b['gradeAverage'])
	{
	    return 1;
	}
	elseif ($a['gradeAverage'] < $b['gradeAverage'])
	{
	    return -1;
	}
	elseif ($a['gradeAverage'] == $b['gradeAverage'])
	{
	    return 0;
	}
});


//header('Content-Type: application/json; charset=utf-8');
print_r($simpleDataArr);
//print_r($dataArr); // debug


/*

TODO
- toimiva sorttaus!
- raporttien määrä
- uusimman ja vanhimman arvion pvm, jotta saman ravintolan eri yritysnimen alla olevat arviot voi erottaa toisistaan (esim. Pappa Pizza)
- linkki uusimpaan raporttiin

Arvosanat
1 = oivallinen
2 = hyvä
3 = korjattavaa
4 = huono

Kohdetyypit
3 = myllyt ja leipomot
8 = myymälä
9 = ravintola
11 = kahvila
13 = ruokala


*/
