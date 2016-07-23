<?php

$text = "koulu";
$url = "https://oiva.evira.fi/kohteet/basic/?text=" . $text . "&ov=1.2.1&mode=";

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
}

// Sort by gradeAverage
uasort($simpleDataArr, function($a, $b) {
    return $a['gradeAverage'] - $b['gradeAverage'];
});


//header('Content-Type: application/json; charset=utf-8');
print_r($simpleDataArr);
print_r($dataArr);


/*

TODO
- toimiva sorttaus!
- hakusanan / urlin enkoodaus, jotta ääkköset toimivat
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
